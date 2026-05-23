// ============================================================
//  Gallery Backend API — Node.js + Express (No DB needed)
//  Endpoint: GET /gallery
//  Endpoint: GET /gallery?category=web
//  Endpoint: GET /gallery?search=keyword
// ============================================================

const express = require("express");
const cors = require("cors");
const path = require("path");
const galleryData = require("./data/gallery.json");

const app = express();
const PORT = 3000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// ── Routes ───────────────────────────────────────────────────

// GET /gallery  →  all items or filtered by category & search
app.get("/gallery", (req, res) => {
  let items = [...galleryData.items];

  // Filter by category (case-insensitive)
  if (req.query.category && req.query.category !== "all") {
    items = items.filter(
      (item) =>
        item.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }

  // Search by title or description
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }

  // Simulate slight delay like a real DB call
  setTimeout(() => {
    res.json({
      success: true,
      total: items.length,
      items,
    });
  }, 200);
});

// GET /gallery/:id  →  single item detail
app.get("/gallery/:id", (req, res) => {
  const item = galleryData.items.find((i) => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, item });
});

// GET /categories  →  unique categories list
app.get("/categories", (req, res) => {
  const cats = [...new Set(galleryData.items.map((i) => i.category))];
  res.json({ success: true, categories: cats });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Gallery API running at http://localhost:${PORT}`);
  console.log(`   Frontend: http://localhost:${PORT}/index.html`);
  console.log(`   API:      http://localhost:${PORT}/gallery\n`);
});