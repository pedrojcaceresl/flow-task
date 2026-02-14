const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const todoValidation = require('../../validations/todo.validation');
const todoController = require('../../controllers/todo.controller');

const router = express.Router();

router.use(auth);

router
  .route('/')
  .post(validate(todoValidation.createTodo), todoController.createTodo)
  .get(todoController.getTodos);

router.get('/today', todoController.getTodayTodos);
router.get('/due', todoController.getDueTodos);
router.get('/category/:categoryId', validate(todoValidation.getByCategory), todoController.getTodosByCategory);

router
  .route('/:todoId')
  .get(validate(todoValidation.getTodo), todoController.getTodo)
  .put(validate(todoValidation.updateTodo), todoController.updateTodo)
  .delete(validate(todoValidation.deleteTodo), todoController.deleteTodo);

module.exports = router;