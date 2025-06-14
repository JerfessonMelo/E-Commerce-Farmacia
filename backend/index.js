const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const conectarDB = require("./config/db");
const usuarioRoutes = require("./routes/usuarioRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const adminRoutes = require("./routes/adminRoutes");
const freteRoutes = require("./routes/freteRoutes");

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao MongoDB
conectarDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: "https://e-commerce-farmacia-rho.vercel.app/",
    credentials: true,
  })
);
app.use(express.json());

// Rotas da API
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/produtos", produtoRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/frete", freteRoutes);

// Rota raiz (teste)
app.get("/", (req, res) => {
  res.send("🚀 API da Drogaria Poupe Já está rodando!");
});

// Iniciar servidor

app.listen(PORT, () => {
  console.log(`🟢 Servidor rodando na porta ${PORT}`);
});
