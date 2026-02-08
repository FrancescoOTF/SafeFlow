-- ============================================
-- SAFEFLOW MVP DATABASE SCHEMA
-- ============================================

-- Drop existing tables if any
DROP TABLE IF EXISTS event_logs CASCADE;
DROP TABLE IF EXISTS document_uploads CASCADE;
DROP TABLE IF EXISTS client_requirements CASCADE;
DROP TABLE IF EXISTS document_types CASCADE;
DROP TABLE IF EXISTS corporate_clients CASCADE;

-- Corporate Clients
CREATE TABLE corporate_clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Document Types
CREATE TABLE document_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Client Requirements
CREATE TABLE client_requirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  corporate_client_id UUID REFERENCES corporate_clients(id) ON DELETE CASCADE NOT NULL,
  document_type_id UUID REFERENCES document_types(id) ON DELETE CASCADE NOT NULL,
  required BOOLEAN DEFAULT true,
  frequency_days INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(corporate_client_id, document_type_id)
);

-- Document Uploads
CREATE TABLE document_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  corporate_client_id UUID REFERENCES corporate_clients(id) ON DELETE CASCADE NOT NULL,
  document_type_id UUID REFERENCES document_types(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT,
  filename TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  expires_at DATE NOT NULL,
  status TEXT CHECK (status IN ('OK', 'RISK', 'EXPIRED', 'MISSING')) DEFAULT 'OK',
  last_reminder_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Event Logs
CREATE TABLE event_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  corporate_client_id UUID REFERENCES corporate_clients(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes
CREATE INDEX idx_corporate_clients_user_id ON corporate_clients(user_id);
CREATE INDEX idx_client_requirements_client ON client_requirements(corporate_client_id);
CREATE INDEX idx_document_uploads_client ON document_uploads(corporate_client_id);
CREATE INDEX idx_document_uploads_expires ON document_uploads(expires_at);
CREATE INDEX idx_event_logs_client ON event_logs(corporate_client_id);

-- RLS
ALTER TABLE corporate_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_logs ENABLE ROW LEVEL SECURITY;

-- Policies corporate_clients
CREATE POLICY "Users can view own corporate clients" ON corporate_clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own corporate clients" ON corporate_clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own corporate clients" ON corporate_clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own corporate clients" ON corporate_clients FOR DELETE USING (auth.uid() = user_id);

-- Policies document_types
CREATE POLICY "Anyone can view document types" ON document_types FOR SELECT USING (true);

-- Policies client_requirements
CREATE POLICY "Users can view requirements of own clients" ON client_requirements FOR SELECT USING (
  EXISTS (SELECT 1 FROM corporate_clients WHERE corporate_clients.id = client_requirements.corporate_client_id AND corporate_clients.user_id = auth.uid())
);
CREATE POLICY "Users can insert requirements for own clients" ON client_requirements FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM corporate_clients WHERE corporate_clients.id = client_requirements.corporate_client_id AND corporate_clients.user_id = auth.uid())
);
CREATE POLICY "Users can update requirements of own clients" ON client_requirements FOR UPDATE USING (
  EXISTS (SELECT 1 FROM corporate_clients WHERE corporate_clients.id = client_requirements.corporate_client_id AND corporate_clients.user_id = auth.uid())
);
CREATE POLICY "Users can delete requirements of own clients" ON client_requirements FOR DELETE USING (
  EXISTS (SELECT 1 FROM corporate_clients WHERE corporate_clients.id = client_requirements.corporate_client_id AND corporate_clients.user_id = auth.uid())
);

-- Policies document_uploads
CREATE POLICY "Users can view uploads of own clients" ON document_uploads FOR SELECT USING (
  EXISTS (SELECT 1 FROM corporate_clients WHERE corporate_clients.id = document_uploads.corporate_client_id AND corporate_clients.user_id = auth.uid())
);
CREATE POLICY "Users can insert uploads for own clients" ON document_uploads FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM corporate_clients WHERE corporate_clients.id = document_uploads.corporate_client_id AND corporate_clients.user_id = auth.uid())
);
CREATE POLICY "Users can update uploads of own clients" ON document_uploads FOR UPDATE USING (
  EXISTS (SELECT 1 FROM corporate_clients WHERE corporate_clients.id = document_uploads.corporate_client_id AND corporate_clients.user_id = auth.uid())
);
CREATE POLICY "Users can delete uploads of own clients" ON document_uploads FOR DELETE USING (
  EXISTS (SELECT 1 FROM corporate_clients WHERE corporate_clients.id = document_uploads.corporate_client_id AND corporate_clients.user_id = auth.uid())
);

-- Policies event_logs
CREATE POLICY "Users can view logs of own clients" ON event_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM corporate_clients WHERE corporate_clients.id = event_logs.corporate_client_id AND corporate_clients.user_id = auth.uid())
);

-- ============================================
-- RPC FUNCTION FOR RISK CALCULATION
-- ============================================

CREATE OR REPLACE FUNCTION public.get_clients_risk()
RETURNS TABLE (
  client_id UUID,
  name TEXT,
  score INT,
  level TEXT,
  expired INT,
  risk INT,
  missing INT
) 
LANGUAGE sql
STABLE
AS $$
  WITH client_requirements_status AS (
    SELECT 
      cc.id AS client_id,
      cc.name,
      cr.document_type_id,
      cr.required,
      (
        SELECT du.expires_at
        FROM document_uploads du
        WHERE du.corporate_client_id = cc.id
          AND du.document_type_id = cr.document_type_id
        ORDER BY du.expires_at DESC
        LIMIT 1
      ) AS best_expires_at
    FROM corporate_clients cc
    INNER JOIN client_requirements cr ON cr.corporate_client_id = cc.id
    WHERE cc.user_id = auth.uid()
      AND cr.required = true
  ),
  client_requirement_scores AS (
    SELECT 
      client_id,
      name,
      document_type_id,
      CASE
        WHEN best_expires_at IS NULL THEN 'MISSING'
        WHEN best_expires_at < CURRENT_DATE THEN 'EXPIRED'
        WHEN best_expires_at <= CURRENT_DATE + 30 THEN 'RISK'
        ELSE 'OK'
      END AS requirement_status
    FROM client_requirements_status
  ),
  client_scores AS (
    SELECT 
      client_id,
      name,
      SUM(
        CASE requirement_status
          WHEN 'EXPIRED' THEN 5
          WHEN 'RISK' THEN 2
          WHEN 'MISSING' THEN 3
          ELSE 0
        END
      )::INT AS score,
      SUM(CASE WHEN requirement_status = 'EXPIRED' THEN 1 ELSE 0 END)::INT AS expired,
      SUM(CASE WHEN requirement_status = 'RISK' THEN 1 ELSE 0 END)::INT AS risk,
      SUM(CASE WHEN requirement_status = 'MISSING' THEN 1 ELSE 0 END)::INT AS missing
    FROM client_requirement_scores
    GROUP BY client_id, name
  )
  SELECT 
    cs.client_id,
    cs.name,
    cs.score,
    CASE
      WHEN cs.score >= 9 THEN 'HIGH'
      WHEN cs.score >= 4 THEN 'MEDIUM'
      ELSE 'LOW'
    END AS level,
    cs.expired,
    cs.risk,
    cs.missing
  FROM client_scores cs
  ORDER BY cs.score DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_clients_risk() TO authenticated;

-- ============================================
-- SEED DATA
-- ============================================

INSERT INTO document_types (name, description) VALUES
('DURC', 'Documento Unico Regolarità Contributiva'),
('Certificazione SOA', 'Attestazione SOA per opere pubbliche'),
('Visura Camerale', 'Visura Camera di Commercio'),
('Polizza RC', 'Polizza Responsabilità Civile'),
('Certificazione ISO 9001', 'Certificazione Qualità ISO 9001'),
('DUVRI', 'Documento Unico Valutazione Rischi Interferenze'),
('Abilitazione Prefettura', 'Abilitazione lavori sensibili'),
('Piano Sicurezza', 'Piano Operativo di Sicurezza');

-- SEED CLIENTS (replace YOUR_USER_ID)
-- Run: SELECT id FROM auth.users; to get your user_id
-- Then replace and execute the DO block below
