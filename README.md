# PixelVault — Dynamic Image Gallery
## Backend-Driven Gallery System (Node.js + Express + JSON)

---

## 📁 Project Structure

```
gallery-project/
├── backend/
│   ├── server.js           ← Express API server
│   ├── package.json        ← Node dependencies
│   └── data/
│       └── gallery.json    ← JSON "database" (20 items)
│
└── frontend/
    ├── index.html          ← Main page
    ├── css/
    │   ├── reset.css       ← CSS reset
    │   ├── style.css       ← Main styles
    │   └── modal.css       ← Modal/lightbox styles
    └── js/
        ├── api.js          ← API communication layer
        ├── gallery.js      ← Card rendering + lazy load + masonry
        ├── modal.js        ← Lightbox controller
        └── main.js         ← App entry point (event wiring)
```

---

## ⚙️ Setup & Run

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Start the backend server
```bash
npm start
```
Server runs at: **http://localhost:3000**

### 3. Open the gallery
Visit: **http://localhost:3000/index.html**

---

## 🔗 API Endpoints

| Method | Endpoint                        | Description                    |
|--------|---------------------------------|--------------------------------|
| GET    | `/gallery`                      | Fetch all gallery items        |
| GET    | `/gallery?category=Web`         | Filter by category             |
| GET    | `/gallery?search=python`        | Search by title/description    |
| GET    | `/gallery?category=AI&search=x` | Filter + search combined       |
| GET    | `/gallery/:id`                  | Single item by ID              |
| GET    | `/categories`                   | List all categories            |

---

## ✅ Features Implemented

### Core Requirements
- [x] JSON "database" with id, title, image_url, description, category, created_at
- [x] GET /gallery API endpoint
- [x] GET /gallery?category= filtering
- [x] Dynamic frontend with Fetch API
- [x] Responsive grid layout
- [x] Image + Title + Short description per card
- [x] Modal/Lightbox with enlarged image, title, description
- [x] Category filter buttons (All / Web / AI / Mobile / Python)

### UI/UX
- [x] Hover zoom-in effect on images
- [x] Hover overlay text ("View Project")
- [x] Skeleton loading animation during API fetch
- [x] Fully responsive (mobile, tablet, desktop)
- [x] Dark luxury theme with neon accents

### Advanced Features
- [x] Lazy loading images (IntersectionObserver)
- [x] Infinite scroll (auto load-more)
- [x] Search by title/description/tags (debounced)
- [x] Masonry layout toggle (Pinterest style)
- [x] Keyboard navigation in modal (← → Esc)
- [x] "/" keyboard shortcut to focus search
- [x] Back-to-top button
- [x] Tags display in modal
- [x] Staggered card animations

---

## 🛠 Technologies Used

- **Backend**: Node.js + Express.js
- **Database**: JSON file (gallery.json) — no DB setup needed
- **Frontend**: HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript
- **API**: REST (Fetch API)
- **Fonts**: Syne + DM Sans (Google Fonts)
