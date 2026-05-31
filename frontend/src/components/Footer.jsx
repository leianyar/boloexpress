import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-brand-area">
          <Link to="/" className="footer-brand">
            <div className="footer-brand-icon">B</div>

            <div>
              <strong>BoloExpress</strong>
              <span>Pastelaria Digital</span>
            </div>
          </Link>

          <p>
            Sistema web para encomenda e gestão de bolos personalizados para
            eventos como aniversários, casamentos, graduações e festas.
          </p>
        </div>

        <div className="footer-links">
          <h3>Navegação</h3>

          <Link to="/">Início</Link>
          <Link to="/bolos">Bolos</Link>
          <Link to="/login">Entrar</Link>
          <Link to="/cadastro">Criar conta</Link>
        </div>

        <div className="footer-links">
          <h3>Funcionalidades</h3>

          <span>Catálogo de bolos</span>
          <span>Encomendas online</span>
          <span>Gestão de pedidos</span>
          <span>Painel administrativo</span>
        </div>

        <div className="footer-contact">
          <h3>Contacto</h3>

          <p>
            <strong>Email:</strong> boloexpress@gmail.com
          </p>

          <p>
            <strong>Telefone:</strong> +258 84 000 0000
          </p>

          <p>
            <strong>Localização:</strong> Moçambique
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {year} BoloExpress. Todos os direitos reservados.
        </p>

        <span>
          Projecto académico de Programação Web
        </span>
      </div>
    </footer>
  );
}

export default Footer;