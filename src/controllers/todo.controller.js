const httpStatus = require('http-status').status;
const catchAsync = require('../utils/catchAsync');
const todoService = require('../services/todo.service');

const createTodo = catchAsync(async (req, res) => {
  const todo = await todoService.createTodo(req.user.id, req.body);
  res.status(httpStatus.CREATED).send(todo);
});

const getTodos = catchAsync(async (req, res) => {
  const todos = await todoService.getTodos(req.user.id);
  res.send(todos);
});

const getTodo = catchAsync(async (req, res) => {
  const todo = await todoService.getTodoById(req.user.id, parseInt(req.params.todoId));
  res.send(todo);
});

const updateTodo = catchAsync(async (req, res) => {
  const todo = await todoService.updateTodo(req.user.id, parseInt(req.params.todoId), req.body);
  res.send(todo);
});

const deleteTodo = catchAsync(async (req, res) => {
  await todoService.deleteTodo(req.user.id, parseInt(req.params.todoId));
  res.status(httpStatus.NO_CONTENT).send();
});

const getTodayTodos = catchAsync(async (req, res) => {
    const todos = await todoService.getTodayTodos(req.user.id);
    res.send(todos);
});

const getDueTodos = catchAsync(async (req, res) => {
    const todos = await todoService.getDueTodos(req.user.id);
    res.send(todos);
});

const getTodosByCategory = catchAsync(async (req, res) => {
    const todos = await todoService.getTodosByCategory(req.user.id, parseInt(req.params.categoryId));
    res.send(todos);
});

module.exports = {
  createTodo,
  getTodos,
  getTodo,
  updateTodo,
  deleteTodo,
  getTodayTodos,
  getDueTodos,
  getTodosByCategory,
};