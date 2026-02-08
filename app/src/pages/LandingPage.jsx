import { Link } from 'react-router-dom'
import { CheckCircle, XCircle, Calendar, Bell, FileText, Users } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './LandingPage.css'

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">SAFEFLOW</div>
            <h1>Software per il controllo scadenze documentali con clienti corporate</h1>
            <p className="hero-subtitle">
              Sostituisci l'Excel delle scadenze. Evita blocchi operativi.
            </p>
            <Link to="/register" className="btn btn-primary btn-large">
              Richiedi una demo
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="section problem-section">
        <div className="container">
          <h2>Ogni mese rischi un blocco operativo perché un documento è scaduto</h2>
          
          <div className="problem-box">
            <p className="problem-quote">
              "Gentile fornitore, abbiamo rilevato che il documento X risulta scaduto. 
              Vi informiamo che fino al rinnovo non potrete accedere ai cantieri / 
              emettere fatture / proseguire le attività."
            </p>
          </div>

          <div className="problem-text">
            <p>
              Se lavori con clienti corporate (grandi gruppi, utilities, general contractor), 
              sai cosa significa ricevere questa mail.
            </p>
            <p>
              Oggi gestisci le scadenze documentali con Excel, promemoria manuali e memoria. 
              Il problema è che te ne accorgi quando il cliente ti blocca, non prima.
            </p>
            <p className="problem-highlight">
              SAFEFLOW è il software che tiene sotto controllo le scadenze dei documenti 
              richiesti dai tuoi clienti corporate. Ti avvisa prima che scadano. Eviti blocchi operativi.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="section how-section">
        <div className="container">
          <h2 className="text-center">Come funziona</h2>
          
          <div className="how-grid">
            <div className="how-step">
              <div className="step-number">1</div>
              <h3>Crei la checklist documenti per ogni cliente corporate</h3>
              <p>
                Per ogni cliente (Enel, A2A, Ferrovie, general contractor) inserisci l'elenco 
                dei documenti richiesti: DURC, SOA, visura camerale, polizze, certificazioni, abilitazioni.
              </p>
            </div>

            <div className="how-step">
              <div className="step-number">2</div>
              <h3>Inserisci le date di scadenza</h3>
              <p>
                Il sistema tiene traccia di ogni scadenza. Puoi caricare i file o solo registrare la data.
              </p>
            </div>

            <div className="how-step">
              <div className="step-number">3</div>
              <h3>Ricevi avvisi prima della scadenza</h3>
              <p>
                SAFEFLOW mostra lo stato di ogni documento (OK / in scadenza / scaduto) e ti avvisa 
                con anticipo configurabile (30gg, 60gg, 90gg). Non aspetti la mail di blocco del cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What is NOT / What IS Section */}
      <section className="section positioning-section">
        <div className="container">
          <div className="positioning-grid">
            <div className="positioning-column">
              <h2>Cosa NON è SAFEFLOW</h2>
              <ul className="positioning-list not-list">
                <li><XCircle size={20} /> Un DMS (Document Management System)</li>
                <li><XCircle size={20} /> Un gestionale aziendale</li>
                <li><XCircle size={20} /> Un sistema di compliance normativa</li>
                <li><XCircle size={20} /> Un software per la gestione fornitori</li>
                <li><XCircle size={20} /> Uno strumento di procurement</li>
              </ul>
            </div>

            <div className="positioning-column">
              <h2>Cosa È SAFEFLOW</h2>
              <ul className="positioning-list is-list">
                <li><CheckCircle size={20} /> Un registro scadenze documentali per clienti corporate</li>
                <li><CheckCircle size={20} /> Il sostituto dell'Excel che usi oggi</li>
                <li><CheckCircle size={20} /> Uno strumento per uffici amministrativi e operations</li>
                <li><CheckCircle size={20} /> Un sistema di controllo che avvisa PRIMA del blocco operativo</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section className="section preview-section">
        <div className="container">
          <h2 className="text-center">Cosa vedi nel software</h2>
          
          <div className="preview-grid">
            <div className="preview-card">
              <Users size={32} />
              <h3>Dashboard clienti</h3>
              <p>
                Elenco dei tuoi clienti corporate. Per ognuno vedi quanti documenti sono OK, 
                quanti in scadenza, quanti scaduti.
              </p>
            </div>

            <div className="preview-card">
              <FileText size={32} />
              <h3>Checklist documenti per cliente</h3>
              <p>
                Ogni cliente ha la sua lista: DURC, SOA, certificazioni di settore, 
                polizze assicurative, visure, abilitazioni specifiche.
              </p>
            </div>

            <div className="preview-card">
              <div className="status-indicators">
                <span className="status-badge status-ok">OK</span>
                <span className="status-badge status-warning">Attenzione</span>
                <span className="status-badge status-danger">Scaduto</span>
              </div>
              <h3>Stato documenti</h3>
              <p>
                <strong>Verde (OK):</strong> documento valido<br/>
                <strong>Giallo (attenzione):</strong> scadenza tra 30-60-90 giorni (configuri tu)<br/>
                <strong>Rosso (scaduto):</strong> documento già scaduto
              </p>
            </div>

            <div className="preview-card">
              <Bell size={32} />
              <h3>Notifiche via mail</h3>
              <p>
                Ricevi alert automatici prima della scadenza. Decidi chi in azienda deve riceverli.
              </p>
            </div>

            <div className="preview-card">
              <Calendar size={32} />
              <h3>Storico scadenze</h3>
              <p>
                Registro di tutti i rinnovi effettuati. Utile per audit o verifiche cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section faq-section">
        <div className="container">
          <h2 className="text-center">Domande frequenti</h2>
          
          <div className="faq-grid">
            <div className="faq-item">
              <h3>SAFEFLOW sostituisce il mio gestionale?</h3>
              <p>
                No. SAFEFLOW fa solo controllo scadenze documentali. Non gestisce fatture, 
                ordini, magazzino o fornitori.
              </p>
            </div>

            <div className="faq-item">
              <h3>Posso caricare i documenti dentro SAFEFLOW?</h3>
              <p>
                Sì, se vuoi. Ma puoi anche solo registrare la scadenza senza caricare file. 
                SAFEFLOW non è un archivio documentale, è un registro scadenze.
              </p>
            </div>

            <div className="faq-item">
              <h3>Quanto tempo serve per configurarlo?</h3>
              <p>
                Inserisci i tuoi clienti corporate, aggiungi i documenti richiesti da ognuno, 
                imposti le scadenze. Per un'azienda con 10-15 clienti corporate servono 2-3 ore.
              </p>
            </div>

            <div className="faq-item">
              <h3>Come funzionano gli avvisi?</h3>
              <p>
                Decidi tu l'anticipo (es. 60 giorni prima). SAFEFLOW invia una mail agli indirizzi 
                configurati. Puoi impostare più livelli di alert (90gg, 60gg, 30gg).
              </p>
            </div>

            <div className="faq-item">
              <h3>È adatto alla mia azienda?</h3>
              <p>
                Se lavori con clienti corporate che ti chiedono documenti con scadenza 
                (DURC, certificazioni, polizze, abilitazioni) e oggi usi Excel o promemoria manuali, sì.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Evita il prossimo blocco operativo</h2>
            <p>
              SAFEFLOW tiene sotto controllo le scadenze documentali dei tuoi clienti corporate. 
              Ti avvisa prima che scadano. Eviti fermi lavoro.
            </p>
            <Link to="/register" className="btn btn-primary btn-large">
              Richiedi una demo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
