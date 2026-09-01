# Features & Functionalities Documentation

This document outlines all the features and capabilities implemented across the application in accordance with the assignment requirements.

---

## 1. Todos List Page (`index.html`)

The list page acts as the main dashboard for viewing and managing tasks.

- **Task Creation**:
  - **Title** (Required): Short title describing the task.
  - **Description** (Optional): Detailed notes/instructions.
  - **Priority** (Optional): Choose between `Low`, `Medium`, or `High` (defaults to `medium`).
  - **Due Date** (Optional): Pick a target completion date.
  - **Tags** (Optional): Comma-separated labels (e.g. `work`, `urgent`, `personal`) for organization.

- **Task Management**:
  - **Quick Completion**: Checkbox toggle to mark tasks as completed or active directly from the card.
  - **Delete Task**: Delete action with confirmation prompt to prevent accidental deletions.
  - **Navigate to Detail Page**: Direct button/card click that opens `todo.html?id=<id>`.

- **Search, Filter & Sort**:
  - **Live Search**: Instant search matching against task titles, descriptions, and tag labels.
  - **Status Filter**: View `All`, `Active`, or `Completed` tasks.
  - **Priority Filter**: Filter by `All`, `Low`, `Medium`, or `High`.
  - **Sorting Options**: Sort by `Newest first`, `Oldest first`, `Due date (earliest)`, and `Priority (High → Low)`.

- **Visual Indicators & Feedback**:
  - **Live Counters**: Dynamic counters displaying the count of Total, Active, and Completed tasks.
  - **Overdue Warning**: Visual badge highlighting pending tasks whose due date has passed.
  - **Toast Notifications**: Non-intrusive notification popups for successful actions (created, updated, deleted) and API errors.
  - **Empty & Loading States**: Clean UI feedback when fetching data or when no tasks match current filters.

---

## 2. Single Todo Detail Page (`todo.html?id=<id>`)

The single todo view provides a dedicated page for inspecting and modifying a specific task.

- **Query Parameter Routing**:
  - Extracts the task ID from the URL query string (`window.location.search`).
  - Example: `http://localhost:5173/todo.html?id=c6a8f118-8f83-4a11-b4f0-463285741bf8`.

- **Comprehensive Task Details**:
  - Displays Title, Description, Status, Priority, Due Date, and Tag chips.
  - Displays system-level metadata: unique task ID, created timestamp, and last updated timestamp.

- **In-Place Editing**:
  - "Edit Task" mode allowing updates to title, description, priority, due date, and tags.
  - Form validation ensures empty titles cannot be submitted.

- **Status & Actions**:
  - One-click button to toggle task between `Active` and `Completed`.
  - Delete button with confirmation that removes the item and navigates back to `index.html`.
  - "Back to List" navigation button returning to `index.html`.

- **Error & Edge Case Handling**:
  - Handles missing `?id=` query parameter gracefully with a helpful message and return button.
  - Handles invalid or deleted task IDs with a `404 Not Found` feedback screen.

---

## 3. Backend & Data Layer (`backend/`)

- **Node.js & Express.js REST API**:
  - Structured modular design with separated routes, controllers, validation utilities, and storage layer.

- **Data Persistence**:
  - File-based JSON storage inside `backend/data/todos.json`.
  - File writes use atomic operations (writing to a temporary file then renaming) to prevent data corruption in case of unexpected process exits during a write.

- **Input Validation**:
  - Validates required fields, maximum length constraints, valid enum values for priority, and proper date formatting (`YYYY-MM-DD`).
  - Returns clear HTTP status codes (`400 Bad Request`, `404 Not Found`, `500 Internal Server Error`).

- **Query-based Filtering & Sorting on Backend**:
  - The `GET /api/todos` endpoint supports server-side search (`q`), status filtering (`status`), priority filtering (`priority`), and sorting (`sort`).

- **CORS & Dev Tools**:
  - Configured with CORS for local development between frontend and backend servers.
  - Includes a `GET /api/health` endpoint for monitoring server status.
