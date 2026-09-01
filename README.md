# Ziptrrip Tech Challenge — Multi-Page Todo Application

A full-stack Todo application built for the **Ziptrrip Developer Assignment**. 

The solution follows the requirement of building a **Multi-Page Application (MPA)** in React rather than a standard Single Page Application (SPA), paired with a Node.js + Express backend persisting data to a local JSON file. It features an interactive, colorful **Sticky Notes Board** design.

---

## 📌 Requirements & How They Are Met

| Requirement | Implementation Details |
|---|---|
| **React Frontend (Multi-Page)** | Built with React + Vite configured with multiple HTML entry points (`index.html` and `todo.html`). No client-side SPA routing (`react-router`) is used. |
| **Page 1: Todos List** | `index.html` loads `src/pages/list/main.jsx`. Renders an interactive colorful sticky notes board with task creation, completion toggles, delete action, search, filters by status/priority, sorting, and tag pills. |
| **Page 2: Single Todo Detail** | `todo.html` loads `src/pages/detail/main.jsx`. Reads the task ID from the URL query parameter (`?id=todo-001`), displays full metadata/timestamps, and allows in-place editing. |
| **Node.js + Express Backend** | Express.js REST API in `backend/` with auto-increment sequential ID generation (`todo-001`, `todo-002`, `todo-003`), CRUD routes, input validation, and error handling. |
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

- Clicking any sticky note card or its **`📌 todo-XXX`** badge / **`Open Note →`** button navigates directly to `todo.html?id=todo-001`.
- The detail page extracts the ID on load using `new URLSearchParams(window.location.search).get('id')` and fetches that specific item from `GET /api/todos/:id`.
- Typing or sharing the URL directly in the browser address bar (e.g. `http://localhost:5173/todo.html?id=todo-003`) immediately loads that task.
- Clicking "Back to Board" performs a true browser navigation back to `index.html`.

---

## 🎨 Features & UI Experience

### 1. Interactive Sticky Notes Board (`index.html`)
- **Colorful Sticky Notes**: Notes are automatically assigned distinct vibrant paper colors (yellow, pink, blue, green, purple, orange) with frosted tape accents on top.
- **Auto-Increment Sequential IDs**: Tasks are automatically numbered sequentially (`todo-001`, `todo-002`, `todo-003`, etc.).
- **Add Note Notepad**: Sidebar notepad panel for quickly pinning tasks with title (required), notes/description, priority (`low`, `medium`, `high`), due date, and tags.
- **Task Actions**: Checkbox toggle for completion with strike-through styling, quick delete confirmation, and direct detail navigation.
- **Search & Filter**: Real-time search across titles, descriptions, and tags; filter by status (`All`, `Active`, `Completed`) and priority.
- **Sorting**: Sort by newest, oldest, due date, or priority.
- **Memo Status Counters**: Live visual memo counters (Total Notes, Active Tasks, Completed Tasks) and visual warning badges for overdue tasks.

### 2. Single Sticky Note Detail Page (`todo.html?id=<id>`)
- **Query Parameter Handling**: Reads `?id=<id>` from URL and fetches task details.
- **Matching Sticky Note Theme**: Styled as an enlarged sticky note matching the task's color theme.
- **Detailed Metadata**: Displays ID, creation date, last updated date, priority badges, tags, and status.
- **In-place Editing**: Update title, description, priority, due date, and tags directly with one click.
- **Delete & Navigate**: Delete the task directly from the detail view and automatically return to the board.
- **Edge Case Handling**: User-friendly screens for missing IDs or non-existent/invalid IDs.

### 3. Backend API (`backend/`)
- Express REST API running on port `4000`.
- Full CRUD support: `GET /api/todos`, `GET /api/todos/:id`, `POST /api/todos`, `PUT /api/todos/:id`, `PATCH /api/todos/:id`, `DELETE /api/todos/:id`.
- Sequential ID generator producing clean `todo-XXX` identifiers.
- Server-side support for query filtering (`q`, `status`, `priority`, `sort`).
- Input validation (required title length, date format, allowed priority values).
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
│   │   ├── controllers/    # Controller handling CRUD logic & auto-increment IDs
│   │   ├── routes/         # Express route definitions
│   │   ├── utils/          # Request validation helper
│   │   ├── server.js       # App entry point & middleware
│   │   └── store.js        # File I/O operations (read/write JSON)
│   └── package.json
└── frontend/
    ├── index.html          # Page 1: Sticky notes board entry point
    ├── todo.html           # Page 2: Single sticky note detail entry point
    ├── vite.config.js      # Multi-page build configuration
    ├── src/
    │   ├── api.js          # API client for backend communication
    │   ├── styles.css      # Sticky notes design system
    │   ├── components/     # Shared components (Toast notification, etc.)
    │   └── pages/
    │       ├── list/       # Sticky notes board component
    │       └── detail/     # Sticky note detail component
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
| `GET` | `/api/todos/:id` | Get details of a single todo (e.g. `/api/todos/todo-001`) |
| `POST` | `/api/todos` | Create a new todo (auto-assigns `todo-XXX`) |
| `PATCH` | `/api/todos/:id` | Partial update (toggle completion, update specific fields) |
| `PUT` | `/api/todos/:id` | Replace all editable fields of a todo |
| `DELETE` | `/api/todos/:id` | Delete a todo |

For full request/response schemas and examples, see [`API.md`](./API.md).
