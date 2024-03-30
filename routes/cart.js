const express = require("express");

const authMiddleware = require("../middleware/auth");

const router = express.Router();

const cartController = require("../controller/cart")


router.post("/cart" , authMiddleware(["admin" ,"seller","buyer"]) ,cartController.createCart );

router.get("/cart" , cartController.getCart)


module.exports = router;