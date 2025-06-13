const express = require("express");
const Produto = require("../models/Produto");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// 🔓 Listar produtos ativos (visível para todos os usuários)
router.get("/", async (req, res) => {
  const produtos = await Produto.find({ ativo: true });
  res.json(produtos);
});

// 🔐 Listar todos os produtos (admin)
router.get("/todos", authMiddleware, adminMiddleware, async (req, res) => {
  const produtos = await Produto.find(); // Ativos e inativos
  res.json(produtos);
});

// 🔐 Alterar status (ativo/inativo) de um produto
router.put("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
  const { ativo } = req.body;
  const produto = await Produto.findByIdAndUpdate(
    req.params.id,
    { ativo },
    { new: true }
  );
  res.json(produto);
});

// 🔐 Criar novo produto (admin)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const novo = new Produto(req.body);
    await novo.save();
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({
      mensagem: "Erro ao criar produto",
      erro: err.message,
    });
  }
});

module.exports = router;
