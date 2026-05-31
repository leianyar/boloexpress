const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token não informado."
      });
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
      return res.status(401).json({
        message: "Token inválido."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true
      }
    });

    if (!user) {
      return res.status(401).json({
        message: "Usuário não encontrado."
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido ou expirado."
    });
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Acesso negado."
      });
    }

    return next();
  };
}

module.exports = {
  authMiddleware,
  authorizeRoles
};