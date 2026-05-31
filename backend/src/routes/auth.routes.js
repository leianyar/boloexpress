const express = require("express");

const {
  register,
  login,
  me,
  updateProfile,
  changePassword
} = require("../controllers/auth.controller");

const {
  authMiddleware
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.patch("/profile", authMiddleware, updateProfile);
router.patch("/change-password", authMiddleware, changePassword);

module.exports = router;