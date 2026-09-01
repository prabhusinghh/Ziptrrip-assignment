# Todo API Documentation

Base URL: `http://localhost:4000/api`

## Todo object

```json
{
  "id": "uuid",
  "title": "Prepare demo",
  "description": "Walk through the MPA architecture",
  "completed": false,
  "priority": "high",
  "dueDate": "2026-09-05",
  "tags": ["assignment", "react"],
  "createdAt": "2026-09-01T10:00:00.000Z",
  "updatedAt": "2026-09-01T10:00:00.000Z"
}
```

## Endpoints

### `GET /health`
Returns API health information.

### `GET /todos`
Returns todos. Optional query parameters:

| Parameter | Values | Purpose |
|---|---|---|
| `q` | text | Search title, description and tags |
| `status` | `all`, `active`, `completed` | Completion filter |
| `priority` | `all`, `low`, `medium`, `high` | Priority filter |
| `sort` | `created-desc`, `created-asc`, `due-asc`, `priority-desc` | Sorting |

Example response:

```json
{
  "items": [],
  "total": 0
}
```

### `GET /todos/:id`
Returns one todo or `404` if it does not exist.

### `POST /todos`
Creates a todo.

Example request:

```json
{
  "title": "Prepare demo",
  "description": "Explain the architecture",
  "priority": "high",
  "dueDate": "2026-09-05",
  "tags": ["react", "assignment"]
}
```

### `PATCH /todos/:id`
Partially updates a todo. Useful for completion toggles and edits.

Example:

```json
{
  "completed": true
}
```

### `PUT /todos/:id`
Replaces the editable todo fields with the provided complete payload.

### `DELETE /todos/:id`
Deletes the todo and returns the deleted object.

## Validation

- `title` is required and limited to 120 characters.
- `priority` must be `low`, `medium`, or `high`.
- `completed` must be boolean when supplied.
- `dueDate` must use `YYYY-MM-DD` when supplied.
- `tags` must be an array; duplicates and blank tags are removed.
