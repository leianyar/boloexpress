import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function NotFound() {
  return (
    <div className="site">
      <Navbar />

      <section className="not-found-page">
        <div className="not-found-card">
          <span>404</span>

          <h1>Página não encontrada</h1>

          <p>
            A página que tentou acessar não existe ou foi movida. Volte para a
            página inicial ou consulte os bolos disponíveis.
          </p>

          <div className="not-found-actions">
            <Link to="/" className="btn-main">
              Voltar ao início
            </Link>

            <Link to="/bolos" className="btn-outline">
              Ver bolos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default NotFound;