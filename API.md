# Todo REST API Documentation

Base URL: `http://localhost:4000/api`

---

## Todo Object Model

```json
{
  "id": "todo-001",
  "title": "Practice React interview questions",
  "description": "Revise hooks, component lifecycle, props/state, and rendering behavior.",
  "completed": false,
  "priority": "medium",
  "dueDate": "2026-09-03",
  "tags": ["react", "interview"],
  "createdAt": "2026-08-31T15:30:00.000Z",
  "updatedAt": "2026-09-01T17:53:55.286Z"
}
```

---

## Endpoints

### 1. `GET /api/health`
Checks API server status.

**Response `(200 OK)`**:
```json
{
  "status": "ok",
  "timestamp": "2026-09-02T01:00:00.000Z"
}
```

---

### 2. `GET /api/todos`
Returns list of todos. Supports query parameters:

| Parameter | Type | Allowed Values | Description |
|---|---|---|---|
| `q` | string | any text | Search across `title`, `description`, and `tags` |
| `status` | string | `all`, `active`, `completed` | Filter by completion state |
| `priority` | string | `all`, `low`, `medium`, `high` | Filter by task priority |
| `sort` | string | `created-desc`, `created-asc`, `due-asc`, `priority-desc` | Sort order |

**Response `(200 OK)`**:
```json
{
  "items": [
    {
      "id": "todo-001",
      "title": "Practice React interview questions",
      "description": "Revise hooks, component lifecycle, props/state, and rendering behavior.",
      "completed": false,
      "priority": "medium",
      "dueDate": "2026-09-03",
      "tags": ["react", "interview"],
      "createdAt": "2026-08-31T15:30:00.000Z",
      "updatedAt": "2026-09-01T17:53:55.286Z"
    }
  ],
  "total": 1
}
```

---

### 3. `GET /api/todos/:id`
Fetch a single todo by its ID (e.g. `todo-001`).

- **Success `(200 OK)`**: Returns the todo JSON object.
- **Not Found `(404 Not Found)`**: `{"error": "Todo not found"}`.

---

### 4. `POST /api/todos`
Creates a new todo and automatically assigns the next sequential ID (`todo-XXX`).

**Request Body**:
```json
{
  "title": "Build Multi-Page React Todo app",
  "description": "Ensure distinct HTML entry points and query-parameter based detail view.",
  "priority": "high",
  "dueDate": "2026-09-03",
  "tags": ["react", "assignment"]
}
```

**Response `(201 Created)`**: Returns the created todo object with auto-assigned `id`, `createdAt`, and `updatedAt`.

---

### 5. `PATCH /api/todos/:id`
Partially updates specific fields of a todo (e.g., toggling completion status).

**Request Body**:
```json
{
  "completed": true
}
```

**Response `(200 OK)`**: Returns the updated todo object.

---

### 6. `PUT /api/todos/:id`
Replaces all editable fields of a todo.

---

### 7. `DELETE /api/todos/:id`
Deletes the todo from the system.

**Response `(200 OK)`**:
```json
{
  "message": "Todo deleted",
  "todo": { "id": "todo-001", "title": "..." }
}
```

---

## Validation Rules

- `title` is **required**, non-empty string, max 120 characters.
- `priority` must be one of `low`, `medium`, or `high` (defaults to `medium`).
- `completed` must be boolean when provided.
- `dueDate` must follow `YYYY-MM-DD` format if provided.
- `tags` must be an array of strings (duplicates and whitespace-only tags are removed automatically).
