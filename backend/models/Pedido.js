const mongoose = require("mongoose");

const pedidoSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  produtos: [
    {
      produtoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Produto",
        required: true,
      },
      quantidade: { type: Number, default: 1 },
    },
  ],
  total: { type: Number, required: true },
  enderecoEntrega: { type: String, required: true },
  frete: { type: Number, default: 0 },
  criadoEm: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Pedido", pedidoSchema);
