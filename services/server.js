import bcrypt from "bcrypt";
import cookie from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import dbConnect from "../database/db.js";
import Device from "../models/device.js";
import Order from "../models/order.js";
import User from "../models/user.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const jwtSecret = process.env.JWT_SECRET || "!23qweasdz.";

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie(jwtSecret));

// Connect to MongoDB and start server
async function startServer() {
  try {
    await dbConnect();

    // Define routes after successful database connection
    app.post("/api/signup", async (req, res) => {
      let responded = false;
      const guard = setTimeout(() => {
        if (!responded) {
          responded = true;
          console.error("/api/signup timed out waiting for DB");
          return res
            .status(503)
            .json({ message: "Service temporarily unavailable" });
        }
      }, 5000);

      try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
          responded = true;
          clearTimeout(guard);
          return res
            .status(400)
            .json({ message: "Username, email, and password are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          responded = true;
          clearTimeout(guard);
          return res.status(409).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
        });

        // Save user to database
        await newUser.save();

        // Create JWT token
        const token = jwt.sign({ userId: newUser._id }, jwtSecret, {
          expiresIn: "1h",
        });

        // Set cookie
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 3600000, // 1 hour
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });

        responded = true;
        clearTimeout(guard);
        res.status(201).json({
          message: "User created successfully",
          token, // 👈 send the JWT
          user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
          },
        });
      } catch (err) {
        responded = true;
        clearTimeout(guard);
        console.error("Error in /api/signup:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.post("/api/login", async (req, res) => {
      try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res
            .status(400)
            .json({ message: "Email and password are required" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create JWT token
        const token = jwt.sign({ userId: user._id }, jwtSecret, {
          expiresIn: "1h",
        });

        // Set cookie
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 3600000, // 1 hour
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });

        res.status(200).json({
          message: "Login successful",
          token, // 👈 send the JWT
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
          },
        });
      } catch (err) {
        console.error("Error in /api/login:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.post("/api/logout", (req, res) => {
      res.clearCookie("token");
      res.status(200).json({ message: "Logout successful" });
    });

    // Middleware to check if user is authenticated
    const AuthMiddleware = (req, res, next) => {
      try {
        const token = req.cookies.token;
        if (!token) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
      } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
    };

    app.get("/api/user", AuthMiddleware, async (req, res) => {
      try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
      } catch (err) {
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.get("/api/product", AuthMiddleware, async (req, res) => {
      try {
        const products = await Device.find({});
        res.status(200).json(products);
      } catch (err) {
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.get("/api/product/search", AuthMiddleware, async (req, res) => {
      try {
        const { query } = req.query;

        if (!query || query.trim() === "") {
          return res.status(400).json({ message: "Search query is required" });
        }

        const products = await Device.find({
          $or: [
            { name: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { company: { $regex: query, $options: "i" } },
          ],
        });
        if (products.length === 0) {
          return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json(products);
      } catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // POST /api/cart
    app.post("/api/cart", AuthMiddleware, async (req, res) => {
      try {
        const { itemId, quantity } = req.body;
        const user_id = req.user?.userId || req.user?.id;

        // Validate input
        if (!itemId) {
          return res.status(400).json({ message: "Item ID is required" });
        }

        const qty = Number(quantity) || 1;
        if (qty < 1) {
          return res
            .status(400)
            .json({ message: "Quantity must be at least 1" });
        }

        if (!user_id) {
          return res
            .status(401)
            .json({ message: "Unauthorized: user not found" });
        }

        const user = await User.findById(user_id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const product = await Device.findById(itemId);
        if (!product)
          return res.status(404).json({ message: "Product not found" });

        // Check if item already exists in cart
        const existingItem = user.cart.find((item) => item.itemId === itemId);
        if (existingItem) {
          existingItem.quantity += qty;
        } else {
          user.cart.push({ itemId, quantity: qty });
        }

        await user.save();

        // Respond with updated cart
        res.status(200).json({
          message: "Product added to cart successfully",
          cart: user.cart,
        });
      } catch (err) {
        console.error("Error in /api/cart:", err);
        res
          .status(500)
          .json({ message: "Internal server error", error: err.message });
      }
    });

    app.get("/api/cart", AuthMiddleware, async (req, res) => {
      try {
        const user = await User.findById(req.user.userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        console.log("User cart:", user.cart);

        // Map cart items to include product details
        const cartWithDetails = await Promise.all(
          user.cart.map(async (item) => {
            const product = await Device.findById(item.itemId);
            return {
              ...item.toObject(), // Convert Mongoose document to plain object
              productName: product?.name || "Unknown Product",
              productPrice: product?.expected_price || 0,
              productImage:
                product?.image_url ||
                "http://via.placeholder.com/100x100?text=No+Image",
              productDescription:
                product?.description || "No description available",
            };
          })
        );

        res.status(200).json(cartWithDetails);
      } catch (err) {
        res
          .status(500)
          .json({ message: "Internal server error", error: err.message });
      }
    });

    app.put(
      "/api/cart/update/:cartItemId",
      AuthMiddleware,
      async (req, res) => {
        try {
          const { cartItemId } = req.params;
          const { quantity } = req.body;
          const user = await User.findById(req.user.userId);
          if (!user) return res.status(404).json({ message: "User not found" });

          const itemIndex = user.cart.findIndex(
            (item) => item._id.toString() === cartItemId
          );

          if (itemIndex === -1)
            return res.status(404).json({ message: "Item not found in cart" });

          user.cart[itemIndex].quantity = quantity;
          await user.save();

          res.status(200).json({
            message: "Item quantity updated successfully",
            cart: user.cart,
          });
        } catch (err) {
          res
            .status(500)
            .json({ message: "Internal server error", error: err.message });
        }
      }
    );

    app.delete(
      "/api/cart/remove/:cartItemId",
      AuthMiddleware,
      async (req, res) => {
        try {
          const { cartItemId } = req.params;
          const user = await User.findById(req.user.userId);
          if (!user) return res.status(404).json({ message: "User not found" });

          const itemIndex = user.cart.findIndex(
            (item) => item._id.toString() === cartItemId
          );

          if (itemIndex === -1)
            return res.status(404).json({ message: "Item not found in cart" });

          user.cart.splice(itemIndex, 1);
          await user.save();

          res.status(200).json({
            message: "Item removed from cart successfully",
            cart: user.cart,
          });
        } catch (err) {
          res
            .status(500)
            .json({ message: "Internal server error", error: err.message });
        }
      }
    );

    app.post("/api/order/buy_now", AuthMiddleware, async (req, res) => {
      try {
        const { itemId, quantity } = req.body;
        const userId = req.user.userId || req.user.id; // safer extraction
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const product = await Device.findById(itemId);
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        // Create order
        const order = new Order({
          userId,
          items: [{ itemId, quantity }],
          totalPrice: product.expected_price * quantity,
        });
        await order.save();

        res.status(200).json({
          message: "Order placed successfully",
          order,
        });
      } catch (err) {
        res
          .status(500)
          .json({ message: "Internal server error", error: err.message });
      }
    });

    app.post("/api/cart/checkout", AuthMiddleware, async (req, res) => {
      try {
        const user = await User.findById(req.user.userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        if (user.cart.length === 0) {
          return res.status(400).json({ message: "Cart is empty" });
        }
        // Create order
        const order = new Order({
          userId,
          items: user.cart,
          totalPrice: user.cart.reduce(
            (total, item) => total + item.productPrice * item.quantity,
            0
          ),
        });
        await order.save();
        // Clear cart
        user.cart = [];
        await user.save();
        res.status(200).json({
          message: "Order placed successfully",
          order,
        });
      } catch (err) {
        res
          .status(500)
          .json({ message: "Internal server error", error: err.message });
      }
    });
  } catch (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  }
}

startServer();

app.listen(port, () => console.log(`Server running on port ${port}`));
