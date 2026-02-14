const { z } = require('zod');

const createTodo = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    dueDate: z.string().datetime().optional().transform(str => str ? new Date(str) : undefined),
    categoryId: z.number().int().optional(),
    isCompleted: z.boolean().optional(),
  }),
});

const getTodo = z.object({
  params: z.object({
    todoId: z.string().transform((val) => parseInt(val, 10)),
  }),
});

const updateTodo = z.object({
  params: z.object({
    todoId: z.string().transform((val) => parseInt(val, 10)),
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    dueDate: z.string().datetime().optional().transform(str => str ? new Date(str) : undefined),
    categoryId: z.number().int().optional(),
    isCompleted: z.boolean().optional(),
  }),
});

const deleteTodo = z.object({
  params: z.object({
    todoId: z.string().transform((val) => parseInt(val, 10)),
  }),
});

const getByCategory = z.object({
    params: z.object({
        categoryId: z.string().transform((val) => parseInt(val, 10)),
    }),
});

module.exports = {
  createTodo,
  getTodo,
  updateTodo,
  deleteTodo,
  getByCategory
};