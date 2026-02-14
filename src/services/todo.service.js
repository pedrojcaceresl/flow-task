const prisma = require('../utils/prisma');
const httpStatus = require('http-status').status;
const AppError = require('../utils/AppError');

const createTodo = async (userId, todoBody) => {
  const todo = await prisma.todo.create({
    data: {
      ...todoBody,
      userId,
    },
  });
  return todo;
};

const getTodos = async (userId, filters = {}) => {
  const todos = await prisma.todo.findMany({
    where: {
      userId,
      ...filters,
    },
  });
  return todos;
};

const getTodoById = async (userId, todoId) => {
  const todo = await prisma.todo.findFirst({
    where: {
      id: todoId,
      userId,
    },
  });
  if (!todo) {
    throw new AppError(httpStatus.NOT_FOUND, 'Todo not found');
  }
  return todo;
};

const updateTodo = async (userId, todoId, updateBody) => {
  const todo = await getTodoById(userId, todoId);
  const updatedTodo = await prisma.todo.update({
    where: { id: todo.id },
    data: updateBody,
  });
  return updatedTodo;
};

const deleteTodo = async (userId, todoId) => {
  const todo = await getTodoById(userId, todoId);
  await prisma.todo.delete({
    where: { id: todo.id },
  });
  return todo;
};

const getTodayTodos = async (userId) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return prisma.todo.findMany({
    where: {
      userId,
      dueDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });
};

const getDueTodos = async (userId) => {
   const now = new Date();
   return prisma.todo.findMany({
    where: {
      userId,
      dueDate: {
        lt: now,
      },
      isCompleted: false
    },
  });
};

const getTodosByCategory = async (userId, categoryId) => {
    return prisma.todo.findMany({
        where: {
            userId,
            categoryId
        }
    })
}


module.exports = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  getTodayTodos,
  getDueTodos,
  getTodosByCategory
};