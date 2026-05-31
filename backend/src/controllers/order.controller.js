const prisma = require("../utils/prisma");

async function createOrder(req, res) {
  try {
    const {
      cakeId,
      eventType,
      eventDate,
      quantity,
      size,
      message,
      address,
      phone
    } = req.body;

    if (!cakeId || !eventType || !eventDate || !size || !address || !phone) {
      return res.status(400).json({
        message: "Preencha todos os campos obrigatórios."
      });
    }

    const cake = await prisma.cake.findUnique({
      where: { id: cakeId }
    });

    if (!cake) {
      return res.status(404).json({
        message: "Bolo não encontrado."
      });
    }

    if (!cake.available) {
      return res.status(400).json({
        message: "Este bolo não está disponível para encomenda."
      });
    }

    const finalQuantity = Number(quantity) || 1;
    const totalPrice = cake.price * finalQuantity;

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        cakeId,
        eventType,
        eventDate: new Date(eventDate),
        quantity: finalQuantity,
        size,
        message,
        address,
        phone,
        totalPrice,
        status: "PENDENTE"
      },
      include: {
        cake: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    return res.status(201).json({
      message: "Encomenda realizada com sucesso.",
      order
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao realizar encomenda."
    });
  }
}

async function listMyOrders(req, res) {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        cake: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao listar suas encomendas."
    });
  }
}

async function listAllOrders(req, res) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        cake: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao listar encomendas."
    });
  }
}

async function getOrderById(req, res) {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        cake: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        message: "Encomenda não encontrada."
      });
    }

    if (req.user.role !== "ADMIN" && order.userId !== req.user.id) {
      return res.status(403).json({
        message: "Acesso negado."
      });
    }

    return res.json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao buscar encomenda."
    });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "PENDENTE",
      "CONFIRMADA",
      "EM_PREPARACAO",
      "PRONTA",
      "ENTREGUE",
      "CANCELADA"
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Estado da encomenda inválido."
      });
    }

    const orderExists = await prisma.order.findUnique({
      where: { id }
    });

    if (!orderExists) {
      return res.status(404).json({
        message: "Encomenda não encontrada."
      });
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status
      },
      include: {
        cake: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    return res.json({
      message: "Estado da encomenda atualizado com sucesso.",
      order
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao atualizar estado da encomenda."
    });
  }
}

async function cancelMyOrder(req, res) {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({
        message: "Encomenda não encontrada."
      });
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({
        message: "Acesso negado."
      });
    }

    if (order.status !== "PENDENTE") {
      return res.status(400).json({
        message: "Só é possível cancelar encomendas pendentes."
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: "CANCELADA"
      },
      include: {
        cake: true
      }
    });

    return res.json({
      message: "Encomenda cancelada com sucesso.",
      order: updatedOrder
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao cancelar encomenda."
    });
  }
}

module.exports = {
  createOrder,
  listMyOrders,
  listAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelMyOrder
};