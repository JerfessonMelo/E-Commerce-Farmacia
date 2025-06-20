const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const { authMiddleware } = require("../middlewares/authMiddleware");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    mensagem: "Muitas tentativas de login, tente novamente mais tarde",
  },
});

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

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ mensagem: "Credenciais inválidas" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
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
      { expiresIn: "8h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 8 * 60 * 60 * 1000,
    });

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

router.post("/perfil/enderecos", authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario)
      return res.status(404).json({ mensagem: "Usuário não encontrado" });

    usuario.endereco.push(req.body);
    await usuario.save();

    res.json(usuario);
  } catch (err) {
    res
      .status(500)
      .json({ mensagem: "Erro ao adicionar endereço", erro: err.message });
  }
});

router.put("/perfil/enderecos/:indice", authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario)
      return res.status(404).json({ mensagem: "Usuário não encontrado" });

    const { indice } = req.params;
    if (!usuario.endereco[indice]) {
      return res.status(404).json({ mensagem: "Endereço não encontrado" });
    }

    usuario.endereco[indice] = req.body;
    await usuario.save();

    res.json(usuario);
  } catch (err) {
    res
      .status(500)
      .json({ mensagem: "Erro ao atualizar endereço", erro: err.message });
  }
});

router.delete("/perfil/enderecos/:indice", authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario)
      return res.status(404).json({ mensagem: "Usuário não encontrado" });

    const { indice } = req.params;
    if (!usuario.endereco[indice]) {
      return res.status(404).json({ mensagem: "Endereço não encontrado" });
    }

    usuario.endereco.splice(indice, 1);
    await usuario.save();

    res.json(usuario);
  } catch (err) {
    res
      .status(500)
      .json({ mensagem: "Erro ao remover endereço", erro: err.message });
  }
});

router.get("/perfil/enderecos", authMiddleware, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario)
      return res.status(404).json({ mensagem: "Usuário não encontrado" });

    const { cep } = req.query;

    if (!cep) {
      return res.json(usuario.endereco);
    }

    const cepSemMascara = cep.replace("-", "").trim();

    const filtrados = usuario.endereco.filter(
      (e) => e.cep?.replace("-", "").trim() === cepSemMascara
    );

    res.json(filtrados);
  } catch (err) {
    res
      .status(500)
      .json({ mensagem: "Erro ao buscar endereços", erro: err.message });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ mensagem: "Logout realizado com sucesso" });
});

module.exports = router;
