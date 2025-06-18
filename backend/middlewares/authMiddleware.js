const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  } else {
    return res.status(401).json({ mensagem: "Token ausente ou malformado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    console.error("Erro ao verificar token:", err.message);
    return res.status(401).json({ mensagem: "Token inválido ou expirado" });
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
