const multer = require("multer");
const path = require("path");
const express = require("express");
const router = express.Router();
const Produto = require("../models/Produto");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/produtos/");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
  const produtos = await Produto.find({ ativo: true });
  res.json(produtos);
});

router.get("/todos", authMiddleware, adminMiddleware, async (req, res) => {
  const produtos = await Produto.find();
  res.json(produtos);
});

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

router.put("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
  const { ativo } = req.body;
  const produto = await Produto.findByIdAndUpdate(
    req.params.id,
    { ativo },
    { new: true }
  );
  res.json(produto);
});

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("imagem"),
  async (req, res) => {
    try {
      const { nome, descricao, preco, marca } = req.body;
      const imagemUrl = req.file ? `/produtos/${req.file.filename}` : "";

      const novoProduto = new Produto({
        nome,
        descricao,
        preco,
        marca,
        imagemUrl,
      });

      await novoProduto.save();
      res.status(201).json(novoProduto);
    } catch (err) {
      res.status(500).json({
        mensagem: "Erro ao criar produto",
        erro: err.message,
      });
    }
  }
);

module.exports = router;
