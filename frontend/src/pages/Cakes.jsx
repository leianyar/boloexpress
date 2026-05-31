import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Cakes() {
  const [bolos, setBolos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCake, setSelectedCake] = useState(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const [orderData, setOrderData] = useState({
    eventType: "",
    eventDate: "",
    quantity: 1,
    size: "",
    message: "",
    address: "",
    phone: ""
  });

  useEffect(() => {
    async function loadCakes() {
      try {
        setLoading(true);
        const response = await api.get("/cakes");
        setBolos(response.data);
      } catch (error) {
        console.log(error);
        setMessage("Erro ao carregar bolos.");
      } finally {
        setLoading(false);
      }
    }

    loadCakes();
  }, []);

  const filteredCakes = useMemo(() => {
    const text = search.toLowerCase();

    return bolos.filter((bolo) => {
      return (
        bolo.name.toLowerCase().includes(text) ||
        bolo.category.toLowerCase().includes(text) ||
        bolo.description.toLowerCase().includes(text)
      );
    });
  }, [bolos, search]);

  function handleOrderChange(event) {
    const { name, value } = event.target;

    setOrderData({
      ...orderData,
      [name]: value
    });
  }

  function openOrderForm(cake) {
    const user = localStorage.getItem("@BoloExpress:user");

    if (!cake.available) {
      setMessage("Este bolo está temporariamente indisponível para encomenda.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!user) {
      setMessage("Faça login para realizar uma encomenda.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSelectedCake(cake);
    setMessage("");
  }

  function closeOrderForm() {
    setSelectedCake(null);

    setOrderData({
      eventType: "",
      eventDate: "",
      quantity: 1,
      size: "",
      message: "",
      address: "",
      phone: ""
    });
  }

  async function handleCreateOrder(event) {
    event.preventDefault();

    try {
      setMessage("");

      await api.post("/orders", {
        cakeId: selectedCake.id,
        ...orderData,
        quantity: Number(orderData.quantity)
      });

      setMessage("Encomenda realizada com sucesso!");
      closeOrderForm();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.log(error);
      setMessage(
        error.response?.data?.message || "Erro ao realizar encomenda."
      );
    }
  }

  return (
    <div className="site">
      <Navbar />

      <section className="cakes-hero">
        <div>
          <span>Catálogo de Bolos</span>
          <h1>Escolha o bolo ideal para o seu evento</h1>
          <p>
            Consulte os bolos disponíveis, veja os preços e faça a sua encomenda
            online de forma simples, rápida e organizada.
          </p>
        </div>

        <div className="cakes-hero-card">
          <strong>{bolos.length}</strong>
          <p>Bolos cadastrados</p>
        </div>
      </section>

      <section className="cakes-toolbar">
        <div>
          <h2>Bolos disponíveis</h2>
          <p>Pesquise por nome, categoria ou descrição.</p>
        </div>

        <input
          type="text"
          placeholder="Pesquisar bolo..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </section>

      {message && <div className="page-alert">{message}</div>}

      {loading ? (
        <p className="loading-text">A carregar bolos...</p>
      ) : filteredCakes.length === 0 ? (
        <div className="empty-state">
          <h3>Nenhum bolo encontrado</h3>
          <p>Tente pesquisar por outro nome ou categoria.</p>
        </div>
      ) : (
        <section className="cakes-grid">
          {filteredCakes.map((bolo) => (
            <article
              className={
                bolo.available ? "cake-card" : "cake-card unavailable"
              }
              key={bolo.id}
            >
              <div className="cake-card-image">
                {bolo.imageUrl ? (
                  <img src={bolo.imageUrl} alt={bolo.name} />
                ) : (
                  <div className="cake-placeholder">🎂</div>
                )}

                <span>{bolo.category}</span>

                {!bolo.available && (
                  <div className="cake-unavailable-badge">
                    Indisponível
                  </div>
                )}
              </div>

              <div className="cake-card-body">
                <h3>{bolo.name}</h3>
                <p>{bolo.description}</p>

                <div className="cake-card-footer">
                  <div>
                    <small>Preço</small>
                    <strong>{bolo.price} MZN</strong>
                  </div>

                  <button
                    onClick={() => openOrderForm(bolo)}
                    disabled={!bolo.available}
                    className={!bolo.available ? "disabled-btn" : ""}
                  >
                    {bolo.available ? "Encomendar" : "Indisponível"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {selectedCake && (
        <div className="modal-overlay">
          <form className="order-modal" onSubmit={handleCreateOrder}>
            <div className="modal-header">
              <div>
                <span>Nova encomenda</span>
                <h2>{selectedCake.name}</h2>
              </div>

              <button type="button" onClick={closeOrderForm}>
                ×
              </button>
            </div>

            <div className="order-summary">
              <p>Preço unitário</p>
              <strong>{selectedCake.price} MZN</strong>
            </div>

            <label>Tipo de evento</label>
            <select
              name="eventType"
              value={orderData.eventType}
              onChange={handleOrderChange}
              required
            >
              <option value="">Selecione o evento</option>
              <option value="Aniversário">Aniversário</option>
              <option value="Casamento">Casamento</option>
              <option value="Graduação">Graduação</option>
              <option value="Batizado">Batizado</option>
              <option value="Festa">Festa</option>
              <option value="Outro">Outro</option>
            </select>

            <label>Data do evento</label>
            <input
              type="date"
              name="eventDate"
              value={orderData.eventDate}
              onChange={handleOrderChange}
              required
            />

            <label>Quantidade</label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={orderData.quantity}
              onChange={handleOrderChange}
              required
            />

            <label>Tamanho do bolo</label>
            <select
              name="size"
              value={orderData.size}
              onChange={handleOrderChange}
              required
            >
              <option value="">Selecione o tamanho</option>
              <option value="Pequeno">Pequeno</option>
              <option value="Médio">Médio</option>
              <option value="Grande">Grande</option>
              <option value="Personalizado">Personalizado</option>
            </select>

            <label>Mensagem no bolo</label>
            <input
              type="text"
              name="message"
              placeholder="Ex: Feliz aniversário, Ana!"
              value={orderData.message}
              onChange={handleOrderChange}
            />

            <label>Endereço de entrega</label>
            <input
              type="text"
              name="address"
              placeholder="Digite o local de entrega"
              value={orderData.address}
              onChange={handleOrderChange}
              required
            />

            <label>Telefone</label>
            <input
              type="text"
              name="phone"
              placeholder="Digite o seu contacto"
              value={orderData.phone}
              onChange={handleOrderChange}
              required
            />

            <div className="modal-total">
              <span>Total estimado</span>
              <strong>
                {Number(selectedCake.price) * Number(orderData.quantity || 1)} MZN
              </strong>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={closeOrderForm}
              >
                Cancelar
              </button>

              <button type="submit">Confirmar encomenda</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Cakes;