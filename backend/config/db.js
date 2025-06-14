const mongoose = require("mongoose");

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado ao MongoDB Atlas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error.message);
    console.error("Código do erro:", error.code);
  }
};

module.exports = conectarDB;
