// public/js/chat.js
document.addEventListener("DOMContentLoaded", function () {
  const chatForm = document.getElementById("chatForm");
  const chatWindow = document.getElementById("chatWindow");
  const textarea = document.getElementById("pertanyaan");
  const submitBtn = document.getElementById("chatSubmitBtn");
  const errorBox = document.getElementById("chatError");

  if (!chatForm) return;

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function addBubble(text, sender) {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble chat-bubble-${sender}`;
    bubble.innerHTML = `<p>${escapeHtml(text)}</p>`;
    chatWindow.appendChild(bubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function addTypingIndicator() {
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble chat-bubble-ai";
    bubble.id = "typingIndicator";
    bubble.innerHTML = `<p>Mengetik...</p>`;
    chatWindow.appendChild(bubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function removeTypingIndicator() {
    const el = document.getElementById("typingIndicator");
    if (el) el.remove();
  }

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  function hideError() {
    errorBox.hidden = true;
    errorBox.textContent = "";
  }

  chatForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    hideError();

    // Validasi dasar di frontend: cegah kirim pesan kosong
    const message = textarea.value.trim();
    if (!message) {
      showError("Tulis pertanyaan Anda dulu sebelum mengirim.");
      return;
    }

    addBubble(message, "user");
    textarea.value = "";
    submitBtn.disabled = true;
    addTypingIndicator();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const result = await res.json();
      removeTypingIndicator();

      if (!res.ok || !result.success) {
        showError(result.message || "Gagal mengirim pesan.");
        return;
      }

      addBubble(result.data.reply, "ai");
    } catch (err) {
      console.error("Chat error:", err);
      removeTypingIndicator();
      showError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      submitBtn.disabled = false;
      textarea.focus();
    }
  });

  // Enter untuk kirim, Shift+Enter untuk baris baru
  textarea.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chatForm.requestSubmit();
    }
  });
});
