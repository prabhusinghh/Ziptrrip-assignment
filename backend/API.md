# Todo REST API Documentation

Base URL: `http://localhost:4000/api`

The backend is a Node.js + Express.js REST API. All request and response bodies use JSON.

## Resources

### `GET /todos`

Returns a collection of todos.

Optional query parameters:

- `q` — searches title, description, and tags
- `status` — `all`, `active`, or `completed`
- `priority` — `all`, `low`, `medium`, or `high`
- `sort` — `created-desc`, `created-asc`, `due-asc`, or `priority-desc`

Example:

```text
GET /api/todos?status=active&priority=high&sort=due-asc
```

### `GET /todos/:id`

Returns one todo by its ID.

Example:

```text
GET /api/todos/550e8400-e29b-41d4-a716-446655440000
```

### `POST /todos`

Creates a todo.

Example request body:

```json
{
  "title": "Prepare interview",
  "description": "Practice REST API questions",
  "completed": false,
  "priority": "high",
  "dueDate": "2026-09-10",
  "tags": ["interview", "backend"]
}
```

Returns `201 Created` and the newly created todo.

### `PUT /todos/:id`

Replaces the editable todo fields. The ID and timestamps remain server controlled.

### `PATCH /todos/:id`

Partially updates a todo. This is used by the UI for operations such as completing a todo without sending every field.

Example:

```json
{
  "completed": true
}
```

### `DELETE /todos/:id`

Deletes the todo and returns the deleted resource.

### `GET /health`

Simple API health check.

```text
GET /api/health
```

## HTTP status codes

| Status | Meaning |
|---|---|
| 200 | Successful GET, PUT, PATCH, DELETE, or health check |
| 201 | Todo created successfully |
| 400 | Invalid request data |
| 404 | Todo or API route not found |
| 500 | Unexpected server error |

## REST design notes

- `/todos` represents the todo collection.
- `/todos/:id` represents one todo resource.
- HTTP methods express the operation: GET, POST, PUT, PATCH, DELETE.
- The server owns IDs and timestamps.
- JSON is used as the representation exchanged between frontend and backend.
- The frontend uses `fetch()` as the REST API client.
