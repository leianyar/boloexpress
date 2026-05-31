import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("@BoloExpress:token");
  const userData = localStorage.getItem("@BoloExpress:user");
  const user = userData ? JSON.parse(userData) : null;

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    localStorage.removeItem("@BoloExpress:token");
    localStorage.removeItem("@BoloExpress:user");
    setMenuOpen(false);
    navigate("/login");
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand" onClick={closeMenu}>
        <div className="brand-icon">B</div>

        <div>
          <strong>BoloExpress</strong>
          <span>Pastelaria Digital</span>
        </div>
      </Link>

      <button
        className="menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "×" : "☰"}
      </button>

      <nav className={menuOpen ? "nav-menu open" : "nav-menu"}>
        <Link to="/" onClick={closeMenu}>
          Início
        </Link>

        <Link to="/bolos" onClick={closeMenu}>
          Bolos
        </Link>

        {token && user ? (
          <>
            {user.role === "ADMIN" && (
              <Link to="/admin" onClick={closeMenu}>
                Painel Admin
              </Link>
            )}

            <Link to="/minhas-encomendas" onClick={closeMenu}>
              Minhas Encomendas
            </Link>

            <Link to="/perfil" onClick={closeMenu}>
              Perfil
            </Link>

            <span className="nav-user">
              {user.role === "ADMIN" ? "Admin" : "Cliente"}: {user.name}
            </span>

            <button className="nav-logout" onClick={handleLogout}>
              Sair
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>
              Entrar
            </Link>

            <Link to="/cadastro" className="nav-cta" onClick={closeMenu}>
              Criar Conta
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;