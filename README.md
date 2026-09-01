# Ziptrrip Tech Challenge — Multi-Page Todo Application

A full-stack Todo application built for the **Ziptrrip Developer Assignment**. 

The solution follows the requirement of building a **Multi-Page Application (MPA)** in React rather than a standard Single Page Application (SPA), paired with a Node.js + Express backend persisting data to a JSON file.

---

## 📌 Requirements & How They Are Met

| Requirement | Implementation Details |
|---|---|
| **React Frontend (Multi-Page)** | Built with React + Vite configured with multiple HTML entry points (`index.html` and `todo.html`). No client-side SPA routing (`react-router`) is used. |
| **Page 1: Todos List** | `index.html` loads `src/pages/list/main.jsx`. Supports creating tasks, status toggles, deletion, search, filtering by status/priority, sorting, and tag filtering. |
| **Page 2: Single Todo Detail** | `todo.html` loads `src/pages/detail/main.jsx`. Reads the task ID from the URL query parameter (`?id=<todo_id>`), displays full details/timestamps, and allows in-place editing. |
| **Node.js + Express Backend** | Express.js REST API in `backend/` with complete CRUD routes, request validation, and error handling. |
| **Data Persistence** | Stored locally in `backend/data/todos.json` with atomic file-write handling to avoid file corruption. |
| **Documentation** | Documented across `.md` files (`README.md`, `FEATURES.md`, and `API.md`). |

---

## 🏗️ Architecture & Multi-Page Setup

Instead of client-side routing where a single HTML file handles everything, this project uses Vite's multi-page build configuration in `frontend/vite.config.js`:

```javascript
build: {
  rollupOptions: {
    input: {
      main: resolve(__dirname, 'index.html'),
      todo: resolve(__dirname, 'todo.html'),
    }
  }
}
```

- Navigating from a todo card opens `todo.html?id=<uuid>`.
- The detail page extracts the ID on load using `new URLSearchParams(window.location.search).get('id')` and fetches that specific item from `GET /api/todos/:id`.
- Clicking "Back to List" performs a true browser navigation back to `index.html`.

---

## 🚀 Features

### 1. Todos List Page (`index.html`)
- **Add Tasks**: Title (required), description, priority (`low`, `medium`, `high`), due date, and comma-separated tags.
- **Task Actions**: Quick toggle for completion, direct delete with confirmation, and link to detail page.
- **Search & Filter**: Real-time search across titles, descriptions, and tags; filter by status (`All`, `Active`, `Completed`) and priority.
- **Sorting**: Sort by newest, oldest, due date, or priority.
- **Status Indicators**: Live summary counters (Total, Active, Completed) and visual highlight for overdue tasks.
- **UI States**: Responsive layout, loading skeletons, empty states, and feedback toast notifications.

### 2. Single Todo Page (`todo.html?id=<id>`)
- **Query Parameter Handling**: Reads `?id=<id>` from URL and fetches task details.
- **Detailed Metadata**: Displays ID, creation date, last updated date, priority badges, tags, and status.
- **In-place Editing**: Update title, description, priority, due date, and tags directly.
- **Delete & Navigate**: Delete the task directly from the detail view and automatically return to the list.
- **Edge Case Handling**: User-friendly screens for missing IDs or non-existent/invalid IDs.

### 3. Backend API (`backend/`)
- Express REST API running on port `4000`.
- Full CRUD support: `GET /api/todos`, `GET /api/todos/:id`, `POST /api/todos`, `PUT /api/todos/:id`, `PATCH /api/todos/:id`, `DELETE /api/todos/:id`.
- Server-side support for query filtering (`q`, `status`, `priority`, `sort`).
- Input validation (e.g. required title, date format, allowed priority values).
- Data persistence to `backend/data/todos.json` with atomic file writes.

---

## 🛠️ Project Structure

```text
todolist/
├── README.md               # Main project overview & setup guide
├── FEATURES.md             # Detailed feature breakdown
├── API.md                  # REST API endpoints documentation
├── backend/
│   ├── data/
│   │   └── todos.json      # JSON file database
│   ├── src/
│   │   ├── controllers/    # Controller handling CRUD logic
│   │   ├── routes/         # Express route definitions
│   │   ├── utils/          # Request validation helper
│   │   ├── server.js       # App entry point & middleware
│   │   └── store.js        # File I/O operations (read/write JSON)
│   └── package.json
└── frontend/
    ├── index.html          # Page 1: Todo list entry point
    ├── todo.html           # Page 2: Todo detail entry point
    ├── vite.config.js      # Multi-page build configuration
    ├── src/
    │   ├── api.js          # API client for backend communication
    │   ├── styles.css      # CSS styles
    │   ├── components/     # Shared components (Toast notification, etc.)
    │   └── pages/
    │       ├── list/       # List page React component
    │       └── detail/     # Detail page React component
    └── package.json
```

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 1. Run the Backend

Open a terminal and run:

```bash
cd backend
npm install
npm run dev
```

The backend server will start on **`http://localhost:4000`**.

### 2. Run the Frontend

Open a second terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at **`http://localhost:5173/index.html`**.

*(Optional: If running the backend on a different port/host, configure `VITE_API_BASE` in a `frontend/.env` file).*

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check endpoint |
| `GET` | `/api/todos` | List all todos (supports `?q=`, `?status=`, `?priority=`, `?sort=`) |
| `GET` | `/api/todos/:id` | Get details of a single todo |
| `POST` | `/api/todos` | Create a new todo |
| `PATCH` | `/api/todos/:id` | Partial update (toggle completion, update specific fields) |
| `PUT` | `/api/todos/:id` | Replace all editable fields of a todo |
| `DELETE` | `/api/todos/:id` | Delete a todo |

For full request/response schemas and examples, see [`API.md`](./API.md).
