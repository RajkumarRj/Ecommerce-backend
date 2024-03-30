const express = require("express");
const productRoutes = require("../controller/product");
const authMiddleware = require("../middleware/auth");

const router = express.Router();


router.post("/" ,authMiddleware(["admin"]), productRoutes.createProduct);

router.get("/" ,authMiddleware(["buyer" , "seller"]), productRoutes.getProduct);


router.post("/:action", authMiddleware(["buyer" ,"seller" ,"admin"]), productRoutes.likeDislikeController);

router.get("/product-by-id" , productRoutes.productDetailsController);

router.post("/:productId/review" , authMiddleware(['admin','buyer']), productRoutes.reviewProductController);

module.exports = router;

