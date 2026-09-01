const ALLOWED_PRIORITIES = new Set(['low', 'medium', 'high']);

export function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return [...new Set(tags.map((tag) => String(tag).trim()).filter(Boolean))].slice(0, 8);
}

export function validateTodo(body = {}, { partial = false } = {}) {
  const errors = [];

  if (!partial || body.title !== undefined) {
    if (typeof body.title !== 'string' || !body.title.trim()) {
      errors.push('title is required');
    } else if (body.title.trim().length > 120) {
      errors.push('title must be 120 characters or fewer');
    }
  }

  if (body.description !== undefined && typeof body.description !== 'string') {
    errors.push('description must be a string');
  }

  if (body.completed !== undefined && typeof body.completed !== 'boolean') {
    errors.push('completed must be a boolean');
  }

  if (body.priority !== undefined && !ALLOWED_PRIORITIES.has(body.priority)) {
    errors.push('priority must be low, medium, or high');
  }

  if (body.dueDate !== undefined && body.dueDate !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(body.dueDate)) {
    errors.push('dueDate must be YYYY-MM-DD');
  }

  if (body.tags !== undefined && !Array.isArray(body.tags)) {
    errors.push('tags must be an array');
  }

  return errors;
}

export { ALLOWED_PRIORITIES };
