const prisma = require("../utils/prisma");

async function createCake(req, res) {
  try {
    const { name, description, price, imageUrl, category, available } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        message: "Nome, descrição, preço e categoria são obrigatórios."
      });
    }

    const cake = await prisma.cake.create({
      data: {
        name,
        description,
        price: Number(price),
        imageUrl,
        category,
        available: available ?? true
      }
    });

    return res.status(201).json({
      message: "Bolo cadastrado com sucesso.",
      cake
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao cadastrar bolo."
    });
  }
}

async function listCakes(req, res) {
  try {
    const cakes = await prisma.cake.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json(cakes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao listar bolos."
    });
  }
}

async function getCakeById(req, res) {
  try {
    const { id } = req.params;

    const cake = await prisma.cake.findUnique({
      where: { id }
    });

    if (!cake) {
      return res.status(404).json({
        message: "Bolo não encontrado."
      });
    }

    return res.json(cake);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao buscar bolo."
    });
  }
}

async function updateCake(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, category, available } = req.body;

    const cakeExists = await prisma.cake.findUnique({
      where: { id }
    });

    if (!cakeExists) {
      return res.status(404).json({
        message: "Bolo não encontrado."
      });
    }

    const cake = await prisma.cake.update({
      where: { id },
      data: {
        name,
        description,
        price: price !== undefined ? Number(price) : undefined,
        imageUrl,
        category,
        available
      }
    });

    return res.json({
      message: "Bolo atualizado com sucesso.",
      cake
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao atualizar bolo."
    });
  }
}

async function deleteCake(req, res) {
  try {
    const { id } = req.params;

    const cakeExists = await prisma.cake.findUnique({
      where: { id }
    });

    if (!cakeExists) {
      return res.status(404).json({
        message: "Bolo não encontrado."
      });
    }

    await prisma.cake.delete({
      where: { id }
    });

    return res.json({
      message: "Bolo eliminado com sucesso."
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao eliminar bolo."
    });
  }
}

module.exports = {
  createCake,
  listCakes,
  getCakeById,
  updateCake,
  deleteCake
};