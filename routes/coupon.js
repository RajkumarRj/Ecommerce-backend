const express = require('express');

const couponController = require("../controller/coupon");
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post("/" , authMiddleware(["admin"]), couponController.createCoupon);

router.get("/" ,couponController.getCoupon);

module.exports = router;