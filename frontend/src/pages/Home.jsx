import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="site">
      <Navbar />

      <section className="hero-modern">
        <div className="hero-content">
          <span className="hero-label">Sistema Web de Encomendas</span>

          <h1>
            Bolos personalizados para eventos especiais, com gestão online.
          </h1>

          <p>
            O BoloExpress permite que clientes façam encomendas de bolos para
            aniversários, casamentos, graduações e festas, enquanto a pastelaria
            acompanha todos os pedidos num painel simples, moderno e organizado.
          </p>

          <div className="hero-actions">
            <Link to="/bolos" className="btn-main">
              Ver Bolos
            </Link>

            <Link to="/cadastro" className="btn-outline">
              Fazer Encomenda
            </Link>
          </div>

          <div className="hero-info">
            <div>
              <strong>+50</strong>
              <span>Pedidos geridos</span>
            </div>

            <div>
              <strong>6</strong>
              <span>Tipos de eventos</span>
            </div>

            <div>
              <strong>100%</strong>
              <span>Online</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-card">
            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80"
              alt="Bolo personalizado"
            />

            <div className="floating-card top">
              <span>Pedido</span>
              <strong>Confirmado</strong>
            </div>

            <div className="floating-card bottom">
              <span>Entrega</span>
              <strong>10 Junho</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">
          <span>Funcionalidades</span>
          <h2>Uma solução completa para clientes e pastelaria</h2>
          <p>
            O sistema foi pensado para facilitar o processo de encomenda,
            acompanhamento e gestão dos bolos para eventos.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎂</div>
            <h3>Catálogo de Bolos</h3>
            <p>
              O cliente visualiza bolos disponíveis, preços, categorias e
              detalhes antes de encomendar.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Encomenda Personalizada</h3>
            <p>
              Permite informar data do evento, tamanho, contacto, endereço e
              mensagem no bolo.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📦</div>
            <h3>Gestão de Pedidos</h3>
            <p>
              A pastelaria acompanha os estados: pendente, confirmada, em
              preparação, pronta e entregue.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Painel Administrativo</h3>
            <p>
              O administrador gere bolos, clientes, encomendas e o estado de
              cada pedido.
            </p>
          </div>
        </div>
      </section>

      <section className="event-section">
        <div className="event-left">
          <img
            src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=80"
            alt="Bolo de casamento"
          />
        </div>

        <div className="event-right">
          <span>Eventos</span>
          <h2>Bolos para todos os momentos importantes</h2>
          <p>
            O cliente pode encomendar bolos para diferentes tipos de eventos,
            com detalhes personalizados conforme a necessidade da celebração.
          </p>

          <div className="event-list">
            <div>
              <strong>01</strong>
              <p>Aniversários</p>
            </div>

            <div>
              <strong>02</strong>
              <p>Casamentos</p>
            </div>

            <div>
              <strong>03</strong>
              <p>Graduações</p>
            </div>

            <div>
              <strong>04</strong>
              <p>Festas familiares</p>
            </div>
          </div>

          <Link to="/bolos" className="btn-main">
            Escolher Bolo
          </Link>
        </div>
      </section>

      <section className="steps-section">
        <div className="section-heading">
          <span>Processo</span>
          <h2>Como funciona o BoloExpress?</h2>
          <p>
            O fluxo do sistema é simples, rápido e adequado para um projecto
            académico de programação web com frontend e backend.
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-box">
            <strong>01</strong>
            <h3>Criar conta</h3>
            <p>O cliente cadastra-se no sistema para poder fazer encomendas.</p>
          </div>

          <div className="step-box">
            <strong>02</strong>
            <h3>Escolher bolo</h3>
            <p>Seleciona o bolo desejado no catálogo disponível.</p>
          </div>

          <div className="step-box">
            <strong>03</strong>
            <h3>Enviar pedido</h3>
            <p>Preenche os dados do evento e confirma a encomenda.</p>
          </div>

          <div className="step-box">
            <strong>04</strong>
            <h3>Acompanhar estado</h3>
            <p>A pastelaria atualiza o estado até à entrega do bolo.</p>
          </div>
        </div>
      </section>

      <section className="gallery-section">
        <div className="gallery-card big">
          <img
            src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80"
            alt="Bolo decorado"
          />
        </div>

        <div className="gallery-card">
          <img
            src="https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=900&q=80"
            alt="Bolo de chocolate"
          />
        </div>

        <div className="gallery-content">
          <span>Design moderno</span>
          <h2>Interface bonita, simples e profissional</h2>
          <p>
            O frontend foi desenhado para transmitir confiança, elegância e boa
            experiência ao utilizador.
          </p>
        </div>
      </section>

      <section className="cta-modern">
        <div>
          <span>Comece agora</span>
          <h2>Faça a sua encomenda de bolo online</h2>
          <p>
            Crie uma conta, escolha um bolo e envie os dados do seu evento.
          </p>
        </div>

        <Link to="/cadastro" className="btn-white">
          Criar Conta
        </Link>
      </section>

      <footer className="footer">
        <div>
          <strong>BoloExpress</strong>
          <p>Sistema Web de Gestão de Encomendas de Bolos para Eventos.</p>
        </div>

        <span>Projecto académico de Programação Web</span>
      </footer>
    </div>
  );
}

export default Home;