# Todo Frontend

React + Vite **multi-page application** with two independent HTML entry points:

- `index.html` → todo list page
- `todo.html?id=<todo-id>` → single-todo page

Navigation to a todo performs a real document navigation to `todo.html`; React Router is intentionally not used.

## Run

```bash
npm install
npm run dev
```

Default URL: `http://localhost:5173/index.html`
