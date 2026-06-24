const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

router.get("/", (req, res) => {
  res.redirect("/login");
});

// Create Account
router.get("/create", (req, res) => {
  res.render("createAccount");
});

router.post("/create", async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  const user = await userModel.findOne({ email });
  if (user) {
    req.flash("error", "user already exist.");
    return res.redirect("/create");
  }

  if (password !== confirmPassword) {
    req.flash("error", "Passwords do not match.");
    return res.redirect("/create");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.create({ name, email, password: hashedPassword });
    req.flash("success", "Account created successfully! Please login.");
    res.redirect("/login");
  } catch (err) {
    next(err);
  }
});

// Login
router.get("/login", (req, res) => {
  res.render("loginPage");
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      req.flash("error", "Invalid email.");
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error", "Invalid password.");
      return res.redirect("/login");
    }

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    res.redirect("/dashboard");
  } catch (err) {
    next(err);
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("token");
    res.redirect("/login");
  });
});

module.exports = router;
