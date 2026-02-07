# Guida al Deployment di SafeFlow

Questa guida ti accompagna passo-passo nel mettere online SafeFlow.

## 📋 Checklist Pre-Deployment

Prima di iniziare, assicurati di avere:
- [ ] Un account GitHub
- [ ] Un account Supabase (gratuito)
- [ ] Un account Stripe (gratuito)
- [ ] Un account Vercel (gratuito)

---

## 1️⃣ Setup Supabase (Database + Autenticazione)

### Passo 1: Crea il progetto

1. Vai su [supabase.com](https://supabase.com)
2. Clicca **New Project**
3. Scegli un nome (es. "safeflow-prod")
4. Scegli una password sicura per il database
5. Seleziona la region più vicina (es. EU West)
6. Clicca **Create new project**
7. Attendi 2-3 minuti per il provisioning

### Passo 2: Configura il database

1. Nel menu laterale, vai in **SQL Editor**
2. Clicca **New query**
3. Copia e incolla il contenuto del file `supabase-schema.sql`
4. Clicca **Run** (in basso a destra)
5. Dovresti vedere "Success. No rows returned"

### Passo 3: Ottieni le credenziali API

1. Vai in **Project Settings** (icona ingranaggio in basso a sinistra)
2. Vai in **API**
3. Copia questi valori (li userai dopo):
   - **Project URL** → salva come `SUPABASE_URL`
   - **anon public** key → salva come `SUPABASE_ANON_KEY`

### Passo 4: Configura l'autenticazione email

1. Vai in **Authentication** > **Providers**
2. Assicurati che **Email** sia abilitato
3. (Opzionale) Personalizza le email template in **Email Templates**

---

## 2️⃣ Setup Stripe (Pagamenti)

### Passo 1: Crea l'account

1. Vai su [stripe.com](https://stripe.com)
2. Registrati (puoi testare senza verificare l'account)
3. Attiva la **Test mode** (switch in alto a destra)

### Passo 2: Ottieni le API keys

1. Vai in **Developers** > **API keys**
2. Copia la **Publishable key** → salva come `STRIPE_PUBLIC_KEY`
3. (Tieni aperta questa pagina, ti servirà dopo)

### Passo 3: Crea i prodotti

1. Vai in **Products** > **Add product**

**Prodotto 1: Basic**
- Name: `SafeFlow Basic`
- Price: `€19.90`
- Billing period: `Monthly`
- Clicca **Save product**
- Copia il **Price ID** (inizia con `price_`) → salva come `STRIPE_PRICE_BASIC`

**Prodotto 2: Pro**
- Name: `SafeFlow Pro`
- Price: `€45.90`
- Billing period: `Monthly`
- Clicca **Save product**
- Copia il **Price ID** → salva come `STRIPE_PRICE_PRO`

**Prodotto 3: Enterprise**
- Name: `SafeFlow Enterprise`
- Price: `€199.90`
- Billing period: `Monthly`
- Clicca **Save product**
- Copia il **Price ID** → salva come `STRIPE_PRICE_ENTERPRISE`

---

## 3️⃣ Carica il Codice su GitHub

### Passo 1: Crea una repository

1. Vai su [github.com](https://github.com)
2. Clicca **New repository** (bottone verde in alto a destra)
3. Nome: `safeflow`
4. Lascia **Public** (o scegli Private se preferisci)
5. **NON** selezionare "Initialize with README"
6. Clicca **Create repository**

### Passo 2: Carica i file

**Opzione A: Via GitHub Web (più semplice)**

1. Nella pagina della repository, clicca **uploading an existing file**
2. Trascina TUTTI i file del progetto SafeFlow
3. Scrivi "Initial commit" come messaggio
4. Clicca **Commit changes**

**Opzione B: Via Git (se hai Git installato)**

```bash
# Nella cartella safeflow
git init
git add .
git commit -m "Initial commit SafeFlow"
git branch -M main
git remote add origin https://github.com/TUO_USERNAME/safeflow.git
git push -u origin main
```

---

## 4️⃣ Deploy su Vercel

### Passo 1: Collega GitHub

1. Vai su [vercel.com](https://vercel.com)
2. Clicca **Sign up** e scegli **Continue with GitHub**
3. Autorizza Vercel ad accedere alle tue repository

### Passo 2: Importa il progetto

1. Dalla dashboard Vercel, clicca **Add New** > **Project**
2. Cerca `safeflow` nella lista delle tue repository
3. Clicca **Import**

### Passo 3: Configura le variabili d'ambiente

Prima di fare il deploy, clicca su **Environment Variables**.

Aggiungi TUTTE queste variabili (usa i valori che hai salvato prima):

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Il tuo Project URL di Supabase |
| `VITE_SUPABASE_ANON_KEY` | La tua anon public key di Supabase |
| `VITE_STRIPE_PUBLIC_KEY` | La tua Publishable key di Stripe |
| `VITE_STRIPE_PRICE_BASIC` | Il Price ID del piano Basic |
| `VITE_STRIPE_PRICE_PRO` | Il Price ID del piano Pro |
| `VITE_STRIPE_PRICE_ENTERPRISE` | Il Price ID del piano Enterprise |

**IMPORTANTE**: Assicurati che ogni variabile inizi con `VITE_` esattamente come scritto!

### Passo 4: Deploy!

1. Clicca **Deploy**
2. Attendi 2-3 minuti
3. 🎉 Il tuo sito è online!

Vercel ti darà un URL tipo: `https://safeflow-xxx.vercel.app`

---

## 5️⃣ Configura un Dominio Personalizzato (Opzionale)

### Se hai un dominio (es. safeflow.it)

1. Vai in **Settings** > **Domains** nel tuo progetto Vercel
2. Clicca **Add**
3. Inserisci il tuo dominio (es. `safeflow.it`)
4. Segui le istruzioni per configurare i DNS

Vercel ti mostrerà quali record DNS aggiungere sul tuo provider di dominio.

---

## 6️⃣ Test Finale

### Verifica che tutto funzioni

1. **Landing Page**: Apri il sito, controlla che il logo e i colori siano corretti
2. **Registrazione**: Crea un account di test
3. **Email**: Controlla la tua email per confermare l'account
4. **Login**: Accedi con le credenziali
5. **Dashboard**: Verifica che la dashboard si carichi
6. **Clienti**: Aggiungi un cliente di test
7. **Documenti**: Aggiungi un documento con scadenza
8. **Calendario**: Controlla che il documento appaia nel calendario

---

## 🔄 Aggiornamenti Futuri

Ogni volta che modifichi il codice:

1. Fai le modifiche in locale
2. Testa con `npm run dev`
3. Committa e pusha su GitHub:
   ```bash
   git add .
   git commit -m "Descrizione modifiche"
   git push
   ```
4. Vercel farà automaticamente il deploy in 2-3 minuti!

---

## ⚠️ Nota Importante su Stripe

La funzione di checkout Stripe **richiede un backend** per funzionare completamente.

**Per ora**, puoi:
- Mostrare i prezzi sulla pagina pricing ✅
- Far vedere i piani agli utenti ✅
- **MA** il bottone "Inizia ora" non funzionerà ancora ❌

**Per attivare i pagamenti**, dovrai creare:
- Una Supabase Edge Function, oppure
- Una Vercel Serverless Function

Questo richiede un po' di codice aggiuntivo. Posso aiutarti dopo se necessario!

---

## 🐛 Troubleshooting

### "Supabase client error"
- Controlla che le variabili su Vercel siano scritte ESATTAMENTE come `VITE_SUPABASE_URL`
- Verifica che non ci siano spazi all'inizio o alla fine dei valori

### "Cannot read property of undefined"
- Vai su Supabase e verifica che lo script SQL sia stato eseguito correttamente
- Controlla che le tabelle `clients` e `documents` esistano

### "Deploy failed"
- Controlla i log su Vercel per vedere l'errore esatto
- Verifica che tutte le env variables siano configurate
- Assicurati che `package.json` sia presente nella root del progetto

### Il sito è lento
- È normale al primo caricamento (cold start)
- Dopo il primo carico, sarà velocissimo

---

## 📞 Hai Bisogno di Aiuto?

Se qualcosa non funziona, controlla:
1. I log su Vercel (scheda **Deployments**)
2. La console del browser (F12) per errori JavaScript
3. I log di Supabase (scheda **Logs**)

---

## ✅ Checklist Finale

- [ ] Supabase configurato con database
- [ ] Stripe configurato con prodotti
- [ ] Codice caricato su GitHub
- [ ] Vercel configurato con env variables
- [ ] Deploy completato con successo
- [ ] Registrazione e login funzionanti
- [ ] Possibile creare clienti e documenti
- [ ] Calendario mostra le scadenze

**Congratulazioni! SafeFlow è online! 🚀**
