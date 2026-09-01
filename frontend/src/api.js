export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Something went wrong');
  return payload;
}

export const api = {
  list(params = {}) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
    );
    return request(`/todos?${query}`);
  },
  get(id) {
    return request(`/todos/${encodeURIComponent(id)}`);
  },
  create(todo) {
    return request('/todos', { method: 'POST', body: JSON.stringify(todo) });
  },
  update(id, patch) {
    return request(`/todos/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(patch) });
  },
  remove(id) {
    return request(`/todos/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }
};
