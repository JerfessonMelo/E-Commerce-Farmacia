const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const conectarDB = require("./config/db");
const usuarioRoutes = require("./routes/usuarioRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const adminRoutes = require("./routes/adminRoutes");
const freteRoutes = require("./routes/freteRoutes");

dotenv.config();

conectarDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "https://e-commerce-farmacia-rho.vercel.app",
    credentials: true,
  })
);

app.use("/produtos", express.static("public/produtos"));
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/frete", freteRoutes);

app.get("/", (req, res) => {
  res.send("🚀 API da Drogaria Poupe Já está rodando!");
});

app.listen(PORT, () => {
  console.log(`🟢 Servidor rodando na porta ${PORT}`);
});
