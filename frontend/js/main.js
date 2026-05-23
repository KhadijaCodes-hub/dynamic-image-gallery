/* ═══════════════════════════════════════════════════════════
   main.js — App entry point
   Wires together Gallery, Modal, filters, search, infinite
   scroll, layout toggle, and back-to-top button.
   ═══════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {

  // ── State ─────────────────────────────────────────────────
  let activeCategory = "all";
  let searchQuery    = "";
  let searchTimer    = null;

  // ── DOM refs ──────────────────────────────────────────────
  const filterBtns  = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("searchInput");
  const searchClear = document.getElementById("searchClear");
  const resetBtn    = document.getElementById("resetBtn");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const gridBtn     = document.getElementById("gridBtn");
  const masonryBtn  = document.getElementById("masonryBtn");
  const backToTop   = document.getElementById("backToTop");

  // ── Initial data load ─────────────────────────────────────
  Gallery.load();

  // ── Category filter clicks ────────────────────────────────
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.category;
      Gallery.filter(activeCategory, searchQuery);
    });
  });

  // ── Search input (debounced 350ms) ────────────────────────
  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value.trim();
    searchClear.classList.toggle("visible", searchQuery.length > 0);

    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      Gallery.filter(activeCategory, searchQuery);
    }, 350);
  });

  // Search clear button
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    searchClear.classList.remove("visible");
    Gallery.filter(activeCategory, "");
    searchInput.focus();
  });

  // ── Reset all filters ─────────────────────────────────────
  function resetAll() {
    // Reset category
    filterBtns.forEach(b => b.classList.remove("active"));
    document.querySelector('[data-category="all"]').classList.add("active");
    activeCategory = "all";

    // Reset search
    searchInput.value = "";
    searchQuery = "";
    searchClear.classList.remove("visible");

    Gallery.filter("all", "");
  }

  resetBtn.addEventListener("click", resetAll);

  // ── Load More button ──────────────────────────────────────
  loadMoreBtn.addEventListener("click", () => {
    Gallery.renderBatch();
  });

  // ── Infinite Scroll via IntersectionObserver ──────────────
  // Triggers "load more" automatically when footer is near
  const sentinel = document.createElement("div");
  sentinel.id    = "infiniteSentinel";
  sentinel.style.height = "1px";
  document.querySelector(".load-more-wrap").before(sentinel);

  const infiniteObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !loadMoreBtn.classList.contains("hidden")) {
      Gallery.renderBatch();
    }
  }, { rootMargin: "300px" });

  infiniteObserver.observe(sentinel);

  // ── Layout toggle ─────────────────────────────────────────
  gridBtn.addEventListener("click", () => {
    gridBtn.classList.add("active");
    masonryBtn.classList.remove("active");
    Gallery.setMasonry(false);
  });

  masonryBtn.addEventListener("click", () => {
    masonryBtn.classList.add("active");
    gridBtn.classList.remove("active");
    Gallery.setMasonry(true);
  });

  // ── Back to Top ───────────────────────────────────────────
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 400);
  }, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ── Keyboard shortcut: "/" focuses search ─────────────────
  document.addEventListener("keydown", e => {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });

  // ── Resize: re-apply masonry spans ────────────────────────
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      Gallery.setMasonry(masonryBtn.classList.contains("active"));
    }, 150);
  }, { passive: true });

});