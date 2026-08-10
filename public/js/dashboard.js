// public/js/dashboard.js
document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.getElementById("productTableBody");
  const productCount = document.getElementById("productCount");
  const form = document.getElementById("productForm");
  const formTitle = document.getElementById("formTitle");
  const formError = document.getElementById("productFormError");
  const submitBtn = document.getElementById("submitBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  const idInput = document.getElementById("productId");
  const nameInput = document.getElementById("name");
  const categoryInput = document.getElementById("category");
  const priceInput = document.getElementById("price");
  const stockInput = document.getElementById("stock");
  const descInput = document.getElementById("description");

  function formatRupiah(num) {
    return "Rp " + Number(num).toLocaleString("id-ID");
  }

  function showFormError(message) {
    formError.textContent = message;
    formError.hidden = false;
  }

  function hideFormError() {
    formError.hidden = true;
    formError.textContent = "";
  }

  function resetForm() {
    form.reset();
    idInput.value = "";
    formTitle.textContent = "Tambah Produk Baru";
    submitBtn.textContent = "Simpan Produk";
    cancelEditBtn.hidden = true;
    hideFormError();
  }

  function renderProducts(products) {
    productCount.textContent = products.length;

    if (products.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" class="table-empty">Belum ada produk. Tambahkan lewat form di samping.</td></tr>`;
      return;
    }

    tableBody.innerHTML = products
      .map(
        (p) => `
      <tr data-id="${p.id}">
        <td>${escapeHtml(p.name)}</td>
        <td>${escapeHtml(p.category)}</td>
        <td class="cell-price">${formatRupiah(p.price)}</td>
        <td class="${p.stock <= 5 ? "cell-stock-low" : ""}">${p.stock}</td>
        <td>
          <div class="table-actions">
            <button type="button" class="btn-edit" data-action="edit" data-id="${p.id}">Edit</button>
            <button type="button" class="btn-delete" data-action="delete" data-id="${p.id}">Hapus</button>
          </div>
        </td>
      </tr>
    `
      )
      .join("");
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  async function loadProducts() {
    try {
      const res = await fetch("/api/products");
      const result = await res.json();
      renderProducts(result.data || []);
    } catch (err) {
      console.error("Gagal memuat produk:", err);
      tableBody.innerHTML = `<tr><td colspan="5" class="table-empty">Gagal memuat data produk.</td></tr>`;
    }
  }

  // Render data awal dari server (hindari flash kosong), lalu selalu sinkron ulang lewat fetch
  try {
    const seedData = JSON.parse(document.getElementById("initial-products-data").textContent);
    renderProducts(seedData);
  } catch (e) {
    // biarkan loadProducts() di bawah yang mengisi
  }
  loadProducts();

  // ===== Validasi dasar di frontend sebelum request dikirim =====
  function validateForm() {
    const name = nameInput.value.trim();
    const category = categoryInput.value.trim();
    const price = priceInput.value;
    const stock = stockInput.value;

    if (!name) return "Nama produk wajib diisi.";
    if (!category) return "Kategori wajib diisi.";
    if (price === "" || Number(price) < 0) return "Harga wajib diisi dengan angka valid.";
    if (stock === "" || Number(stock) < 0) return "Stok wajib diisi dengan angka valid.";
    return null;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    hideFormError();

    const validationError = validateForm();
    if (validationError) {
      showFormError(validationError);
      return;
    }

    const payload = {
      name: nameInput.value.trim(),
      category: categoryInput.value.trim(),
      price: Number(priceInput.value),
      stock: Number(stockInput.value),
      description: descInput.value.trim()
    };

    const editingId = idInput.value;
    const isEditing = Boolean(editingId);

    submitBtn.disabled = true;
    submitBtn.textContent = "Menyimpan...";

    try {
      const res = await fetch(isEditing ? `/api/products/${editingId}` : "/api/products", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.status === 401) {
        alert("Sesi login sudah habis. Silakan login lagi.");
        window.location.href = "/login";
        return;
      }

      if (!res.ok || !result.success) {
        showFormError(result.message || "Gagal menyimpan produk.");
        return;
      }

      resetForm();
      loadProducts();
    } catch (err) {
      console.error("Gagal menyimpan produk:", err);
      showFormError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      submitBtn.disabled = false;
      if (submitBtn.textContent === "Menyimpan...") submitBtn.textContent = "Simpan Produk";
    }
  });

  cancelEditBtn.addEventListener("click", resetForm);

  // Delegasi event untuk tombol Edit / Hapus di tabel
  tableBody.addEventListener("click", async function (e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const id = btn.dataset.id;

    if (btn.dataset.action === "edit") {
      try {
        const res = await fetch(`/api/products/${id}`);
        const result = await res.json();
        if (!result.success) return;

        const p = result.data;
        idInput.value = p.id;
        nameInput.value = p.name;
        categoryInput.value = p.category;
        priceInput.value = p.price;
        stockInput.value = p.stock;
        descInput.value = p.description || "";

        formTitle.textContent = `Edit Produk: ${p.name}`;
        submitBtn.textContent = "Update Produk";
        cancelEditBtn.hidden = false;
        hideFormError();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("Gagal memuat detail produk:", err);
      }
    }

    if (btn.dataset.action === "delete") {
      const row = btn.closest("tr");
      const name = row ? row.querySelector("td")?.textContent : "produk ini";
      if (!confirm(`Hapus "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;

      try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });

        if (res.status === 401) {
          alert("Sesi login sudah habis. Silakan login lagi.");
          window.location.href = "/login";
          return;
        }

        const result = await res.json();
        if (!result.success) {
          alert(result.message || "Gagal menghapus produk.");
          return;
        }

        loadProducts();
      } catch (err) {
        console.error("Gagal menghapus produk:", err);
        alert("Terjadi kesalahan jaringan. Coba lagi.");
      }
    }
  });
});
