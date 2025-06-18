const express = require("express");
const Pedido = require("../models/Pedido");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { produtos, total, enderecoEntrega, frete } = req.body;

  try {
    const novoPedido = new Pedido({
      usuarioId: req.usuario.id,
      produtos,
      total,
      enderecoEntrega,
      frete,
    });

    await novoPedido.save();
    res.status(201).json(novoPedido);
  } catch (err) {
    res
      .status(500)
      .json({ mensagem: "Erro ao registrar pedido", erro: err.message });
  }
});

router.get("/meus", authMiddleware, async (req, res) => {
  const pedidos = await Pedido.find({ usuarioId: req.usuario.id });
  res.json(pedidos);
});

router.get("/todos", authMiddleware, adminMiddleware, async (req, res) => {
  const pedidos = await Pedido.find()
    .populate("usuarioId", "nome email")
    .populate("produtos.produtoId", "nome");
  res.json(pedidos);
});

module.exports = router;
