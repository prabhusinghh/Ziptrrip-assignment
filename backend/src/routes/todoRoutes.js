import { Router } from 'express';
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  replaceTodo,
  updateTodo
} from '../controllers/todoController.js';

const router = Router();

// REST resource: /api/todos
router.get('/', getTodos);
router.post('/', createTodo);

// REST resource item: /api/todos/:id
router.get('/:id', getTodoById);
router.put('/:id', replaceTodo);
router.patch('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;
