require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const mongooseconnection = require("./config/db");
const session = require("express-session");
const flash = require("express-flash");

const authRoutes = require("./routes/authRoutes");
const hisaabRoutes = require("./routes/hisaabRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const deleteHisaabRoutes = require("./routes/deleteHisaab");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: process.env.SECRET_KEY, resave: false, saveUninitialized: true }));
app.use(flash());

// View Engine Setup
app.set("view engine", "ejs");

// Connect to Database
mongooseconnection();

// Routes
app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/", hisaabRoutes);
app.use("/", deleteHisaabRoutes);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
