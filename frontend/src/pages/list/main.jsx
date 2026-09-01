import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api } from '../../api';
import { Toast } from '../../components/Toast';
import '../../styles.css';

const emptyForm = { title: '', description: '', priority: 'medium', dueDate: '', tags: '' };

function formatDate(value) {
  if (!value) return 'No due date';
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

function TodoListPage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: '', status: 'all', priority: 'all', sort: 'created-desc' });
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  async function loadTodos(nextFilters = filters) {
    setLoading(true);
    try {
      const result = await api.list(nextFilters);
      setTodos(result.items);
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => loadTodos(filters), filters.q ? 250 : 0);
    return () => clearTimeout(timer);
  }, [filters.q, filters.status, filters.priority, filters.sort]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const stats = useMemo(() => ({
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    active: todos.filter((t) => !t.completed).length
  }), [todos]);

  async function createTodo(event) {
    event.preventDefault();
    if (!form.title.trim()) return setToast({ message: 'Title is required', type: 'error' });
    setSaving(true);
    try {
      await api.create({
        ...form,
        title: form.title.trim(),
        tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      });
      setForm(emptyForm);
      setToast({ message: 'Todo created' });
      await loadTodos();
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  async function toggle(todo) {
    try {
      await api.update(todo.id, { completed: !todo.completed });
      setTodos((current) => current.map((item) => item.id === todo.id ? { ...item, completed: !item.completed } : item));
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    }
  }

  async function remove(todo) {
    if (!window.confirm(`Delete “${todo.title}”?`)) return;
    try {
      await api.remove(todo.id);
      setTodos((current) => current.filter((item) => item.id !== todo.id));
      setToast({ message: 'Todo deleted' });
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    }
  }

  return (
    <div className="shell">
      <header className="topbar">
        <a className="brand" href="/index.html"><span className="brand-mark">✓</span>TaskFlow</a>
        <span className="muted">React Multi-Page Todo</span>
      </header>

      <section className="hero">
        <div><h1>Make progress visible.</h1><p>A focused todo workspace with real page navigation and a REST API.</p></div>
      </section>

      <main className="grid">
        <section className="panel panel-pad">
          <div className="stats">
            <div className="stat"><strong>{stats.total}</strong><span>Visible</span></div>
            <div className="stat"><strong>{stats.active}</strong><span>Active</span></div>
            <div className="stat"><strong>{stats.completed}</strong><span>Completed</span></div>
          </div>

          <div className="toolbar">
            <div className="search"><input aria-label="Search todos" placeholder="Search title, description, tags..." value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} /></div>
            <select aria-label="Status filter" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="all">All status</option><option value="active">Active</option><option value="completed">Completed</option></select>
            <select aria-label="Priority filter" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}><option value="all">All priority</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
            <select aria-label="Sort todos" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}><option value="created-desc">Newest</option><option value="created-asc">Oldest</option><option value="due-asc">Due soon</option><option value="priority-desc">Priority</option></select>
          </div>

          {loading ? <div className="loading">Loading todos…</div> : todos.length === 0 ? <div className="empty"><strong>No todos match.</strong><div>Try changing filters or create a new task.</div></div> : (
            <div className="todo-list">
              {todos.map((todo) => {
                const overdue = todo.dueDate && !todo.completed && new Date(`${todo.dueDate}T23:59:59`) < new Date();
                const detailUrl = `/todo.html?id=${encodeURIComponent(todo.id)}`;
                return <article className="todo-card" key={todo.id}>
                  <input className="check" type="checkbox" checked={todo.completed} onChange={() => toggle(todo)} aria-label={`Mark ${todo.title} complete`} />
                  <div className="todo-main">
                    <div className="todo-title-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <a className="pill id-pill" href={detailUrl} title="Open detail page">
                          {todo.id}
                        </a>
                        <a className={`todo-title ${todo.completed ? 'done' : ''}`} href={detailUrl}>
                          {todo.title}
                        </a>
                      </div>
                      <div className="card-actions">
                        <a className="button secondary small-btn" href={detailUrl}>View Details →</a>
                        <button className="button danger small-btn" onClick={() => remove(todo)}>Delete</button>
                      </div>
                    </div>
                    {todo.description && <p className="todo-desc">{todo.description}</p>}
                    <div className="meta">
                      <span className={`pill priority-${todo.priority}`}>{todo.priority} priority</span>
                      <span className={overdue ? 'overdue' : ''}>{overdue ? 'Overdue · ' : ''}{formatDate(todo.dueDate)}</span>
                      {(todo.tags || []).map((tag) => <span className="pill" key={tag}>#{tag}</span>)}
                    </div>
                  </div>
                </article>;
              })}
            </div>
          )}
        </section>

        <aside className="panel panel-pad">
          <h2 style={{marginTop: 0}}>Add a todo</h2>
          <p className="muted">Capture enough context now so the detail page stays useful later.</p>
          <form className="form" onSubmit={createTodo}>
            <label className="label">Title<input maxLength="120" placeholder="e.g. Prepare demo" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
            <label className="label">Description<textarea placeholder="What needs to be done?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
            <div className="form-row">
              <label className="label">Priority<select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
              <label className="label">Due date<input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} /></label>
            </div>
            <label className="label">Tags<input placeholder="react, assignment" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></label>
            <button className="button" disabled={saving}>{saving ? 'Creating…' : 'Create todo'}</button>
          </form>
        </aside>
      </main>
      <Toast {...toast} />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><TodoListPage /></React.StrictMode>);
