# TaskFlow — React Multi-Page Todo Application

This repository is an implementation of the Ziptrrip developer assignment. It deliberately uses React as a **multi-page application (MPA), not a client-side SPA**.

## Requirement mapping

| Assignment requirement | Implementation |
|---|---|
| Basic React application | React 19 + Vite frontend |
| Multiple page instead of SPA | Two separate HTML entry points: `index.html` and `todo.html`; no React Router |
| Todos list page | `index.html` renders search/filter/sort, create, complete and delete functionality |
| Single todo page | `todo.html?id=<id>` reads the `id` query parameter and loads that todo |
| Node.js + Express.js | Express REST API in `backend/src/server.js` |
| CRUD APIs | GET list/detail, POST, PUT/PATCH, DELETE |
| File or database persistence | JSON file persistence in `backend/data/todos.json` |
| Document functionality in `.md` | `README.md`, `FEATURES.md`, and `API.md` |

## Why this is genuinely multi-page

The list and detail screens are not React Router routes. Vite builds two independent documents:

- `/index.html` loads `src/pages/list/main.jsx`
- `/todo.html?id=...` loads `src/pages/detail/main.jsx`

Clicking a todo changes the browser document from `index.html` to `todo.html`, and the detail page extracts the todo id using `URLSearchParams`.

## Project structure

```text
todolist/
├── README.md
├── FEATURES.md
├── API.md
├── frontend/
│   ├── index.html
│   ├── todo.html
│   ├── vite.config.js
│   └── src/
│       ├── api.js
│       ├── styles.css
│       ├── components/
│       └── pages/
│           ├── list/
│           └── detail/
└── backend/
    ├── data/todos.json
    └── src/
        ├── server.js
        └── store.js
```

## Run locally

Use two terminals.

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Backend: `http://localhost:4000`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173/index.html`

If the backend runs on another URL, copy `.env.example` to `.env` and update `VITE_API_BASE`.

## Production build

```bash
cd frontend
npm run build
```

Vite outputs both `index.html` and `todo.html` in `dist/`.

## Suggested Git submission

```bash
git init
git add .
git commit -m "Build React multi-page todo application"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```
