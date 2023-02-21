const express = require("express");
const router = express.Router();
const authController = require("../api/controllers/authController");

//register
router.post("/register", authController.register);

//login
router.post("/login", authController.login);

//refreshToken
router.get("/refreshToken", authController.getTokenByRefreshToken);

//logout
router.get("/logout", authController.logout);

module.exports = router;
