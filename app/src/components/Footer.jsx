import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <img src="/logo.png" alt="SafeFlow" className="footer-logo" />
            <p className="footer-description">
              Software per il controllo scadenze documentali con clienti corporate
            </p>
          </div>
          
          <div className="footer-section">
            <h4>Prodotto</h4>
            <ul>
              <li><a href="#funzionalita">Funzionalità</a></li>
              <li><a href="/pricing">Prezzi</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Azienda</h4>
            <ul>
              <li><a href="#contatti">Contatti</a></li>
              <li><a href="#privacy">Privacy</a></li>
              <li><a href="#termini">Termini</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 SafeFlow. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  )
}
