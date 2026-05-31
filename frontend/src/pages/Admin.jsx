import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Admin() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [cakes, setCakes] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [cakeSearch, setCakeSearch] = useState("");

  const [cakeForm, setCakeForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    available: true
  });

  const [editingCake, setEditingCake] = useState(null);

  const [editCakeForm, setEditCakeForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    available: true
  });

  const statusOptions = [
    { value: "PENDENTE", label: "Pendente" },
    { value: "CONFIRMADA", label: "Confirmada" },
    { value: "EM_PREPARACAO", label: "Em preparação" },
    { value: "PRONTA", label: "Pronta" },
    { value: "ENTREGUE", label: "Entregue" },
    { value: "CANCELADA", label: "Cancelada" }
  ];

  async function loadData() {
    try {
      setLoading(true);

      const [ordersResponse, cakesResponse] = await Promise.all([
        api.get("/orders"),
        api.get("/cakes")
      ]);

      setOrders(ordersResponse.data);
      setCakes(cakesResponse.data);
    } catch (error) {
      console.log(error);
      setMessage(
        error.response?.data?.message || "Erro ao carregar dados do painel."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredOrders = useMemo(() => {
    const text = orderSearch.toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        order.cake?.name?.toLowerCase().includes(text) ||
        order.user?.name?.toLowerCase().includes(text) ||
        order.phone?.toLowerCase().includes(text) ||
        order.eventType?.toLowerCase().includes(text) ||
        order.address?.toLowerCase().includes(text);

      const matchesStatus =
        statusFilter === "TODOS" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, statusFilter]);

  const filteredCakes = useMemo(() => {
    const text = cakeSearch.toLowerCase();

    return cakes.filter((cake) => {
      return (
        cake.name.toLowerCase().includes(text) ||
        cake.category.toLowerCase().includes(text) ||
        cake.description.toLowerCase().includes(text)
      );
    });
  }, [cakes, cakeSearch]);

  function handleCakeChange(event) {
    const { name, value } = event.target;

    setCakeForm({
      ...cakeForm,
      [name]: value
    });
  }

  async function handleCreateCake(event) {
    event.preventDefault();

    try {
      setMessage("");

      await api.post("/cakes", {
        ...cakeForm,
        price: Number(cakeForm.price),
        available: true
      });

      setMessage("Bolo cadastrado com sucesso.");

      setCakeForm({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        category: "",
        available: true
      });

      await loadData();
      setActiveTab("cakes");
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Erro ao cadastrar bolo.");
    }
  }

  async function handleStatusChange(orderId, status) {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      setMessage("Estado da encomenda atualizado com sucesso.");
      await loadData();
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Erro ao atualizar estado.");
    }
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

  function openEditCake(cake) {
    setEditingCake(cake);

    setEditCakeForm({
      name: cake.name,
      description: cake.description,
      price: cake.price,
      imageUrl: cake.imageUrl || "",
      category: cake.category,
      available: cake.available
    });

    setActiveTab("editCake");
  }

  function handleEditCakeChange(event) {
    const { name, value } = event.target;

    setEditCakeForm({
      ...editCakeForm,
      [name]: value
    });
  }

  async function handleUpdateCake(event) {
    event.preventDefault();

    if (!editingCake) {
      setMessage("Nenhum bolo selecionado para edição.");
      return;
    }

    try {
      await api.patch(`/cakes/${editingCake.id}`, {
        ...editCakeForm,
        price: Number(editCakeForm.price)
      });

      setMessage("Bolo atualizado com sucesso.");
      setEditingCake(null);
      setActiveTab("cakes");
      await loadData();
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Erro ao atualizar bolo.");
    }
  }

  async function handleDeleteCake(id) {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja eliminar este bolo?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/cakes/${id}`);
      setMessage("Bolo eliminado com sucesso.");
      await loadData();
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Erro ao eliminar bolo.");
    }
  }

  async function handleToggleAvailability(cake) {
    try {
      await api.patch(`/cakes/${cake.id}`, {
        available: !cake.available
      });

      setMessage(
        cake.available
          ? "Bolo desativado com sucesso."
          : "Bolo ativado com sucesso."
      );

      await loadData();
    } catch (error) {
      console.log(error);
      setMessage(
        error.response?.data?.message || "Erro ao alterar disponibilidade."
      );
    }
  }

  const totalRevenue = orders
    .filter((order) => order.status === "ENTREGUE")
    .reduce((sum, order) => sum + Number(order.totalPrice), 0);

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDENTE"
  ).length;

  return (
    <div className="site">
      <Navbar />

      <section className="admin-hero">
        <span>Painel Administrativo</span>
        <h1>Gestão da Pastelaria</h1>
        <p>
          Controle bolos, encomendas e estados dos pedidos através de um painel
          simples, moderno e organizado.
        </p>
      </section>

      {message && <div className="page-alert">{message}</div>}

      <section className="admin-stats">
        <div className="admin-stat-card">
          <span>Total de bolos</span>
          <strong>{cakes.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Total de encomendas</span>
          <strong>{orders.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Pedidos pendentes</span>
          <strong>{pendingOrders}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Receita entregue</span>
          <strong>{totalRevenue} MZN</strong>
        </div>
      </section>

      <section className="admin-tabs">
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Encomendas
        </button>

        <button
          className={activeTab === "cakes" ? "active" : ""}
          onClick={() => setActiveTab("cakes")}
        >
          Bolos
        </button>

        <button
          className={activeTab === "createCake" ? "active" : ""}
          onClick={() => setActiveTab("createCake")}
        >
          Cadastrar bolo
        </button>
      </section>

      {loading ? (
        <p className="loading-text">A carregar dados...</p>
      ) : (
        <>
          {activeTab === "orders" && (
            <section className="admin-section">
              <div className="admin-section-header">
                <h2>Encomendas recebidas</h2>
                <p>Pesquise e filtre os pedidos feitos pelos clientes.</p>
              </div>

              <div className="admin-filters">
                <input
                  type="text"
                  placeholder="Pesquisar por cliente, bolo, evento, telefone ou endereço..."
                  value={orderSearch}
                  onChange={(event) => setOrderSearch(event.target.value)}
                />

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="TODOS">Todos os estados</option>
                  <option value="PENDENTE">Pendente</option>
                  <option value="CONFIRMADA">Confirmada</option>
                  <option value="EM_PREPARACAO">Em preparação</option>
                  <option value="PRONTA">Pronta</option>
                  <option value="ENTREGUE">Entregue</option>
                  <option value="CANCELADA">Cancelada</option>
                </select>
              </div>

              <div className="admin-result-count">
                {filteredOrders.length} encomenda(s) encontrada(s)
              </div>

              <div className="admin-orders-grid">
                {filteredOrders.length === 0 ? (
                  <div className="empty-state">
                    <h3>Nenhuma encomenda encontrada</h3>
                    <p>Tente alterar a pesquisa ou o filtro de estado.</p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <article className="admin-order-card" key={order.id}>
                      <div className="admin-order-top">
                        <div>
                          <span
                            className={`status-badge ${order.status.toLowerCase()}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>

                          <h3>{order.cake?.name}</h3>
                          <p>Cliente: {order.user?.name}</p>
                        </div>

                        <strong>{order.totalPrice} MZN</strong>
                      </div>

                      <div className="admin-order-info">
                        <div>
                          <span>Evento</span>
                          <strong>{order.eventType}</strong>
                        </div>

                        <div>
                          <span>Data</span>
                          <strong>
                            {new Date(order.eventDate).toLocaleDateString(
                              "pt-PT"
                            )}
                          </strong>
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

                      <div className="status-control">
                        <label>Alterar estado da encomenda</label>

                        <div className="status-actions">
                          {statusOptions.map((item) => (
                            <button
                              key={item.value}
                              type="button"
                              className={
                                order.status === item.value
                                  ? `status-action active ${item.value.toLowerCase()}`
                                  : `status-action ${item.value.toLowerCase()}`
                              }
                              onClick={() =>
                                handleStatusChange(order.id, item.value)
                              }
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          )}

          {activeTab === "cakes" && (
            <section className="admin-section">
              <div className="admin-section-header">
                <h2>Bolos cadastrados</h2>
                <p>Pesquise e faça a gestão dos bolos disponíveis no catálogo.</p>
              </div>

              <div className="admin-filters single">
                <input
                  type="text"
                  placeholder="Pesquisar por nome, categoria ou descrição..."
                  value={cakeSearch}
                  onChange={(event) => setCakeSearch(event.target.value)}
                />
              </div>

              <div className="admin-result-count">
                {filteredCakes.length} bolo(s) encontrado(s)
              </div>

              <div className="admin-cakes-grid">
                {filteredCakes.length === 0 ? (
                  <div className="empty-state">
                    <h3>Nenhum bolo encontrado</h3>
                    <p>Tente pesquisar por outro nome ou categoria.</p>
                  </div>
                ) : (
                  filteredCakes.map((cake) => (
                    <article className="admin-cake-card" key={cake.id}>
                      <div className="admin-cake-image">
                        {cake.imageUrl ? (
                          <img src={cake.imageUrl} alt={cake.name} />
                        ) : (
                          <div className="cake-placeholder">🎂</div>
                        )}

                        <span
                          className={
                            cake.available
                              ? "availability-badge active"
                              : "availability-badge inactive"
                          }
                        >
                          {cake.available ? "Disponível" : "Indisponível"}
                        </span>
                      </div>

                      <div className="admin-cake-body">
                        <span>{cake.category}</span>
                        <h3>{cake.name}</h3>
                        <p>{cake.description}</p>
                        <strong>{cake.price} MZN</strong>

                        <div className="admin-cake-actions">
                          <button onClick={() => openEditCake(cake)}>
                            Editar
                          </button>

                          <button
                            className="secondary"
                            onClick={() => handleToggleAvailability(cake)}
                          >
                            {cake.available ? "Desativar" : "Ativar"}
                          </button>

                          <button
                            className="danger"
                            onClick={() => handleDeleteCake(cake.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          )}

          {activeTab === "createCake" && (
            <section className="admin-section">
              <div className="admin-section-header">
                <h2>Cadastrar novo bolo</h2>
                <p>Adicione bolos ao catálogo da pastelaria.</p>
              </div>

              <form className="admin-form" onSubmit={handleCreateCake}>
                <label>Nome do bolo</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ex: Bolo de Aniversário"
                  value={cakeForm.name}
                  onChange={handleCakeChange}
                  required
                />

                <label>Descrição</label>
                <textarea
                  name="description"
                  placeholder="Descreva o bolo..."
                  value={cakeForm.description}
                  onChange={handleCakeChange}
                  required
                ></textarea>

                <label>Preço</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Ex: 2500"
                  value={cakeForm.price}
                  onChange={handleCakeChange}
                  required
                />

                <label>Categoria</label>
                <input
                  type="text"
                  name="category"
                  placeholder="Ex: Aniversário"
                  value={cakeForm.category}
                  onChange={handleCakeChange}
                  required
                />

                <label>URL da imagem</label>
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="Cole o link da imagem"
                  value={cakeForm.imageUrl}
                  onChange={handleCakeChange}
                />

                <button type="submit">Cadastrar bolo</button>
              </form>
            </section>
          )}

          {activeTab === "editCake" && editingCake && (
            <section className="admin-section">
              <div className="admin-section-header">
                <h2>Editar bolo</h2>
                <p>Atualize as informações do bolo selecionado.</p>
              </div>

              <form className="admin-form" onSubmit={handleUpdateCake}>
                <label>Nome do bolo</label>
                <input
                  type="text"
                  name="name"
                  value={editCakeForm.name}
                  onChange={handleEditCakeChange}
                  required
                />

                <label>Descrição</label>
                <textarea
                  name="description"
                  value={editCakeForm.description}
                  onChange={handleEditCakeChange}
                  required
                ></textarea>

                <label>Preço</label>
                <input
                  type="number"
                  name="price"
                  value={editCakeForm.price}
                  onChange={handleEditCakeChange}
                  required
                />

                <label>Categoria</label>
                <input
                  type="text"
                  name="category"
                  value={editCakeForm.category}
                  onChange={handleEditCakeChange}
                  required
                />

                <label>URL da imagem</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={editCakeForm.imageUrl}
                  onChange={handleEditCakeChange}
                />

                <div className="form-check">
                  <input
                    type="checkbox"
                    checked={editCakeForm.available}
                    onChange={(event) =>
                      setEditCakeForm({
                        ...editCakeForm,
                        available: event.target.checked
                      })
                    }
                  />

                  <span>Bolo disponível para encomenda</span>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCake(null);
                      setActiveTab("cakes");
                    }}
                  >
                    Cancelar
                  </button>

                  <button type="submit">Salvar alterações</button>
                </div>
              </form>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default Admin;