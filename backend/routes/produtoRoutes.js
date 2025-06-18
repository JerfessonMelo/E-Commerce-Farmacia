const express = require("express");
const multer = require("multer");
const path = require("path");
const { query, validationResult } = require("express-validator");
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
const fileFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".gif"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de arquivo não suportado"));
  }
};
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).toInt(),
    query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
    query("categoria").optional().trim().escape(),
    query("faixaEtaria").optional().trim().escape(),
    query("tags").optional().trim(),
    query("busca").optional().trim(),
    query("sort").optional().trim(),
  ],
  async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erros: erros.array() });
    }

    try {
      const {
        categoria,
        faixaEtaria,
        tags,
        busca,
        page = 1,
        limit = 12,
        sort = "nome",
      } = req.query;

      const filtro = { ativo: true };

      if (categoria) filtro.categoria = categoria.toLowerCase();
      if (faixaEtaria) filtro.faixaEtaria = faixaEtaria.toLowerCase();
      if (tags)
        filtro.tags = {
          $in: tags.split(",").map((t) => t.trim().toLowerCase()),
        };
      if (busca) {
        const regex = new RegExp(busca, "i");
        filtro.$or = [{ nome: regex }, { descricao: regex }, { marca: regex }];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const produtos = await Produto.find(filtro)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Produto.countDocuments(filtro);

      res.json({
        produtos,
        total,
        pagina: parseInt(page),
        paginas: Math.ceil(total / limit),
      });
    } catch (err) {
      res.status(500).json({
        mensagem: "Erro ao buscar produtos",
        erro: err.message,
      });
    }
  }
);

router.get("/todos", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({
      mensagem: "Erro ao buscar todos os produtos",
      erro: err.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto || !produto.ativo) {
      return res.status(404).json({ mensagem: "Produto não encontrado" });
    }
    res.json(produto);
  } catch (err) {
    res.status(500).json({
      mensagem: "Erro ao buscar produto",
      erro: err.message,
    });
  }
});

router.put("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { ativo } = req.body;
    const produto = await Produto.findByIdAndUpdate(
      req.params.id,
      { ativo },
      { new: true }
    );
    res.json(produto);
  } catch (err) {
    res.status(500).json({
      mensagem: "Erro ao atualizar status do produto",
      erro: err.message,
    });
  }
});

router.get("/relacionados/:id", async (req, res) => {
  try {
    const produtoAtual = await Produto.findById(req.params.id);

    if (!produtoAtual || !produtoAtual.ativo) {
      return res.status(404).json([]);
    }

    const relacionados = await Produto.find({
      _id: { $ne: produtoAtual._id },
      categoria: produtoAtual.categoria,
      ativo: true,
    }).limit(10);

    res.json(relacionados);
  } catch (err) {
    res.status(500).json({
      mensagem: "Erro ao buscar produtos relacionados",
      erro: err.message,
    });
  }
});

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("imagem"),
  async (req, res) => {
    try {
      const {
        nome,
        descricao,
        preco,
        marca,
        categoria,
        principioAtivo,
        faixaEtaria,
        tipoProduto,
        tags,
      } = req.body;

      const imagemUrl = req.file ? `/produtos/${req.file.filename}` : "";

      const tagsArray =
        typeof tags === "string"
          ? tags.split(",").map((tag) => tag.trim().toLowerCase())
          : [];

      const novoProduto = new Produto({
        nome,
        descricao,
        preco,
        marca,
        imagemUrl,
        categoria,
        principioAtivo,
        faixaEtaria,
        tipoProduto,
        tags: tagsArray,
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
