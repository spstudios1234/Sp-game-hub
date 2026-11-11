const cards = [...document.querySelectorAll(".game-card")];
const filters = [...document.querySelectorAll(".filter")];
const searchInput = document.getElementById("searchInput");
const resultsCount = document.getElementById("resultsCount");
const emptyState = document.getElementById("emptyState");
let activeFilter = "all";

function filterGames() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach(card => {
    const title = card.dataset.title.toLowerCase();
    const category = card.dataset.category.toLowerCase();
    const type = card.dataset.type.toLowerCase();
    const matchesFilter = activeFilter === "all" || activeFilter === type || activeFilter === category;
    const matchesSearch = title.includes(query) || category.includes(query) || type.includes(query);
    const show = matchesFilter && matchesSearch;
    card.hidden = !show;
    if (show) visible++;
  });
  resultsCount.textContent = `${visible} game${visible === 1 ? "" : "s"}`;
  emptyState.hidden = visible !== 0;
}
filters.forEach(button => button.addEventListener("click", () => {
  filters.forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  activeFilter = button.dataset.filter;
  filterGames();
}));
searchInput.addEventListener("input", filterGames);

const gameModal = document.getElementById("gameModal");
const uploadModal = document.getElementById("uploadModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalEmoji = document.getElementById("modalEmoji");
const emojiByType = { "2d": "🕹️", "3d": "🌌" };

cards.forEach(card => {
  card.querySelector("[data-play]").addEventListener("click", () => {
    modalTitle.textContent = card.dataset.title;
    modalDescription.textContent = card.dataset.description;
    modalEmoji.textContent = card.querySelector(".cover-art").textContent;
    gameModal.hidden = false;
  });
});
document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => {
  gameModal.hidden = true;
  uploadModal.hidden = true;
}));
[gameModal, uploadModal].forEach(modal => modal.addEventListener("click", event => {
  if (event.target === modal) modal.hidden = true;
}));
document.addEventListener("keydown", event => {
  if (event.key === "Escape") { gameModal.hidden = true; uploadModal.hidden = true; }
});

const toast = document.getElementById("toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
document.getElementById("uploadBtn").addEventListener("click", () => {
  uploadModal.hidden = false;
  document.getElementById("uploadMessage").textContent = "";
});
document.getElementById("loginBtn").addEventListener("click", () => showToast("Accounts will be added in Stage 2."));
document.getElementById("signupBtn").addEventListener("click", () => showToast("Sign up will be available in Stage 2."));
document.getElementById("menuBtn").addEventListener("click", () => document.querySelector(".main-nav").classList.toggle("open"));
document.querySelectorAll(".main-nav a").forEach(link => link.addEventListener("click", () => document.querySelector(".main-nav").classList.remove("open")));
document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("light");
  showToast(document.body.classList.contains("light") ? "Light theme enabled" : "Dark theme enabled");
});

const gameFile = document.getElementById("gameFile");
gameFile.addEventListener("change", () => {
  const file = gameFile.files[0];
  document.getElementById("fileNote").textContent = file ? `${file.name} • ${(file.size / 1024 / 1024).toFixed(2)} MB` : "No file selected.";
});
document.getElementById("demoUpload").addEventListener("click", () => {
  const name = document.getElementById("gameName").value.trim();
  const file = gameFile.files[0];
  const message = document.getElementById("uploadMessage");
  if (!name) { message.textContent = "Please enter a game name."; return; }
  if (!file) { message.textContent = "Please choose a ZIP file to preview the upload form."; return; }
  if (!file.name.toLowerCase().endsWith(".zip")) { message.textContent = "Please choose a .zip file."; return; }
  message.textContent = `Looks good! "${name}" is selected locally. Public publishing is not connected yet.`;
});
document.getElementById("year").textContent = new Date().getFullYear();
