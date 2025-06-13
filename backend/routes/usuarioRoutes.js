const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// Registro
router.post("/registro", async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const existente = await Usuario.findOne({ email });
    if (existente)
      return res.status(400).json({ mensagem: "E-mail já cadastrado" });

    const novoUsuario = new Usuario({ nome, email, senha });
    await novoUsuario.save();

    res.status(201).json({ mensagem: "Usuário registrado com sucesso" });
  } catch (err) {
    res
      .status(500)
      .json({ mensagem: "Erro ao registrar usuário", erro: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(401).json({ mensagem: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: usuario._id, isAdmin: usuario.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      usuario: {
        nome: usuario.nome,
        email: usuario.email,
        isAdmin: usuario.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ mensagem: "Erro no login", erro: err.message });
  }
});

// Perfil do usuário
router.get("/perfil", authMiddleware, async (req, res) => {
  const usuario = await Usuario.findById(req.usuario.id).select("-senha");
  res.json(usuario);
});

module.exports = router;
