/* ═══════════════════════════════════════════════════════════
   modal.js — Lightbox modal controller
   Features: open/close animation, keyboard nav, Esc to close,
             arrow keys to navigate between projects
   ═══════════════════════════════════════════════════════════ */

const Modal = (() => {

  // ── DOM refs ──────────────────────────────────────────────
  const overlay    = document.getElementById("modalOverlay");
  const closeBtn   = document.getElementById("modalClose");
  const modalImg   = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc  = document.getElementById("modalDesc");
  const modalCat   = document.getElementById("modalCategory");
  const modalDate  = document.getElementById("modalDate");
  const modalTags  = document.getElementById("modalTags");

  let currentId  = null;

  // ── Badge color per category ──────────────────────────────
  const catColors = {
    web:    { bg: "rgba(6,182,212,0.2)",   color: "#06b6d4", border: "rgba(6,182,212,0.4)" },
    ai:     { bg: "rgba(124,58,237,0.2)",  color: "#7c3aed", border: "rgba(124,58,237,0.4)" },
    mobile: { bg: "rgba(16,185,129,0.2)",  color: "#10b981", border: "rgba(16,185,129,0.4)" },
    python: { bg: "rgba(245,158,11,0.2)",  color: "#f59e0b", border: "rgba(245,158,11,0.4)" },
  };

  function formatDate(str) {
    return new Date(str).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }

  // ── Open modal with item data ─────────────────────────────
  function open(id) {
    const items = Gallery.getFiltered().length ? Gallery.getFiltered() : Gallery.getAll();
    const item  = items.find(i => i.id === id);
    if (!item) return;

    currentId = id;

    // Populate content
    modalImg.src         = item.image_url;
    modalImg.alt         = item.title;
    modalTitle.textContent = item.title;
    modalDesc.textContent  = item.description;
    modalDate.textContent  = formatDate(item.created_at);

    // Category badge with color
    modalCat.textContent = item.category;
    const cc = catColors[item.category.toLowerCase()] || catColors.ai;
    modalCat.style.background  = cc.bg;
    modalCat.style.color       = cc.color;
    modalCat.style.borderColor = cc.border;

    // Tags
    modalTags.innerHTML = (item.tags || [])
      .map(t => `<span class="tag-pill">${t}</span>`)
      .join("");

    // Image overlay color
    const imgOverlay = overlay.querySelector(".modal-img-overlay");
    if (imgOverlay) imgOverlay.style.background = `linear-gradient(135deg, ${cc.bg.replace("0.2","0.4")} 0%, transparent 60%)`;

    // Show
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  // ── Close modal ───────────────────────────────────────────
  function close() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    currentId = null;
  }

  // ── Navigate prev / next ──────────────────────────────────
  function navigate(dir) {
    const items = Gallery.getFiltered().length ? Gallery.getFiltered() : Gallery.getAll();
    const idx   = items.findIndex(i => i.id === currentId);
    if (idx === -1) return;
    const next = (idx + dir + items.length) % items.length;
    open(items[next].id);
  }

  // ── Event listeners ───────────────────────────────────────

  // Close button
  closeBtn.addEventListener("click", close);

  // Click overlay backdrop to close
  overlay.addEventListener("click", e => {
    if (e.target === overlay) close();
  });

  // Keyboard navigation
  document.addEventListener("keydown", e => {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape")      close();
    if (e.key === "ArrowRight")  navigate(+1);
    if (e.key === "ArrowLeft")   navigate(-1);
  });

  return { open, close, navigate };

})();