const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz1flMi0L8o3XU41EvaDI9fcpnfJafIzBNv0P4ECpt6leFGppjeh6InuJRbQt9uY83C/exec";

document.addEventListener("DOMContentLoaded", () => {
  loadLearningMedia();
});

function openLoginModal() {
  document.getElementById("loginModal").classList.add("show");
}

function closeLoginModal() {
  document.getElementById("loginModal").classList.remove("show");
  document.getElementById("adminPassword").value = "";
  document.getElementById("loginMessage").textContent = "";
}

function adminLogin() {
  const password = document.getElementById("adminPassword").value.trim();
  const message = document.getElementById("loginMessage");

  if (password === "014dd2544d82") {
    message.style.color = "#16a34a";
    message.textContent = "เข้าสู่ระบบสำเร็จ";

    setTimeout(() => {
      window.open("https://docs.google.com/spreadsheets/", "_blank");
    }, 600);
  } else {
    message.style.color = "#dc2626";
    message.textContent = "รหัสผ่านไม่ถูกต้อง";
  }
}

async function loadLearningMedia() {
  const loading = document.getElementById("loading");
  const cardContainer = document.getElementById("cardContainer");
  const emptyState = document.getElementById("emptyState");

  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("ใส่ URL")) {
    loading.classList.add("hidden");
    emptyState.classList.remove("hidden");
    return;
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    const result = await response.json();

    loading.classList.add("hidden");
    cardContainer.innerHTML = "";

    if (!result.success || !result.data || result.data.length === 0) {
      emptyState.classList.remove("hidden");
      return;
    }

    emptyState.classList.add("hidden");

    result.data.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "learning-card";

      const title = escapeHtml(item.title || `สื่อการเรียนรู้ ${index + 1}`);
      const description = escapeHtml(item.description || "รายละเอียดเพิ่มเติม");
      const type = escapeHtml(item.type || "สื่อ");
      const link = item.link || "#";

      card.innerHTML = `
        <div class="card-cover">${type}</div>
        <h3>${title}</h3>
        <p>${description}</p>
        <a class="card-link" href="${link}" target="_blank" rel="noopener">เปิดสื่อ</a>
      `;

      cardContainer.appendChild(card);
    });

  } catch (error) {
    loading.classList.add("hidden");
    emptyState.classList.remove("hidden");
    console.error("โหลดข้อมูลไม่สำเร็จ:", error);
  }
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
