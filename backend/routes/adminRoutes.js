const express = require("express");
const Usuario = require("../models/Usuario");
const Produto = require("../models/Produto");
const Pedido = require("../models/Pedido");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/usuarios", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-senha");
    res.json(usuarios);
  } catch (err) {
    res
      .status(500)
      .json({ mensagem: "Erro ao listar usuários", erro: err.message });
  }
});

router.get("/pedidos", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate("usuarioId", "nome email")
      .populate("produtos.produtoId", "nome");
    res.json(pedidos);
  } catch (err) {
    res
      .status(500)
      .json({ mensagem: "Erro ao listar pedidos", erro: err.message });
  }
});

router.get("/dashboard", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [usuarios, produtos, pedidos] = await Promise.all([
      Usuario.countDocuments(),
      Produto.countDocuments({ ativo: true }),
      Pedido.countDocuments(),
    ]);
    res.json({ usuarios, produtos, pedidos });
  } catch (err) {
    res.status(500).json({
      mensagem: "Erro ao obter dados do dashboard",
      erro: err.message,
    });
  }
});

module.exports = router;
