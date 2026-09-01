# Todo REST API — Node.js + Express

This backend implements the todo resource as a REST API using **Node.js + Express.js**.

## REST endpoints

```text
GET    /api/todos
GET    /api/todos/:id
POST   /api/todos
PUT    /api/todos/:id
PATCH  /api/todos/:id
DELETE /api/todos/:id
GET    /api/health
```

The React frontend communicates with these endpoints using HTTP requests and JSON. The backend persists todo data in `data/todos.json`.

## Run

```bash
npm install
npm run dev
```

The server listens on `http://localhost:4000` by default.

## Architecture

```text
src/
├── server.js                    # Express app + middleware + route mounting
├── routes/todoRoutes.js         # REST endpoint definitions
├── controllers/todoController.js # CRUD business logic
├── utils/todoValidation.js      # Request validation + normalization
└── store.js                     # JSON-file persistence
```
