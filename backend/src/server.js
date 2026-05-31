const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const cakeRoutes = require("./routes/cake.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API do BoloExpress está funcionando!",
    routes: {
      auth: "/api/auth",
      cakes: "/api/cakes",
      orders: "/api/orders"
    }
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/cakes", cakeRoutes);
app.use("/api/orders", orderRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Rota não encontrada."
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});