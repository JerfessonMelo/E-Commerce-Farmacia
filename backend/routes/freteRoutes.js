const express = require("express");
const { calcularPrecoPrazo } = require("correios-brasil");

const router = express.Router();

router.post("/calcular", async (req, res) => {
  const { cepDestino, peso, comprimento, altura, largura } = req.body;
  console.log("➡️ Requisição recebida para calcular frete:", req.body);

  const args = {
    sCepOrigem: "01001-000",
    sCepDestino: cepDestino,
    nVlPeso: peso,
    nCdFormato: 1,
    nVlComprimento: comprimento,
    nVlAltura: altura,
    nVlLargura: largura,
    nCdServico: ["04014"],
    nVlDiametro: 0,
  };

  try {
    const resultado = await calcularPrecoPrazo(args);
    console.log("✔️ Resultado dos Correios:", resultado);
    res.json(resultado[0]);
  } catch (err) {
    console.error("❌ Erro no cálculo:", err.message);
    res
      .status(500)
      .json({ mensagem: "Erro ao calcular frete", erro: err.message });
  }
});

module.exports = router;
