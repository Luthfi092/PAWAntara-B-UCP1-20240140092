// app.js
const express = require("express");
const path = require("path");

const pagesRouter = require("./routes/pages");
const productsRouter = require("./routes/products");
const { getIcon } = require("./lib/icons");

const app = express();
const PORT = process.env.PORT || 3000;

// Helper ikon custom tersedia langsung di semua view EJS lewat productIcon()
app.locals.productIcon = getIcon;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static assets (CSS/JS/gambar) lewat express.static
app.use(express.static(path.join(__dirname, "public")));

// Parse form data (dibutuhkan untuk form Tanya AI, dsb.)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/", pagesRouter);
app.use("/", productsRouter);

// 404 handler - halaman tidak ditemukan (bukan crash polos)
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Halaman Tidak Ditemukan",
    activePage: ""
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
