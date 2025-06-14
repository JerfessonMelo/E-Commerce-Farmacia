const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

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
    res.status(500).json({ mensagem: "Erro ao registrar usuário" });
  }
});

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  console.log("Tentando login com:", email, senha);

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      console.log("Usuário não encontrado");
      return res.status(401).json({ mensagem: "Credenciais inválidas" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      console.log("Senha incorreta");
      return res.status(401).json({ mensagem: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        email: usuario.email,
        nome: usuario.nome,
        isAdmin: usuario.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Login realizado com sucesso");

    res.json({
      token,
      usuario: {
        nome: usuario.nome,
        email: usuario.email,
        isAdmin: usuario.isAdmin,
      },
    });
  } catch (err) {
    console.error("Erro no login:", err.message);
    res.status(500).json({ mensagem: "Erro no login", erro: err.message });
  }
});

router.get("/perfil", authMiddleware, async (req, res) => {
  const usuario = await Usuario.findById(req.usuario.id).select("-senha");
  res.json(usuario);
});

router.post("/renovar-token", authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const novoToken = jwt.sign(
      {
        id: usuario._id,
        email: usuario.email,
        nome: usuario.nome,
        isAdmin: usuario.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token: novoToken });
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao renovar token" });
  }
});

module.exports = router;
