const { z } = require('zod');

const updatePassword = z.object({
  body: z.object({
    password: z.string().min(8),
  }),
});

const updateUser = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
  }),
});

module.exports = {
  updatePassword,
  updateUser,
};