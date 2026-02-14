const { z } = require('zod');

const createCategory = z.object({
  body: z.object({
    name: z.string().min(1),
  }),
});

const getCategory = z.object({
  params: z.object({
    categoryId: z.string().transform((val) => parseInt(val, 10)),
  }),
});

const updateCategory = z.object({
  params: z.object({
    categoryId: z.string().transform((val) => parseInt(val, 10)),
  }),
  body: z.object({
    name: z.string().min(1),
  }),
});

const deleteCategory = z.object({
  params: z.object({
    categoryId: z.string().transform((val) => parseInt(val, 10)),
  }),
});

module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};