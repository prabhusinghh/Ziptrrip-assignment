import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api } from '../../api';
import { Toast } from '../../components/Toast';
import '../../styles.css';

const STICKY_COLORS = ['sticky-yellow', 'sticky-pink', 'sticky-blue', 'sticky-green', 'sticky-purple', 'sticky-orange'];

function getStickyColor(todo) {
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
  return 'sticky-yellow';
}

function dateTime(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function TodoDetailPage() {
  const id = new URLSearchParams(window.location.search).get('id');
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    api.get(id)
      .then((item) => { 
        setTodo(item); 
        setDraft({ ...item, tags: (item.tags || []).join(', ') }); 
      })
      .catch((error) => setToast({ message: error.message, type: 'error' }))
      .finally(() => setLoading(false));
  }, [id]);

  async function save(event) {
    event.preventDefault();
    if (!draft.title.trim()) return setToast({ message: 'Title is required', type: 'error' });
    try {
      const updated = await api.update(id, {
        title: draft.title.trim(),
        description: draft.description.trim(),
        priority: draft.priority,
        dueDate: draft.dueDate,
        tags: draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      });
      setTodo(updated);
      setDraft({ ...updated, tags: (updated.tags || []).join(', ') });
      setEditing(false);
      setToast({ message: 'Sticky note updated! ✨' });
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    }
  }

  async function toggle() {
    try {
      const updated = await api.update(id, { completed: !todo.completed });
      setTodo(updated);
      setDraft({ ...updated, tags: (updated.tags || []).join(', ') });
      setToast({ message: updated.completed ? 'Marked as completed!' : 'Marked as active!' });
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    }
  }

  async function remove() {
    if (!window.confirm('Delete this sticky note permanently?')) return;
    try {
      await api.remove(id);
      window.location.href = '/index.html';
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    }
  }

  if (loading) return <div className="shell detail-wrap"><div className="loading">Loading sticky note…</div></div>;
  if (!id) return (
    <div className="shell detail-wrap">
      <a className="back" href="/index.html">← Back to board</a>
      <div className="error-box">
        <strong>Missing query parameter:</strong> <code>id</code>. Open this page as <code>todo.html?id=todo-001</code>.
      </div>
    </div>
  );
  if (!todo) return (
    <div className="shell detail-wrap">
      <a className="back" href="/index.html">← Back to board</a>
      <div className="error-box">
        <strong>Sticky Note Not Found:</strong> Could not load note with ID <code>{id}</code>.
      </div>
      <Toast {...toast} />
    </div>
  );

  const colorClass = getStickyColor(todo);

  return (
    <div className="shell detail-wrap">
      <header className="topbar">
        <a className="brand" href="/index.html">
          <span className="brand-mark">✓</span>
          <span>To-Do-List</span>
        </a>
        <span className="muted">Sticky Note Detail View</span>
      </header>

      <a className="back" href="/index.html">← Back to board</a>

      <main className={`detail-card-sticky ${colorClass}`}>
        <div className="sticky-tape" />

        {!editing ? (
          <>
            <div className="detail-head">
              <div>
                <div className="meta" style={{ marginBottom: 12 }}>
                  <span className="id-badge">📌 {todo.id}</span>
                  <span className={`pill priority-${todo.priority}`}>{todo.priority} priority</span>
                  <span className="pill">{todo.completed ? '✓ Completed' : '⚡ Active'}</span>
                </div>
                <h1>{todo.title}</h1>
              </div>
            </div>

            <div className="description-box">
              {todo.description || <span style={{ opacity: 0.6, fontStyle: 'italic' }}>No notes or description added.</span>}
            </div>

            <div className="meta">
              <span style={{ fontWeight: 700, marginRight: 4 }}>Tags:</span>
              {(todo.tags || []).length ? (
                todo.tags.map((tag) => <span className="pill" key={tag}>#{tag}</span>)
              ) : (
                <span style={{ opacity: 0.7 }}>None</span>
              )}
            </div>

            <div className="info-grid">
              <div className="info">
                <span>Target Due Date</span>
                <strong>{todo.dueDate || 'No due date set'}</strong>
              </div>
              <div className="info">
                <span>Note ID (URL Query Param)</span>
                <strong style={{ fontFamily: 'monospace' }}>{todo.id}</strong>
              </div>
              <div className="info">
                <span>Created At</span>
                <strong>{dateTime(todo.createdAt)}</strong>
              </div>
              <div className="info">
                <span>Last Updated</span>
                <strong>{dateTime(todo.updatedAt)}</strong>
              </div>
            </div>

            <div className="actions">
              <button className="button" onClick={toggle}>
                {todo.completed ? 'Mark as Active' : '✓ Mark as Complete'}
              </button>
              <button className="button secondary" onClick={() => setEditing(true)}>
                ✏️ Edit Note
              </button>
              <button className="button danger" onClick={remove}>
                🗑️ Delete Note
              </button>
            </div>
          </>
        ) : (
          <form className="form" onSubmit={save}>
            <h2 style={{ marginTop: 0, fontSize: '1.5rem', fontWeight: 800 }}>✏️ Edit Sticky Note</h2>
            
            <label className="label">
              Title *
              <input maxLength="120" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
            </label>
            
            <label className="label">
              Notes & Description
              <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </label>
            
            <div className="form-row">
              <label className="label">
                Priority
                <select value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value })}>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </label>

              <label className="label">
                Due Date
                <input type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} />
              </label>
            </div>

            <label className="label">
              Tags (comma separated)
              <input value={draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} />
            </label>

            <div className="actions">
              <button className="button" style={{ background: 'linear-gradient(135deg, #f59e0b, #ea580c)' }}>
                💾 Save Changes
              </button>
              <button 
                className="button secondary" 
                type="button" 
                onClick={() => { 
                  setDraft({ ...todo, tags: (todo.tags || []).join(', ') }); 
                  setEditing(false); 
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </main>

      <Toast {...toast} />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<React.StrictMode><TodoDetailPage /></React.StrictMode>);
