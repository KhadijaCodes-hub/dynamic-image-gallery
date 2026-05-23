/* ═══════════════════════════════════════════════════════════
   api.js — Backend communication layer
   All fetch calls to the Node.js/Express API live here.
   BASE_URL: change this if your server runs on a different port.
   ═══════════════════════════════════════════════════════════ */

const API = (() => {

  // ── Config ────────────────────────────────────────────────
  const BASE_URL = "http://localhost:3000";

  // Reusable fetch wrapper with error handling
  async function request(endpoint) {
    const res = await fetch(`${BASE_URL}${endpoint}`);
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    return res.json();
  }

  // ── Public Methods ────────────────────────────────────────

  /**
   * Fetch all gallery items (optionally filter by category and/or search)
   * @param {string} category  - e.g. "web" | "ai" | "all"
   * @param {string} search    - keyword string
   * @returns {Promise<{success, total, items}>}
   */
  async function getGallery(category = "all", search = "") {
    const params = new URLSearchParams();
    if (category && category !== "all") params.set("category", category);
    if (search)   params.set("search", search);
    const qs = params.toString() ? `?${params.toString()}` : "";
    return request(`/gallery${qs}`);
  }

  /**
   * Fetch a single gallery item by ID
   * @param {number} id
   * @returns {Promise<{success, item}>}
   */
  async function getGalleryItem(id) {
    return request(`/gallery/${id}`);
  }

  /**
   * Fetch all available categories
   * @returns {Promise<{success, categories}>}
   */
  async function getCategories() {
    return request("/categories");
  }

  // Expose public API
  return { getGallery, getGalleryItem, getCategories };

})();