import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post("/auth/login", formData);

      localStorage.setItem("@BoloExpress:token", response.data.token);
      localStorage.setItem(
        "@BoloExpress:user",
        JSON.stringify(response.data.user)
      );

      if (response.data.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/bolos");
      }
    } catch (error) {
      console.log(error);

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Erro ao fazer login."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="site">
      <Navbar />

      <section className="auth-modern">
        <div className="auth-left">
          <span>Sistema seguro</span>

          <h1>Entre na sua conta e acompanhe as suas encomendas.</h1>

          <p>
            Acesse o BoloExpress para fazer pedidos, acompanhar estados das
            encomendas e gerir os bolos caso seja administrador da pastelaria.
          </p>

          <div className="auth-benefits">
            <div>
              <strong>🎂</strong>
              <p>Encomende bolos personalizados</p>
            </div>

            <div>
              <strong>📦</strong>
              <p>Acompanhe o estado do pedido</p>
            </div>

            <div>
              <strong>🔐</strong>
              <p>Acesso protegido por autenticação</p>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <form className="auth-panel" onSubmit={handleSubmit}>
            <div className="auth-panel-header">
              <span>Bem-vindo</span>
              <h2>Entrar</h2>
              <p>Informe os seus dados para continuar.</p>
            </div>

            {message && <div className="alert">{message}</div>}

            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="exemplo@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Senha</label>
            <input
              type="password"
              name="password"
              placeholder="Digite a sua senha"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "A entrar..." : "Entrar na conta"}
            </button>

            <p className="auth-link">
              Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;