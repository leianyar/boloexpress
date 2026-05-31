const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma");

async function register(req, res) {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nome, email e senha são obrigatórios."
      });
    }

    const userExists = await prisma.user.findUnique({
      where: { email }
    });

    if (userExists) {
      return res.status(400).json({
        message: "Este email já está cadastrado."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: "CLIENTE"
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });

    return res.status(201).json({
      message: "Conta criada com sucesso.",
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao criar conta."
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email e senha são obrigatórios."
      });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        message: "Email ou senha inválidos."
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Email ou senha inválidos."
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    return res.json({
      message: "Login feito com sucesso.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao fazer login."
    });
  }
}

async function me(req, res) {
  return res.json({
    user: req.user
  });
}

async function updateProfile(req, res) {
  try {
    const { name, phone } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "O nome é obrigatório."
      });
    }

    const user = await prisma.user.update({
      where: {
        id: req.user.id
      },
      data: {
        name,
        phone
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true
      }
    });

    return res.json({
      message: "Perfil atualizado com sucesso.",
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao atualizar perfil."
    });
  }
}

async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Senha atual e nova senha são obrigatórias."
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "A nova senha deve ter pelo menos 6 caracteres."
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id
      }
    });

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Senha atual incorreta."
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        id: req.user.id
      },
      data: {
        password: hashedPassword
      }
    });

    return res.json({
      message: "Senha alterada com sucesso."
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao alterar senha."
    });
  }
}

module.exports = {
  register,
  login,
  me,
  updateProfile,
  changePassword
};