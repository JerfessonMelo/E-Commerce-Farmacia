const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ mensagem: "Token ausente" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    res.status(401).json({ mensagem: "Token inválido" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.usuario?.isAdmin) {
    return res
      .status(403)
      .json({ mensagem: "Acesso restrito ao administrador" });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
