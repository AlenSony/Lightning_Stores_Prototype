import bcrypt from "bcrypt";
import cookie from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import dbConnect from "../database/db.js";
import Device from "../models/device.js";
import User from "../models/user.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie(jwtSecret));

// Connect to MongoDB and start server
async function startServer() {
  try {
    await dbConnect();

    // Define routes after successful database connection
    app.post("/api/signup", async (req, res) => {
      try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
          return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user._id }, jwtSecret, {
          expiresIn: "1h",
        });

        res.cookie("token", token, {
          httpOnly: true,
          secure: false, // true in production (HTTPS)
          sameSite: "strict",
        });

        res.status(201).json({ message: "User created successfully" });
      } catch (err) {
        console.error("Server Error:", err);
        res
          .status(500)
          .json({ message: "Internal server error", error: err.message });
      }
    });

    app.post("/api/login", async (req, res) => {
      try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
          return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, jwtSecret, {
          expiresIn: "1h",
        });

        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
        });

        res.json({ message: "Login successful" });
      } catch (err) {
        res
          .status(500)
          .json({ message: "Internal server error", error: err.message });
      }
    });

    const AuthMiddleware = (req, res, next) => {
      const token = req.cookies.token;

      if (!token) return res.status(401).json({ message: "No token provided" });

      jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
          }
          return res.status(403).json({ message: "Invalid token" });
        }

        req.user = decoded; // attach payload (e.g. userId)
        next();
      });
    };

    app.post("/api/logout", (req, res) => {
      res.clearCookie("token");
      res.json({ message: "Logout successful" });
    });

    app.get("/api/product", AuthMiddleware, async (req, res) => {
      const search = req.query.product_search;
      if (!search) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const products = await Device.find({
        name: { $regex: search, $options: "i" },
      });
      res.json(products);
    });

    app.post("/api/admin/product", AuthMiddleware, async (req, res) => {
      try {
        const user = await User.findById(req.user.userId);
        if (user.role !== "admin") {
          return res.status(403).json({ message: "Admin access required" });
        }
        const {
          name,
          company,
          description,
          ram,
          storage,
          expected_price,
          actual_price,
          stock,
          category,
          image_url,
        } = req.body;
        if (
          !name ||
          !company ||
          !description ||
          !ram ||
          !storage ||
          !expected_price ||
          !actual_price ||
          !stock ||
          !category ||
          !image_url
        ) {
          return res.status(400).json({ message: "All fields are required" });
        }
        const device = new Device({
          name,
          company,
          description,
          ram,
          storage,
          expected_price,
          actual_price,
          stock,
          category,
          image_url,
        });
        await device.save();
        res.status(201).json({ message: "Product created successfully" });
      } catch (err) {
        res
          .status(500)
          .json({ message: "Internal server error", error: err.message });
      }
    });

    app.patch("/api/admin/product/:id", AuthMiddleware, async (req, res) => {
      try {
        // Check if user is admin
        const user = await User.findById(req.user.userId);
        if (user.role !== "admin") {
          return res.status(403).json({ message: "Admin access required" });
        }

        const { id } = req.params;
        const updates = req.body; // contains only fields you want to update

        const device = await Device.findById(id);
        if (!device) {
          return res.status(404).json({ message: "Product not found" });
        }

        // Update only provided fields
        Object.keys(updates).forEach((key) => {
          device[key] = updates[key];
        });

        await device.save();

        res
          .status(200)
          .json({ message: "Product updated successfully", device });
      } catch (err) {
        res
          .status(500)
          .json({ message: "Internal server error", error: err.message });
      }
    });
    app.delete("/api/admin/product/:id", AuthMiddleware, async (req, res) => {
      try {
        const user = await User.findById(req.user.userId);
        if (user.role !== "admin") {
          return res.status(403).json({ message: "Admin access required" });
        }
        const { id } = req.params;
        const device = await Device.findById(id);
        if (!device) {
          return res.status(404).json({ message: "Product not found" });
        }
        await device.deleteOne();
        res.status(200).json({ message: "Product deleted successfully" });
      } catch (err) {
        res
          .status(500)
          .json({ message: "Internal server error", error: err.message });
      }
    });

    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}
startServer();
