const express = require('express');
const router = express.Router();
const {
    register,
    login,
    logout
} = require("../controller/authController");
const verifyToken = require("../../middleware/verifyToken");


router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/profile", verifyToken, (req, res) => {
    res.json({ msg: "Welcome to your profile", user: req.user });
  });
  
module.exports = router;