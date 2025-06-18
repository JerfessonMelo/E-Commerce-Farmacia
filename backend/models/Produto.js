const mongoose = require("mongoose");

const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: String,
  marca: String,
  preco: { type: Number, required: true },
  imagemUrl: String,
  estoque: Number,
  ativo: { type: Boolean, default: true },
  categoria: String,
  principioAtivo: String,
  faixaEtaria: String,
  tipoProduto: String,
  tags: [String],
});

module.exports = mongoose.model("Produto", produtoSchema);
