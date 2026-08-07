# Toko Sembako Bu Aries — Sprint 1

Fondasi website (struktur halaman, styling responsif, server Express dasar) untuk toko sembako Bu Aries.

## Menjalankan project

```bash
npm install
npm run dev     # pakai nodemon, auto-restart saat file berubah
# atau
npm start        # node app.js biasa
```

Server berjalan di `http://localhost:3000`.

## Struktur

```
app.js                  # entry point Express
routes/
  pages.js               # GET / dan GET /tanya-ai
  products.js             # GET /produk, GET /produk/:id, GET /api/products
data/
  products.js              # array of object produk dummy
views/
  beranda.ejs, produk.ejs, produk-detail.ejs, tanya-ai.ejs, 404.ejs
  partials/
    head.ejs, navbar.ejs, footer.ejs
public/
  css/style.css            # layout responsif (flexbox/grid + media query)
  js/main.js                # toggle hamburger menu (vanilla JS)
```

## Rute yang tersedia

| Method | Path              | Keterangan                                             |
|--------|-------------------|---------------------------------------------------------|
| GET    | `/`               | Beranda — hero + preview produk                         |
| GET    | `/produk`         | Daftar produk, mendukung `?kategori=` dan `?search=`     |
| GET    | `/produk/:id`     | Detail produk; menampilkan "Produk tidak ditemukan" jika id invalid |
| GET    | `/tanya-ai`       | Tampilan chat + form (belum ada logic balasan)           |
| GET    | `/api/products`   | REST API read-only, mengembalikan seluruh produk (JSON)  |

## Catatan

- Tidak ada database maupun autentikasi di Sprint 1 ini — data produk memakai array dummy di `data/products.js`.
- Tidak ada integrasi API AI eksternal apa pun, sesuai ketentuan tugas.
