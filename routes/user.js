const express = require("express");
const userRoutes = require("../controller/user");
const authMiddleware = require("../middleware/auth");

const router = express.Router();


router.post("/register",userRoutes.userRegistration );

router.post("/login" , userRoutes.login);

router.post("/logout" ,userRoutes.logout );

router.post("/wishlist" , authMiddleware(["admin","seller","buyer"]), userRoutes.addWishList);

router.get("/wishlist" , authMiddleware(["admin","seller","buyer"]), userRoutes.getWishList);

router.post("/address" ,authMiddleware(["admin" , "seller","buyer"]), userRoutes.saveAddress);
module.exports = router;