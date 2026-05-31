const express = require("express");

const {
  createOrder,
  listMyOrders,
  listAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelMyOrder
} = require("../controllers/order.controller");

const {
  authMiddleware,
  authorizeRoles
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createOrder);

router.get("/my-orders", authMiddleware, listMyOrders);

router.get(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  listAllOrders
);

router.get("/:id", authMiddleware, getOrderById);

router.patch(
  "/:id/status",
  authMiddleware,
  authorizeRoles("ADMIN"),
  updateOrderStatus
);

router.patch("/:id/cancel", authMiddleware, cancelMyOrder);

module.exports = router;