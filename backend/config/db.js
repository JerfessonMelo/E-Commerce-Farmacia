const mongoose = require("mongoose");

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado ao MongoDB Atlas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error.message);
    console.error("Código do erro:", error.code);

    // Tenta uma string de conexão alternativa quando ocorre erro de DNS
    if (
      (error.code === "ENOTFOUND" || error.message.includes("ENOTFOUND")) &&
      process.env.MONGODB_URI_ALTERNATIVE
    ) {
      try {
        await mongoose.connect(process.env.MONGODB_URI_ALTERNATIVE);
        console.log("✅ Conectado ao MongoDB usando URI alternativa!");
        return;
      } catch (altError) {
        console.error("❌ Falha também com URI alternativa:", altError.message);
      }
    }

    process.exit(1);
  }
};

module.exports = conectarDB;
