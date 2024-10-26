const express = require("express");

const router = express.Router();

//Codes routes

const codeController = require("../controllers/code.controller");

router.get("/", codeController.getAllCodes);
router.get("/verify/:code", codeController.findSingleCode);
router.post("/", codeController.createCode);
router.post("/delete-all-codes", codeController.deleteAllCodes);

module.exports = router;
