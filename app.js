// app.js
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const path = require("path");

const requestLogger = require("./lib/logger");
const { getIcon, ICONS } = require("./lib/icons");

const pagesRouter = require("./routes/pages");
const productsRouter = require("./routes/products");
const authRouter = require("./routes/auth");
const dashboardRouter = require("./routes/dashboard");
const chatRouter = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 3000;

// Helper ikon custom tersedia langsung di semua view EJS lewat productIcon()
app.locals.productIcon = getIcon;
app.locals.iconsMap = ICONS;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static assets (CSS/JS/gambar) lewat express.static
app.use(express.static(path.join(__dirname, "public")));

// Body parser (form data & JSON dari fetch)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware custom #1: logger (di luar auth) — mencatat method + endpoint + waktu
app.use(requestLogger);

// Session (dipakai untuk login admin)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-jangan-dipakai-produksi",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 4 // 4 jam
    }
  })
);

// Middleware custom #2 (auth-related, tapi bukan proteksi): expose status
// login ke semua view lewat res.locals, supaya navbar bisa tampilkan
// Dashboard/Logout vs Login secara kondisional.
app.use((req, res, next) => {
  res.locals.isLoggedIn = Boolean(req.session && req.session.isAdmin);
  res.locals.username = req.session ? req.session.username : null;
  next();
});

// Routes
app.use("/", authRouter);
app.use("/", pagesRouter);
app.use("/", productsRouter);
app.use("/", dashboardRouter);
app.use("/", chatRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Halaman Tidak Ditemukan",
    activePage: ""
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
