import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      const response = await api.get("/orders/my-orders");
      setOrders(response.data);
    } catch (error) {
      console.log(error);
      setMessage(
        error.response?.data?.message || "Erro ao carregar encomendas."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleCancelOrder(id) {
    const confirmCancel = window.confirm(
      "Tem certeza que deseja cancelar esta encomenda?"
    );

    if (!confirmCancel) return;

    try {
      await api.patch(`/orders/${id}/cancel`);
      setMessage("Encomenda cancelada com sucesso.");
      loadOrders();
    } catch (error) {
      console.log(error);
      setMessage(
        error.response?.data?.message || "Erro ao cancelar encomenda."
      );
    }
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("pt-PT");
  }

  function getStatusLabel(status) {
    const labels = {
      PENDENTE: "Pendente",
      CONFIRMADA: "Confirmada",
      EM_PREPARACAO: "Em preparação",
      PRONTA: "Pronta",
      ENTREGUE: "Entregue",
      CANCELADA: "Cancelada"
    };

    return labels[status] || status;
  }

  return (
    <div className="site">
      <Navbar />

      <section className="orders-hero">
        <span>Área do Cliente</span>
        <h1>Minhas Encomendas</h1>
        <p>
          Acompanhe aqui todos os pedidos de bolos feitos por si, desde o estado
          pendente até à entrega final.
        </p>
      </section>

      {message && <div className="page-alert">{message}</div>}

      {loading ? (
        <p className="loading-text">A carregar encomendas...</p>
      ) : orders.length === 0 ? (
        <section className="empty-state">
          <h3>Nenhuma encomenda encontrada</h3>
          <p>Quando fizer uma encomenda, ela aparecerá aqui.</p>
        </section>
      ) : (
        <section className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-image">
                {order.cake?.imageUrl ? (
                  <img src={order.cake.imageUrl} alt={order.cake.name} />
                ) : (
                  <div className="order-placeholder">🎂</div>
                )}
              </div>

              <div className="order-content">
                <div className="order-top">
                  <div>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {getStatusLabel(order.status)}
                    </span>

                    <h3>{order.cake?.name}</h3>
                    <p>{order.cake?.description}</p>
                  </div>

                  <strong>{order.totalPrice} MZN</strong>
                </div>

                <div className="order-details">
                  <div>
                    <span>Evento</span>
                    <strong>{order.eventType}</strong>
                  </div>

                  <div>
                    <span>Data</span>
                    <strong>{formatDate(order.eventDate)}</strong>
                  </div>

                  <div>
                    <span>Tamanho</span>
                    <strong>{order.size}</strong>
                  </div>

                  <div>
                    <span>Quantidade</span>
                    <strong>{order.quantity}</strong>
                  </div>

                  <div>
                    <span>Telefone</span>
                    <strong>{order.phone}</strong>
                  </div>

                  <div>
                    <span>Endereço</span>
                    <strong>{order.address}</strong>
                  </div>
                </div>

                {order.message && (
                  <div className="order-message">
                    <span>Mensagem no bolo</span>
                    <p>{order.message}</p>
                  </div>
                )}

                {order.status === "PENDENTE" && (
                  <button
                    className="cancel-order-btn"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancelar encomenda
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default MyOrders;