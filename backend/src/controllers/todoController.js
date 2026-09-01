import crypto from 'node:crypto';
import { readTodos, writeTodos } from '../store.js';
import { ALLOWED_PRIORITIES, normalizeTags, validateTodo } from '../utils/todoValidation.js';

const priorityRank = { high: 3, medium: 2, low: 1 };

function notFound(res) {
  return res.status(404).json({ error: 'Todo not found' });
}

export async function getTodos(req, res, next) {
  try {
    let todos = await readTodos();
    const { status = 'all', priority = 'all', q = '', sort = 'created-desc' } = req.query;

    if (status === 'active') todos = todos.filter((todo) => !todo.completed);
    if (status === 'completed') todos = todos.filter((todo) => todo.completed);
    if (priority !== 'all') todos = todos.filter((todo) => todo.priority === priority);

    const needle = String(q).trim().toLowerCase();
    if (needle) {
      todos = todos.filter((todo) =>
        [todo.title, todo.description, ...(todo.tags || [])].join(' ').toLowerCase().includes(needle)
      );
    }

    const sorters = {
      'created-desc': (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      'created-asc': (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      'due-asc': (a, b) => (a.dueDate || '9999-12-31').localeCompare(b.dueDate || '9999-12-31'),
      'priority-desc': (a, b) => priorityRank[b.priority] - priorityRank[a.priority]
    };

    todos.sort(sorters[sort] || sorters['created-desc']);
    res.json({ items: todos, total: todos.length });
  } catch (error) {
    next(error);
  }
}

export async function getTodoById(req, res, next) {
  try {
    const todos = await readTodos();
    const todo = todos.find((item) => item.id === req.params.id);
    if (!todo) return notFound(res);
    res.json(todo);
  } catch (error) {
    next(error);
  }
}

export async function createTodo(req, res, next) {
  try {
    const errors = validateTodo(req.body);
    if (errors.length) return res.status(400).json({ error: errors[0], errors });

    const now = new Date().toISOString();
    const todo = {
      id: crypto.randomUUID(),
      title: req.body.title.trim(),
      description: String(req.body.description || '').trim(),
      completed: Boolean(req.body.completed),
      priority: ALLOWED_PRIORITIES.has(req.body.priority) ? req.body.priority : 'medium',
      dueDate: req.body.dueDate || '',
      tags: normalizeTags(req.body.tags),
      createdAt: now,
      updatedAt: now
    };

    const todos = await readTodos();
    todos.push(todo);
    await writeTodos(todos);
    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
}

export async function updateTodo(req, res, next) {
  try {
    const errors = validateTodo(req.body, { partial: true });
    if (errors.length) return res.status(400).json({ error: errors[0], errors });

    const todos = await readTodos();
    const index = todos.findIndex((item) => item.id === req.params.id);
    if (index === -1) return notFound(res);

    const existing = todos[index];
    const updated = {
      ...existing,
      ...(req.body.title !== undefined ? { title: req.body.title.trim() } : {}),
      ...(req.body.description !== undefined ? { description: req.body.description.trim() } : {}),
      ...(req.body.completed !== undefined ? { completed: req.body.completed } : {}),
      ...(req.body.priority !== undefined ? { priority: req.body.priority } : {}),
      ...(req.body.dueDate !== undefined ? { dueDate: req.body.dueDate } : {}),
      ...(req.body.tags !== undefined ? { tags: normalizeTags(req.body.tags) } : {}),
      updatedAt: new Date().toISOString()
    };

    todos[index] = updated;
    await writeTodos(todos);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function replaceTodo(req, res, next) {
  try {
    const errors = validateTodo(req.body);
    if (errors.length) return res.status(400).json({ error: errors[0], errors });

    const todos = await readTodos();
    const index = todos.findIndex((item) => item.id === req.params.id);
    if (index === -1) return notFound(res);

    const existing = todos[index];
    const updated = {
      ...existing,
      title: req.body.title.trim(),
      description: String(req.body.description || '').trim(),
      completed: Boolean(req.body.completed),
      priority: req.body.priority || 'medium',
      dueDate: req.body.dueDate || '',
      tags: normalizeTags(req.body.tags),
      updatedAt: new Date().toISOString()
    };

    todos[index] = updated;
    await writeTodos(todos);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteTodo(req, res, next) {
  try {
    const todos = await readTodos();
    const index = todos.findIndex((item) => item.id === req.params.id);
    if (index === -1) return notFound(res);

    const [deleted] = todos.splice(index, 1);
    await writeTodos(todos);
    res.json({ message: 'Todo deleted', todo: deleted });
  } catch (error) {
    next(error);
  }
}
