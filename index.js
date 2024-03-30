const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const authMiddleware = require("./middleware/auth");

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");

const cartRoutes = require("./routes/cart");
const couponRoutes = require("./routes/coupon");
const orderRoutes = require("./routes/order");

mongoose
  .connect(
    "mongodb+srv://rajkumarmass475:nu3tJqZBjEnoyXcK@cluster0.y4f0frg.mongodb.net/"
  )
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));
dotenv.config();

app.use(express.json());
app.use("/api/v1", userRoutes);

app.use("/api/product", productRoutes);

app.use("/api/v1", cartRoutes);

app.use("/api/v1/coupon", couponRoutes);

app.use("/api/v1/order", authMiddleware(["buyer"]), orderRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is up and running");
});
