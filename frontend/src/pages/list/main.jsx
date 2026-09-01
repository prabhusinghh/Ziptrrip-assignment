import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api } from '../../api';
import { Toast } from '../../components/Toast';
import '../../styles.css';

const emptyForm = { title: '', description: '', priority: 'medium', dueDate: '', tags: '' };
const STICKY_COLORS = ['sticky-yellow', 'sticky-pink', 'sticky-blue', 'sticky-green', 'sticky-purple', 'sticky-orange'];

function getStickyColor(todo, index) {
  if (todo && todo.id) {
    const match = todo.id.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      return STICKY_COLORS[Math.abs(num - 1) % STICKY_COLORS.length];
    }
    let hash = 0;
    for (let i = 0; i < todo.id.length; i++) hash = (hash * 31 + todo.id.charCodeAt(i)) % STICKY_COLORS.length;
    return STICKY_COLORS[Math.abs(hash)];
  }
  return STICKY_COLORS[index % STICKY_COLORS.length];
}

function formatDate(value) {
  if (!value) return null;
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
      setToast({ message: 'Sticky note created! 📌' });
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
    if (!window.confirm(`Delete note “${todo.title}”?`)) return;
    try {
      await api.remove(todo.id);
      setTodos((current) => current.filter((item) => item.id !== todo.id));
      setToast({ message: 'Note deleted' });
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    }
  }

  return (
    <div className="shell">
      <header className="topbar">
        <a className="brand" href="/index.html">
          <span className="brand-mark">✓</span>
          <span>To-Do-List</span>
        </a>
        <span className="muted">Colorful Sticky Notes Board</span>
      </header>

      <section className="hero">
        <div>
          <h1>Your Sticky Notes Board</h1>
          <p>Organize your tasks with colorful, interactive sticky notes.</p>
        </div>
      </section>

      <main className="grid">
        <section className="panel panel-pad">
          {/* Memo Stats */}
          <div className="stats">
            <div className="stat stat-total">
              <strong>{stats.total}</strong>
              <span>Total Notes</span>
            </div>
            <div className="stat stat-active">
              <strong>{stats.active}</strong>
              <span>Active Tasks</span>
            </div>
            <div className="stat stat-completed">
              <strong>{stats.completed}</strong>
              <span>Completed</span>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="toolbar">
            <div className="search">
              <input 
                aria-label="Search todos" 
                placeholder="🔍 Search notes, descriptions, tags..." 
                value={filters.q} 
                onChange={(e) => setFilters({ ...filters, q: e.target.value })} 
              />
            </div>
            <select aria-label="Status filter" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="completed">Completed Only</option>
            </select>
            <select aria-label="Priority filter" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <select aria-label="Sort todos" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
              <option value="created-desc">Newest First</option>
              <option value="created-asc">Oldest First</option>
              <option value="due-asc">Due Soonest</option>
              <option value="priority-desc">Highest Priority</option>
            </select>
          </div>

          {/* Sticky Notes Grid */}
          {loading ? (
            <div className="loading">Loading sticky notes…</div>
          ) : todos.length === 0 ? (
            <div className="empty">
              <div style={{ fontSize: '2.4rem', marginBottom: '8px' }}>📝</div>
              <strong>No sticky notes match your filter.</strong>
              <div style={{ marginTop: '4px' }}>Try clearing filters or add a new sticky note from the right panel!</div>
            </div>
          ) : (
            <div className="todo-list">
              {todos.map((todo, idx) => {
                const overdue = todo.dueDate && !todo.completed && new Date(`${todo.dueDate}T23:59:59`) < new Date();
                const detailUrl = `/todo.html?id=${encodeURIComponent(todo.id)}`;
                const colorClass = getStickyColor(todo, idx);
                const formattedDate = formatDate(todo.dueDate);

                return (
                  <article className={`sticky-card ${colorClass} ${todo.completed ? 'completed' : ''}`} key={todo.id}>
                    <div className="sticky-tape" />
                    
                    {/* Header with ID and Priority */}
                    <div className="sticky-header">
                      <a className="id-badge" href={detailUrl} title="Open Detail Page">
                        📌 {todo.id}
                      </a>
                      <span className={`pill priority-${todo.priority}`}>
                        {todo.priority}
                      </span>
                    </div>

                    {/* Body with checkbox, title, description, tags */}
                    <div className="sticky-body">
                      <div className="todo-title-wrap">
                        <input 
                          className="check" 
                          type="checkbox" 
                          checked={todo.completed} 
                          onChange={() => toggle(todo)} 
                          aria-label={`Mark ${todo.title} complete`} 
                        />
                        <a className={`todo-title ${todo.completed ? 'done' : ''}`} href={detailUrl}>
                          {todo.title}
                        </a>
                      </div>

                      {todo.description && (
                        <p className="todo-desc">{todo.description}</p>
                      )}

                      <div className="meta">
                        {formattedDate && (
                          <span className={overdue ? 'overdue' : 'pill'}>
                            {overdue ? '⚠️ Overdue · ' : '📅 '}{formattedDate}
                          </span>
                        )}
                        {(todo.tags || []).map((tag) => (
                          <span className="pill" key={tag}>#{tag}</span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="sticky-footer">
                      <span style={{ fontSize: '0.74rem', opacity: 0.75, fontWeight: 600 }}>
                        {todo.completed ? '✓ Completed' : '⚡ Active'}
                      </span>
                      <div className="card-actions">
                        <a className="button secondary small-btn" href={detailUrl}>
                          Open Note →
                        </a>
                        <button className="button danger small-btn" onClick={() => remove(todo)} title="Delete note">
                          ✕
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Add Note Memo Panel */}
        <aside className="panel panel-pad memo-aside">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.4rem' }}>📌</span>
            <h2>Pin a New Note</h2>
          </div>
          <p className="muted" style={{ margin: '0 0 16px', fontSize: '0.88rem' }}>
            Write down your tasks with tags, priorities, and dates.
          </p>

          <form className="form" onSubmit={createTodo}>
            <label className="label">
              Task Title *
              <input 
                maxLength="120" 
                placeholder="e.g. Design homepage mockup" 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
              />
            </label>

            <label className="label">
              Notes & Description
              <textarea 
                placeholder="What details need to be noted?" 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })} 
              />
            </label>

            <div className="form-row">
              <label className="label">
                Priority
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </label>

              <label className="label">
                Due Date
                <input 
                  type="date" 
                  value={form.dueDate} 
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })} 
                />
              </label>
            </div>

            <label className="label">
              Tags
              <input 
                placeholder="design, urgent, frontend" 
                value={form.tags} 
                onChange={(e) => setForm({ ...form, tags: e.target.value })} 
              />
            </label>

            <button className="button" style={{ marginTop: '6px', background: 'linear-gradient(135deg, #f59e0b, #ea580c)' }} disabled={saving}>
              {saving ? 'Pinning Note…' : '📌 Pin Note to Board'}
            </button>
          </form>
        </aside>
      </main>

      <Toast {...toast} />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><TodoListPage /></React.StrictMode>);
