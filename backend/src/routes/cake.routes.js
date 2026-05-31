const express = require("express");

const {
  createCake,
  listCakes,
  getCakeById,
  updateCake,
  deleteCake
} = require("../controllers/cake.controller");

const {
  authMiddleware,
  authorizeRoles
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", listCakes);
router.get("/:id", getCakeById);

router.post(
  "/",
  authMiddleware,
  authorizeRoles("ADMIN"),
  createCake
);

router.patch(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  updateCake
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  deleteCake
);

module.exports = router;