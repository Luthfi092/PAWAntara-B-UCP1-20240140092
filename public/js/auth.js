// public/js/auth.js
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const errorBox = document.getElementById("loginError");
  const submitBtn = document.getElementById("loginSubmitBtn");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  function hideError() {
    errorBox.hidden = true;
    errorBox.textContent = "";
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    hideError();

    // Validasi dasar di frontend sebelum request dikirim: cegah submit kosong
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      showError("Username dan password wajib diisi.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Memproses...";

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        showError(result.message || "Login gagal.");
        submitBtn.disabled = false;
        submitBtn.textContent = "Login";
        return;
      }

      window.location.href = result.redirect || "/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      showError("Terjadi kesalahan jaringan. Coba lagi.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Login";
    }
  });
});
