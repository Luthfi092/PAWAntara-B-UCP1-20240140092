// public/js/main.js
document.addEventListener("DOMContentLoaded", function () {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navLinks = document.getElementById("navLinks");

  if (!hamburgerBtn || !navLinks) return;

  hamburgerBtn.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");
    hamburgerBtn.classList.toggle("open", isOpen);
    hamburgerBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Tutup menu otomatis saat salah satu link diklik (khusus mobile)
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      hamburgerBtn.classList.remove("open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
    });
  });
});

// Tombol logout (ada di navbar setiap halaman kalau sedang login)
document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", async function () {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      const result = await res.json();
      window.location.href = result.redirect || "/login";
    } catch (err) {
      console.error("Gagal logout:", err);
      alert("Gagal logout, coba lagi.");
    }
  });
});
