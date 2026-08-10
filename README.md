# Toko Sembako Bu Aries

Website toko sembako — Express + EJS, dengan dashboard admin (CRUD produk),
login/session, dan chatbot dummy. Dikerjakan bertahap: Sprint 1 (fondasi
statis) lalu Sprint 2 (dashboard, auth, REST API penuh, chat).

## Menjalankan project

```bash
npm install
cp .env.example .env    # lalu isi sesuai instruksi di dalam file, ATAU pakai kredensial default di bawah
npm run dev              # pakai nodemon, auto-restart saat file berubah
# atau
npm start                 # node app.js biasa
```

Server berjalan di `http://localhost:3000`.

> File `.env` sudah disertakan langsung di dalam zip project ini (sudah
> berisi kredensial default di bawah) supaya bisa langsung dijalankan tanpa
> setup tambahan. `.env` **tidak** ikut ter-push ke GitHub (lihat `.gitignore`)
> — kalau clone dari repo, wajib copy `.env.example` ke `.env` dulu.

## Kredensial Admin (untuk keperluan pengecekan)

```
URL   : http://localhost:3000/login
Username : admin
Password : admin123
```

Password di atas **tidak** disimpan plain text — yang tersimpan di `.env`
adalah hash bcrypt-nya (`ADMIN_PASSWORD_HASH`). Untuk ganti password, jalankan:

```bash
node scripts/generate-hash.js "password_baru"
```

lalu copy hasil `ADMIN_PASSWORD_HASH=...` ke file `.env`.

## Struktur

```
app.js                     # entry point Express: session, logger, routing
lib/
  store.js                  # "database" in-memory produk — single source of truth
                             # dipakai bareng oleh GET, POST, PUT, DELETE
  auth.js                    # verifikasi kredensial (bcrypt) + middleware requireLoginPage/requireLoginApi
  logger.js                   # middleware custom non-auth: log method+endpoint+waktu
  chatbot.js                   # logika balasan dummy (keyword matching), TANPA API AI eksternal
  icons.js                      # ikon SVG custom per kategori produk
routes/
  pages.js                   # GET / , GET /tanya-ai
  products.js                 # halaman /produk, /produk/:id + REST API /api/products (CRUD)
  auth.js                      # GET /login, POST /api/login, POST /api/logout
  dashboard.js                  # GET /dashboard (protected)
  chat.js                        # POST /api/chat
scripts/
  generate-hash.js            # helper bikin hash bcrypt untuk .env
views/
  beranda.ejs, produk.ejs, produk-detail.ejs, tanya-ai.ejs,
  login.ejs, dashboard.ejs, 404.ejs
  partials/ (head, navbar, footer)
public/
  css/style.css               # layout responsif (flexbox/grid + media query)
  js/
    main.js                    # hamburger menu + tombol logout
    auth.js                     # form login: validasi + fetch ke /api/login
    produk.js                    # halaman produk publik: fetch dinamis + filter
    dashboard.js                  # CRUD produk di dashboard admin (fetch)
    chat.js                        # chat Tanya AI (fetch async/await)
.env.example                # template environment variable (aman di-commit)
.env                          # kredensial asli (JANGAN di-commit, sudah di .gitignore)
```

## Rute Halaman

| Method | Path            | Akses  | Keterangan                                              |
|--------|-----------------|--------|-----------------------------------------------------------|
| GET    | `/`             | Publik | Beranda — hero + preview produk                           |
| GET    | `/produk`       | Publik | Daftar produk (data dimuat dinamis lewat fetch ke API)     |
| GET    | `/produk/:id`   | Publik | Detail produk; pesan wajar kalau id tidak ditemukan        |
| GET    | `/tanya-ai`     | Publik | Chat real-time ke backend (bukan API AI eksternal)          |
| GET    | `/login`        | Publik | Form login admin                                             |
| GET    | `/dashboard`    | **Login wajib** | Kelola produk (tambah/edit/hapus). Redirect ke `/login` kalau belum login |

## REST API

Format response konsisten: `{ success, message?, data, count? }`.

| Method | Endpoint              | Akses           | Keterangan                                  |
|--------|-----------------------|-----------------|----------------------------------------------|
| GET    | `/api/products`       | Publik          | Semua produk. Query: `?kategori=`, `?search=` |
| GET    | `/api/products/:id`   | Publik          | Detail 1 produk, 404 kalau tidak ada          |
| POST   | `/api/products`       | **Login wajib** | Tambah produk baru                             |
| PUT    | `/api/products/:id`   | **Login wajib** | Update produk (partial update didukung)         |
| DELETE | `/api/products/:id`   | **Login wajib** | Hapus produk                                     |
| POST   | `/api/login`           | Publik          | `{ username, password }` → set session          |
| POST   | `/api/logout`          | -               | Hapus session                                     |
| POST   | `/api/chat`             | Publik          | `{ message }` → balasan dummy dari backend        |

Endpoint yang **login wajib** akan menolak dengan `401 JSON` kalau di-hit
tanpa session valid (sudah diuji langsung lewat curl/Postman tanpa lewat UI,
bukan cuma disembunyikan di frontend).

## Fitur per bagian

**Auth & session**
- Login: `POST /api/login`, cek username + `bcrypt.compareSync` terhadap hash di `.env`.
- Session disimpan via `express-session` (cookie, 4 jam).
- Middleware `requireLoginPage` (redirect ke `/login`) dan `requireLoginApi` (401 JSON) — dua middleware terpisah karena halaman butuh redirect sementara API butuh status code JSON.
- Logout: `POST /api/logout`, destroy session, tombol logout ada di navbar tiap halaman saat sedang login.

**Data produk**
- Disimpan array in-memory di `lib/store.js`. Karena Node meng-cache module, seluruh route (`GET`, `POST`, `PUT`, `DELETE`, dashboard, halaman publik) memakai **objek array yang sama** — jadi tidak ada dua sumber data yang bisa desync.
- Data reset ke seed awal setiap kali server di-restart (in-memory, bukan database persisten — sesuai pilihan "array in-memory" di ketentuan tugas).

**Dashboard admin**
- `views/dashboard.ejs` + `public/js/dashboard.js`.
- Form tambah/edit produk memanggil `POST`/`PUT` lewat `fetch`, tabel produk di-refresh otomatis setelah setiap aksi.
- Tombol Hapus konfirmasi dulu (`confirm()`) sebelum memanggil `DELETE`.
- Validasi dasar di frontend (nama/kategori tidak boleh kosong, harga & stok harus angka >= 0) SEBELUM request dikirim — tapi validasi yang sama juga diulang di server (`routes/products.js`) supaya tetap aman kalau di-hit langsung tanpa lewat form.

**Halaman Produk (publik)**
- Tidak ada lagi data hardcode di HTML — `views/produk.ejs` cuma shell, `public/js/produk.js` fetch ke `GET /api/products` saat halaman dibuka.
- Filter kategori/pencarian tetap lewat query string (`?kategori=`, `?search=`), tapi sekarang query-nya dikirim ke API lewat `fetch`, bukan reload halaman biasa. URL browser tetap ter-update (`history.pushState`) supaya link/bookmark filter tetap berfungsi.

**Tanya AI (chat dummy)**
- `lib/chatbot.js` — keyword matching untuk: jam buka, ongkir/pengiriman, cara pembayaran, ketersediaan stok (bisa sebut nama produk spesifik), sapaan, dan fallback acak kalau tidak cocok kata kunci manapun.
- **100% logika sendiri di backend** — tidak ada panggilan ke API AI eksternal (OpenAI/Anthropic/Gemini/dsb), sesuai ketentuan tugas.
- Frontend (`public/js/chat.js`) kirim pesan lewat `fetch` async/await ke `POST /api/chat`, render bubble chat pelanggan & AI secara dinamis di DOM (termasuk indikator "Mengetik...").

**Middleware custom**
- `lib/logger.js` — mencatat `[timestamp] METHOD /path` ke terminal untuk **setiap** request masuk, dipasang paling awal di `app.js` (di luar/sebelum middleware auth).
- `lib/auth.js` — dua middleware proteksi (`requireLoginPage`, `requireLoginApi`) dipasang khusus di route yang butuh login.

## Testing manual yang sudah dilakukan

- `POST/PUT/DELETE /api/products` tanpa session → **401**
- `GET /dashboard` tanpa session → **redirect 302 ke /login**
- Login salah → 401; login benar → session tersimpan, dashboard bisa diakses
- CRUD penuh via cookie session: tambah (count naik), update, hapus (count balik normal)
- `GET /api/products` setelah mutasi selalu mencerminkan perubahan (bukti sumber data sama)
- Chat merespons keyword jam buka/ongkir/bayar/stok dengan benar; pesan kosong → 400
- Filter kategori & search di `/produk` mengubah hasil tanpa reload halaman

## Catatan

- Session pakai `MemoryStore` bawaan `express-session` — cukup untuk development/demo, akan reset kalau server restart (bukan untuk production).
- Tidak ada integrasi API AI eksternal apa pun di seluruh project, sesuai ketentuan tugas Sprint 1 & Sprint 2.
