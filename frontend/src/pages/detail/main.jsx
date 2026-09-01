import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api } from '../../api';
import { Toast } from '../../components/Toast';
import '../../styles.css';

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
    api.get(id).then((item) => { setTodo(item); setDraft({ ...item, tags: (item.tags || []).join(', ') }); })
      .catch((error) => setToast({ message: error.message, type: 'error' }))
      .finally(() => setLoading(false));
  }, [id]);

  async function save(event) {
    event.preventDefault();
    try {
      const updated = await api.update(id, {
        title: draft.title,
        description: draft.description,
        priority: draft.priority,
        dueDate: draft.dueDate,
        tags: draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      });
      setTodo(updated);
      setDraft({ ...updated, tags: (updated.tags || []).join(', ') });
      setEditing(false);
      setToast({ message: 'Changes saved' });
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    }
  }

  async function toggle() {
    try {
      const updated = await api.update(id, { completed: !todo.completed });
      setTodo(updated);
      setDraft({ ...updated, tags: (updated.tags || []).join(', ') });
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    }
  }

  async function remove() {
    if (!window.confirm('Delete this todo permanently?')) return;
    try {
      await api.remove(id);
      window.location.href = '/index.html';
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    }
  }

  if (loading) return <div className="shell detail-wrap"><div className="loading">Loading todo…</div></div>;
  if (!id) return <div className="shell detail-wrap"><a className="back" href="/index.html">← Back to todos</a><div className="error-box">Missing required query parameter: <strong>id</strong>. Open this page as <code>todo.html?id=TODO_ID</code>.</div></div>;
  if (!todo) return <div className="shell detail-wrap"><a className="back" href="/index.html">← Back to todos</a><div className="error-box">Todo could not be loaded.</div><Toast {...toast} /></div>;

  return <div className="shell detail-wrap">
    <header className="topbar"><a className="brand" href="/index.html"><span className="brand-mark">✓</span>TaskFlow</a><span className="muted">Todo detail</span></header>
    <a className="back" href="/index.html">← Back to all todos</a>
    <main className="panel detail-card">
      {!editing ? <>
        <div className="detail-head"><div><div className="meta" style={{marginBottom: 9}}><span className={`pill priority-${todo.priority}`}>{todo.priority} priority</span><span className="pill">{todo.completed ? 'Completed' : 'Active'}</span></div><h1>{todo.title}</h1></div></div>
        <div className="description-box">{todo.description || 'No description added.'}</div>
        <div className="meta">{(todo.tags || []).length ? todo.tags.map((tag) => <span className="pill" key={tag}>#{tag}</span>) : <span>No tags</span>}</div>
        <div className="info-grid">
          <div className="info"><span>Due date</span><strong>{todo.dueDate || 'Not set'}</strong></div>
          <div className="info"><span>Todo ID (query parameter)</span><strong style={{wordBreak:'break-all'}}>{todo.id}</strong></div>
          <div className="info"><span>Created</span><strong>{dateTime(todo.createdAt)}</strong></div>
          <div className="info"><span>Last updated</span><strong>{dateTime(todo.updatedAt)}</strong></div>
        </div>
        <div className="actions"><button className="button" onClick={toggle}>{todo.completed ? 'Mark active' : 'Mark complete'}</button><button className="button secondary" onClick={() => setEditing(true)}>Edit</button><button className="button danger" onClick={remove}>Delete</button></div>
      </> : <form className="form" onSubmit={save}>
        <h2 style={{marginTop: 0}}>Edit todo</h2>
        <label className="label">Title<input maxLength="120" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
        <label className="label">Description<textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></label>
        <div className="form-row"><label className="label">Priority<select value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value })}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label><label className="label">Due date<input type="date" value={draft.dueDate} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} /></label></div>
        <label className="label">Tags<input value={draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} /></label>
        <div className="actions"><button className="button">Save changes</button><button className="button secondary" type="button" onClick={() => { setDraft({ ...todo, tags: (todo.tags || []).join(', ') }); setEditing(false); }}>Cancel</button></div>
      </form>}
    </main>
    <Toast {...toast} />
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><TodoDetailPage /></React.StrictMode>);
