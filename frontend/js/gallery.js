/* ═══════════════════════════════════════════════════════════
   gallery.js — Card rendering, lazy loading & masonry layout
   ═══════════════════════════════════════════════════════════ */

const Gallery = (() => {

  // ── State ─────────────────────────────────────────────────
  let allItems        = [];    // full fetched dataset
  let filteredItems   = [];    // after filter/search
  let visibleCount    = 0;     // how many cards rendered so far
  const PAGE_SIZE     = 9;     // items per "load more" batch
  let isMasonry       = false;
  let lazyObserver    = null;

  // ── DOM refs ──────────────────────────────────────────────
  const grid          = document.getElementById("galleryGrid");
  const emptyState    = document.getElementById("emptyState");
  const resultInfo    = document.getElementById("resultInfo");
  const totalCount    = document.getElementById("totalCount");
  const loadMoreBtn   = document.getElementById("loadMoreBtn");
  const loadMoreWrap  = document.getElementById("loadMoreWrap");

  // ── Category badge class ──────────────────────────────────
  function badgeClass(category) {
    const map = { web: "badge-web", ai: "badge-ai", mobile: "badge-mobile", python: "badge-python" };
    return map[category.toLowerCase()] || "badge-web";
  }

  // ── Format date ───────────────────────────────────────────
  function formatDate(str) {
    const d = new Date(str);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }

  // ── Build single card HTML ────────────────────────────────
  function buildCard(item, index) {
    const delay = (index % PAGE_SIZE) * 60; // stagger per batch
    return `
      <article
        class="gallery-card"
        data-id="${item.id}"
        style="animation-delay:${delay}ms"
        role="button"
        tabindex="0"
        aria-label="Open ${item.title}"
      >
        <div class="card-img-wrap">
          <!-- Lazy load: src set by IntersectionObserver -->
          <img
            class="card-img lazy"
            data-src="${item.image_url}"
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3C/svg%3E"
            alt="${item.title}"
            loading="lazy"
          />
          <span class="card-badge ${badgeClass(item.category)}">${item.category}</span>
          <div class="card-overlay">
            <span class="overlay-hint">View Project</span>
          </div>
        </div>
        <div class="card-body">
          <h3 class="card-title">${item.title}</h3>
          <p  class="card-desc">${item.description}</p>
          <div class="card-footer">
            <span class="card-date">${formatDate(item.created_at)}</span>
            <span class="card-arrow">→</span>
          </div>
        </div>
      </article>
    `;
  }

  // ── Lazy loading via IntersectionObserver ─────────────────
  function initLazyLoad() {
    if (lazyObserver) lazyObserver.disconnect();

    lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          lazyObserver.unobserve(img);
        }
      });
    }, { rootMargin: "200px 0px" });

    grid.querySelectorAll("img.lazy").forEach(img => lazyObserver.observe(img));
  }

  // ── Masonry height correction ─────────────────────────────
  function applyMasonrySpans() {
    if (!isMasonry) return;
    const rowHeight = 10;
    grid.querySelectorAll(".gallery-card").forEach(card => {
      const content = card.getBoundingClientRect().height;
      const span    = Math.ceil(content / rowHeight) + 1;
      card.style.gridRowEnd = `span ${span}`;
    });
  }

  // ── Render a batch of cards ───────────────────────────────
  function renderBatch() {
    const batch   = filteredItems.slice(visibleCount, visibleCount + PAGE_SIZE);
    const startIdx = visibleCount;

    const html = batch.map((item, i) => buildCard(item, startIdx + i)).join("");
    grid.insertAdjacentHTML("beforeend", html);
    visibleCount += batch.length;

    // Attach click/keyboard listeners to newly added cards
    const cards = grid.querySelectorAll(".gallery-card");
    cards.forEach(card => {
      if (!card._bound) {
        card._bound = true;
        card.addEventListener("click", () => Modal.open(Number(card.dataset.id)));
        card.addEventListener("keydown", e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            Modal.open(Number(card.dataset.id));
          }
        });
      }
    });

    initLazyLoad();
    setTimeout(applyMasonrySpans, 100);

    // Show/hide load more button
    if (visibleCount >= filteredItems.length) {
      loadMoreBtn.classList.add("hidden");
    } else {
      loadMoreBtn.classList.remove("hidden");
    }
  }

  // ── Show skeleton placeholders ────────────────────────────
  function showSkeletons() {
    grid.innerHTML = Array(6).fill('<div class="skeleton-card" aria-hidden="true"></div>').join("");
  }

  // ── Full re-render after filter/search ────────────────────
  function render() {
    grid.innerHTML = "";
    visibleCount   = 0;
    emptyState.classList.add("hidden");

    if (filteredItems.length === 0) {
      emptyState.classList.remove("hidden");
      loadMoreBtn.classList.add("hidden");
      resultInfo.textContent = "No results found.";
      return;
    }

    resultInfo.textContent = `Showing ${Math.min(PAGE_SIZE, filteredItems.length)} of ${filteredItems.length} project${filteredItems.length !== 1 ? "s" : ""}`;
    renderBatch();
  }

  // ── Filter + search ───────────────────────────────────────
  function filter(category, searchQuery) {
    filteredItems = allItems.filter(item => {
      const matchCat    = category === "all" || item.category.toLowerCase() === category.toLowerCase();
      const matchSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });

    render();

    if (filteredItems.length > 0) {
      resultInfo.textContent = `${filteredItems.length} project${filteredItems.length !== 1 ? "s" : ""} found`;
    }
  }

  // ── Load data from API ────────────────────────────────────
  async function load(category = "all", search = "") {
    showSkeletons();
    try {
      const data = await API.getGallery(category, search);
      allItems      = data.items;
      filteredItems = [...allItems];
      totalCount.textContent = data.total;
      render();
    } catch (err) {
      grid.innerHTML = `<p style="color:var(--text-muted);padding:20px;grid-column:1/-1">
        ⚠ Could not connect to API. Make sure the backend server is running.<br>
        <small style="color:var(--text-dim)">${err.message}</small>
      </p>`;
      loadMoreBtn.classList.add("hidden");
    }
  }

  // ── Toggle masonry ────────────────────────────────────────
  function setMasonry(on) {
    isMasonry = on;
    grid.classList.toggle("masonry-layout", on);
    if (on) {
      setTimeout(applyMasonrySpans, 80);
    } else {
      grid.querySelectorAll(".gallery-card").forEach(c => c.style.gridRowEnd = "");
    }
  }

  // ── Get all items (for modal navigation) ─────────────────
  function getAll()      { return allItems; }
  function getFiltered() { return filteredItems; }

  return { load, filter, renderBatch, showSkeletons, setMasonry, getAll, getFiltered };

})();