const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
router.post("/postlogin", userController.login);
router.post("/postsignup", userController.SignUp);

module.exports = router;
