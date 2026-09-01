# Features & Functionalities Documentation

This document outlines all the features and capabilities implemented across the application in accordance with the assignment requirements.

---

## 1. Todos Sticky Notes Board (`index.html`)

The list page acts as an interactive board of colorful sticky notes.

- **Colorful Sticky Notes Aesthetic**:
  - Automatically color-coded notes with warm palettes: **Lemon Yellow, Soft Pink, Sky Blue, Mint Green, Lavender Purple, and Peach Orange**.
  - Visual details including frosted top tape accents, realistic drop shadows, and subtle natural tilt animations on hover.

- **Auto-Increment Sequential IDs**:
  - Automatically generates IDs in clean sequential format: `todo-001`, `todo-002`, `todo-003`, etc.

- **Task Creation Notepad**:
  - **Title** (Required): Short title describing the task (max 120 characters).
  - **Notes / Description** (Optional): Detailed notes/instructions.
  - **Priority** (Optional): Choose between `Low` (🟢), `Medium` (🟡), or `High` (🔴).
  - **Due Date** (Optional): Target completion date.
  - **Tags** (Optional): Comma-separated labels (e.g. `react`, `urgent`, `design`) for organization.

- **Interactive Actions**:
  - **Quick Completion**: Checkbox toggle to mark tasks completed or active with instant strike-through styling.
  - **Delete Note**: Delete action with confirmation prompt.
  - **Open Note Navigation**: Clickable note card, title, ID badge (`📌 todo-XXX`), and "Open Note →" action button navigating to `todo.html?id=<id>`.

- **Search, Filter & Sort**:
  - **Live Search**: Instant search matching against task titles, descriptions, and tag labels.
  - **Status Filter**: View `All`, `Active`, or `Completed` notes.
  - **Priority Filter**: Filter by `All`, `Low`, `Medium`, or `High`.
  - **Sorting Options**: Sort by `Newest first`, `Oldest first`, `Due soonest`, and `Highest priority`.

- **Visual Indicators & Feedback**:
  - **Memo Counters**: Colored memo boxes displaying counts of Total Notes, Active Tasks, and Completed Tasks.
  - **Overdue Badge**: Red visual alert badge highlighting tasks whose due date has passed.
  - **Toast Notifications**: Non-intrusive notification popups for successful actions and error messages.
  - **Empty & Loading States**: Clean UI feedback when fetching data or when no tasks match current filters.

---

## 2. Single Todo Detail Page (`todo.html?id=<id>`)

The single todo view provides a dedicated page for inspecting and modifying a specific task.

- **Query Parameter Routing**:
  - Extracts the task ID from the URL query string (`window.location.search`).
  - Example: `http://localhost:5173/todo.html?id=todo-003`.
  - Works both via clicking notes on the board and via direct browser URL entry.

- **Matching Sticky Note Theme**:
  - Renders as a large hero sticky note matching the task's assigned color theme and frosted tape accent.

- **Comprehensive Task Details**:
  - Displays Title, Description, Status, Priority badge, Due Date, and Tag chips.
  - Displays system-level metadata: unique task ID, created timestamp, and last updated timestamp.

- **In-Place Editing**:
  - "Edit Note" mode allowing updates to title, description, priority, due date, and tags.
  - Form validation ensures empty titles cannot be submitted.

- **Status & Actions**:
  - One-click button to toggle task between `Active` and `Completed`.
  - Delete button with confirmation that removes the item and navigates back to `index.html`.
  - "Back to Board" navigation button returning to `index.html`.

- **Error & Edge Case Handling**:
  - Handles missing `?id=` query parameter gracefully with a helpful message and return button.
  - Handles invalid or deleted task IDs with a `404 Not Found` feedback screen.

---

## 3. Backend & Data Layer (`backend/`)

- **Node.js & Express.js REST API**:
  - Structured modular design with separated routes, controllers, validation utilities, and storage layer.

- **Auto-Increment ID Generator**:
  - Scans existing items to detect the highest numeric ID and generates the next formatted ID (`todo-001`, `todo-002`, etc.).

- **Data Persistence**:
  - File-based JSON storage inside `backend/data/todos.json`.
  - File writes use atomic operations (writing to a temporary file then renaming) to prevent data corruption.

- **Input Validation**:
  - Validates required fields, maximum length constraints, valid enum values for priority, and proper date formatting (`YYYY-MM-DD`).
  - Returns clear HTTP status codes (`400 Bad Request`, `404 Not Found`, `500 Internal Server Error`).

- **Query-based Filtering & Sorting on Backend**:
  - The `GET /api/todos` endpoint supports server-side search (`q`), status filtering (`status`), priority filtering (`priority`), and sorting (`sort`).

- **CORS & Dev Tools**:
  - Configured with CORS for local development between frontend and backend servers.
  - Includes a `GET /api/health` endpoint for monitoring server status.
