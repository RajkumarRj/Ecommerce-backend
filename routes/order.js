const express = require("express");
const orderController = require("../controller/order")

const router = express.Router();

router.post("/" , orderController.createOrder);

router.get("/", orderController.getOrder);


module.exports = router;