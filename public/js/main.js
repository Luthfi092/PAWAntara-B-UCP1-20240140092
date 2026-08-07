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
