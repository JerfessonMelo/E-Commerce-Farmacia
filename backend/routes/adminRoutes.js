const express = require("express");
const Usuario = require("../models/Usuario");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Listar todos os usuários (clientes)
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

module.exports = router;
