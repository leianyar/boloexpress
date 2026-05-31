import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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

      await api.post("/auth/register", formData);

      setMessage("Conta criada com sucesso! Agora faça login.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.log(error);

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Erro ao criar conta."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="site">
      <Navbar />

      <section className="auth-modern register-layout">
        <div className="auth-left">
          <span>Nova conta</span>

          <h1>Crie a sua conta e encomende bolos para qualquer evento.</h1>

          <p>
            Com uma conta no BoloExpress, o cliente pode fazer pedidos de bolos
            personalizados, informar os dados do evento e acompanhar tudo online.
          </p>

          <div className="auth-benefits">
            <div>
              <strong>📝</strong>
              <p>Cadastro simples e rápido</p>
            </div>

            <div>
              <strong>🎉</strong>
              <p>Pedidos para aniversários, casamentos e festas</p>
            </div>

            <div>
              <strong>📱</strong>
              <p>Sistema responsivo para telefone e computador</p>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <form className="auth-panel" onSubmit={handleSubmit}>
            <div className="auth-panel-header">
              <span>Comece agora</span>
              <h2>Criar conta</h2>
              <p>Preencha os dados para se cadastrar.</p>
            </div>

            {message && <div className="alert">{message}</div>}

            <label>Nome completo</label>
            <input
              type="text"
              name="name"
              placeholder="Digite o seu nome completo"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="exemplo@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Telefone</label>
            <input
              type="text"
              name="phone"
              placeholder="Digite o seu contacto"
              value={formData.phone}
              onChange={handleChange}
            />

            <label>Senha</label>
            <input
              type="password"
              name="password"
              placeholder="Crie uma senha"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "A criar conta..." : "Criar conta"}
            </button>

            <p className="auth-link">
              Já tem conta? <Link to="/login">Entrar</Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Register;