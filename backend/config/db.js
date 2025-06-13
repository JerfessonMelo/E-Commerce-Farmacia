const mongoose = require("mongoose");

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado ao MongoDB Atlas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  }
};

module.exports = conectarDB;
