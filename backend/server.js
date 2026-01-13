const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const cartRoutes = require("./routes/cartRoutes");
const sellerRequestRoutes = require("./routes/sellerRequestRoutes");
const adminDashRoutes = require("./routes/adminDashRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const sellerDashRoutes = require("./routes/sellerDashRoutes");
const superAdminDashRoutes = require("./routes/superAdminDashRoutes");
dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/sellerRequest", sellerRequestRoutes);
app.use("/api/admin", adminDashRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/seller", sellerDashRoutes);
app.use("/api/superAdmin", superAdminDashRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
