const express = require("express");
const { calcularPrecoPrazo } = require("correios-brasil");

const router = express.Router();

router.post("/calcular", async (req, res) => {
  const { cepDestino, peso, comprimento, altura, largura } = req.body;

  const args = {
    sCepOrigem: "01001-000",
    sCepDestino: cepDestino,
    nVlPeso: peso,
    nCdFormato: 1,
    nVlComprimento: comprimento,
    nVlAltura: altura,
    nVlLargura: largura,
    nCdServico: ["04014"], // SEDEX
    nVlDiametro: 0,
  };

  try {
    const resultado = await calcularPrecoPrazo(args);
    res.json(resultado[0]);
  } catch (err) {
    res
      .status(500)
      .json({ mensagem: "Erro ao calcular frete", erro: err.message });
  }
});

module.exports = router;
