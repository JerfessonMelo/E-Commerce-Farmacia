const express = require("express");
const router = express.Router();
const Produto = require("../models/Produto");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

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

// 🔓 Buscar um produto por ID (visível para todos os usuários)
router.get("/:id", async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);

    if (!produto || !produto.ativo) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }

    res.json(produto);
  } catch (err) {
    return res
      .status(500)
      .json({ mensagem: "Erro ao buscar produto", erro: err.message });
  }
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
