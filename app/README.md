# SafeFlow - Software per il controllo scadenze documentali

Software B2B per gestire scadenze documentali con clienti corporate. Sostituisce l'Excel delle scadenze ed evita blocchi operativi.

## 📋 Caratteristiche

- ✅ Gestione clienti corporate
- ✅ Tracking scadenze documentali (DURC, SOA, certificazioni, polizze)
- ✅ Dashboard con overview stati documenti
- ✅ Calendario scadenze
- ✅ Sistema notifiche/alert configurabili
- ✅ Autenticazione utenti con Supabase
- ✅ Pagamenti con Stripe (3 piani + custom)

## 🛠 Stack Tecnologico

- **Frontend**: React + Vite
- **Styling**: CSS Custom (colori brand SafeFlow)
- **Backend/Database**: Supabase (PostgreSQL)
- **Autenticazione**: Supabase Auth
- **Pagamenti**: Stripe
- **Hosting**: Vercel (consigliato)

## 📦 Installazione Locale

### Prerequisiti

- Node.js 18+ installato
- Account Supabase (gratuito)
- Account Stripe (gratuito per test)

### 1. Clona il progetto

```bash
git clone <url-tua-repo>
cd safeflow
```

### 2. Installa le dipendenze

```bash
npm install
```

### 3. Configura le variabili d'ambiente

Copia il file `.env.example` in `.env`:

```bash
cp .env.example .env
```

Poi modifica `.env` con i tuoi valori (vedi sezione Configurazione sotto).

### 4. Avvia il server di sviluppo

```bash
npm run dev
```

L'app sarà disponibile su `http://localhost:3000`

## ⚙️ Configurazione

### Supabase Setup

1. Vai su [supabase.com](https://supabase.com) e crea un account
2. Crea un nuovo progetto
3. Vai in **Project Settings > API**
4. Copia:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

#### Crea le tabelle nel database

Vai in **SQL Editor** su Supabase e esegui questo SQL:

```sql
-- Tabella clienti
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabella documenti
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  document_name TEXT NOT NULL,
  expiry_date DATE NOT NULL,
  alert_days INTEGER DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Index per performance
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_documents_client_id ON documents(client_id);
CREATE INDEX idx_documents_expiry_date ON documents(expiry_date);

-- Row Level Security (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy per clients
CREATE POLICY "Users can view own clients"
  ON clients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients"
  ON clients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients"
  ON clients FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients"
  ON clients FOR DELETE
  USING (auth.uid() = user_id);

-- Policy per documents
CREATE POLICY "Users can view documents of own clients"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = documents.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert documents for own clients"
  ON documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = documents.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update documents of own clients"
  ON documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = documents.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete documents of own clients"
  ON documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = documents.client_id
      AND clients.user_id = auth.uid()
    )
  );
```

### Stripe Setup

1. Vai su [stripe.com](https://stripe.com) e crea un account
2. In **Developers > API keys**:
   - Copia `Publishable key` → `VITE_STRIPE_PUBLIC_KEY`
3. In **Products > Add product**:
   - Crea i prodotti Basic (€19.90), Pro (€45.90), Enterprise (€199.90)
   - Per ogni prodotto, copia il `Price ID` (inizia con `price_`)
   - Inseriscili in `.env` come `VITE_STRIPE_PRICE_BASIC`, etc.

**NOTA**: Per ora l'integrazione Stripe richiede un backend per creare le checkout sessions. Questo può essere implementato con:
- Supabase Edge Functions
- Vercel Serverless Functions
- Un backend separato

Per testare senza backend, puoi commentare la funzione `handleSubscribe` in `PricingPage.jsx`.

## 🚀 Deploy su Vercel

### 1. Pusha il codice su GitHub

```bash
git init
git add .
git commit -m "Initial commit SafeFlow"
git branch -M main
git remote add origin <url-tua-repo>
git push -u origin main
```

### 2. Deploy su Vercel

1. Vai su [vercel.com](https://vercel.com)
2. Clicca **Add New > Project**
3. Importa la tua repository GitHub
4. In **Environment Variables** aggiungi tutte le variabili del file `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_STRIPE_PUBLIC_KEY`
   - `VITE_STRIPE_PRICE_BASIC`
   - `VITE_STRIPE_PRICE_PRO`
   - `VITE_STRIPE_PRICE_ENTERPRISE`
5. Clicca **Deploy**

Ogni push su `main` trigghererà un deploy automatico!

## 📁 Struttura del Progetto

```
safeflow/
├── public/
│   └── logo.png              # Logo SafeFlow
├── src/
│   ├── components/           # Componenti riusabili
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── DashboardNav.jsx
│   ├── pages/                # Pagine dell'app
│   │   ├── LandingPage.jsx   # Homepage
│   │   ├── LoginPage.jsx     # Login
│   │   ├── RegisterPage.jsx  # Registrazione
│   │   ├── PricingPage.jsx   # Prezzi
│   │   ├── DashboardPage.jsx # Dashboard principale
│   │   ├── ClientsPage.jsx   # Gestione clienti/documenti
│   │   └── CalendarPage.jsx  # Calendario scadenze
│   ├── lib/
│   │   ├── supabase.js       # Client Supabase
│   │   └── stripe.js         # Configurazione Stripe
│   ├── styles/
│   │   └── global.css        # Stili globali + variabili CSS
│   ├── App.jsx               # Router principale
│   └── main.jsx              # Entry point
├── .env.example              # Template variabili d'ambiente
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Brand Colors

- Primary: `#FF6A1A`
- Primary Dark: `#C73C00`
- Accent: `#FD4912`
- Background: `#0A0A0A`

## 📝 Script NPM

```bash
npm run dev      # Avvia dev server
npm run build    # Build per produzione
npm run preview  # Preview build produzione
```

## 🔐 Sicurezza

- Row Level Security (RLS) attivo su Supabase
- Le variabili `VITE_*` sono esposte nel frontend (solo chiavi pubbliche!)
- **MAI** mettere secret keys nel frontend

## 📧 Funzionalità Email Notifiche

Le notifiche email richiedono un backend (Edge Functions o serverless) che:
1. Controlla periodicamente i documenti in scadenza
2. Invia email tramite servizio SMTP o Resend/SendGrid

Questo può essere implementato con:
- **Supabase Cron Jobs + Edge Functions**
- **Vercel Cron Jobs**

## 🐛 Troubleshooting

### "Supabase client error"
- Verifica che le variabili `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` siano corrette
- Assicurati di aver creato le tabelle nel database

### "Cannot read property of undefined" su documenti
- Verifica che le RLS policies siano attive
- Controlla che l'utente sia autenticato

### Build error su Vercel
- Controlla che tutte le env variables siano configurate su Vercel
- Verifica che non ci siano errori TypeScript/ESLint

## 📞 Supporto

Per problemi o domande, apri una issue su GitHub.

## 📄 Licenza

Proprietario - SafeFlow © 2025
