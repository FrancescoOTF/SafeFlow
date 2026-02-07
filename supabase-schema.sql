-- SafeFlow Database Schema
-- Esegui questo script nel SQL Editor di Supabase

-- ============================================
-- TABELLE
-- ============================================

-- Tabella clienti corporate
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabella documenti con scadenze
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  document_name TEXT NOT NULL,
  expiry_date DATE NOT NULL,
  alert_days INTEGER DEFAULT 60,
  notes TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- INDICI per performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_documents_client_id ON documents(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_expiry_date ON documents(expiry_date);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Attiva RLS sulle tabelle
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES per clients
-- ============================================

-- Elimina eventuali policy esistenti
DROP POLICY IF EXISTS "Users can view own clients" ON clients;
DROP POLICY IF EXISTS "Users can insert own clients" ON clients;
DROP POLICY IF EXISTS "Users can update own clients" ON clients;
DROP POLICY IF EXISTS "Users can delete own clients" ON clients;

-- Policy SELECT: gli utenti possono vedere solo i propri clienti
CREATE POLICY "Users can view own clients"
  ON clients FOR SELECT
  USING (auth.uid() = user_id);

-- Policy INSERT: gli utenti possono inserire clienti solo per sé stessi
CREATE POLICY "Users can insert own clients"
  ON clients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy UPDATE: gli utenti possono modificare solo i propri clienti
CREATE POLICY "Users can update own clients"
  ON clients FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy DELETE: gli utenti possono eliminare solo i propri clienti
CREATE POLICY "Users can delete own clients"
  ON clients FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- POLICIES per documents
-- ============================================

-- Elimina eventuali policy esistenti
DROP POLICY IF EXISTS "Users can view documents of own clients" ON documents;
DROP POLICY IF EXISTS "Users can insert documents for own clients" ON documents;
DROP POLICY IF EXISTS "Users can update documents of own clients" ON documents;
DROP POLICY IF EXISTS "Users can delete documents of own clients" ON documents;

-- Policy SELECT: gli utenti possono vedere i documenti dei propri clienti
CREATE POLICY "Users can view documents of own clients"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = documents.client_id
      AND clients.user_id = auth.uid()
    )
  );

-- Policy INSERT: gli utenti possono inserire documenti solo per i propri clienti
CREATE POLICY "Users can insert documents for own clients"
  ON documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = documents.client_id
      AND clients.user_id = auth.uid()
    )
  );

-- Policy UPDATE: gli utenti possono modificare documenti solo dei propri clienti
CREATE POLICY "Users can update documents of own clients"
  ON documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = documents.client_id
      AND clients.user_id = auth.uid()
    )
  );

-- Policy DELETE: gli utenti possono eliminare documenti solo dei propri clienti
CREATE POLICY "Users can delete documents of own clients"
  ON documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = documents.client_id
      AND clients.user_id = auth.uid()
    )
  );

-- ============================================
-- FUNZIONI HELPER (opzionali ma utili)
-- ============================================

-- Funzione per aggiornare automaticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger per clients
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger per documents
DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VISTA per documenti in scadenza (opzionale)
-- ============================================

CREATE OR REPLACE VIEW documents_expiring_soon AS
SELECT 
  d.*,
  c.name as client_name,
  c.user_id,
  EXTRACT(DAY FROM (d.expiry_date - CURRENT_DATE)) as days_until_expiry
FROM documents d
JOIN clients c ON d.client_id = c.id
WHERE d.expiry_date >= CURRENT_DATE
  AND d.expiry_date <= CURRENT_DATE + INTERVAL '90 days'
ORDER BY d.expiry_date ASC;

-- ============================================
-- DATI DI TEST (opzionale - rimuovi in produzione)
-- ============================================

-- Inserisci un cliente di esempio (sostituisci USER_ID con un ID reale)
-- INSERT INTO clients (user_id, name, contact_person, email)
-- VALUES (
--   'YOUR_USER_ID_HERE',
--   'Enel Energia S.p.A.',
--   'Mario Rossi',
--   'mario.rossi@enel.it'
-- );

-- Inserisci alcuni documenti di esempio
-- INSERT INTO documents (client_id, document_name, expiry_date, alert_days)
-- VALUES 
--   ('CLIENT_ID_HERE', 'DURC', '2025-06-30', 60),
--   ('CLIENT_ID_HERE', 'Certificazione SOA', '2025-12-31', 90),
--   ('CLIENT_ID_HERE', 'Polizza RC', '2025-03-15', 30);
