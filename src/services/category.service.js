const prisma = require('../utils/prisma');
const httpStatus = require('http-status').status;
const AppError = require('../utils/AppError');

const createCategory = async (userId, categoryBody) => {
    // Check uniqueness
    const existing = await prisma.category.findUnique({
        where: {
            name_userId: {
                name: categoryBody.name,
                userId
            }
        }
    });

    if (existing) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Category already exists');
    }

  return prisma.category.create({
    data: {
      ...categoryBody,
      userId,
    },
  });
};

const getCategories = async (userId) => {
  return prisma.category.findMany({
    where: {
      userId,
    },
  });
};

const getCategoryById = async (userId, categoryId) => {
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId,
    },
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return category;
};

const updateCategory = async (userId, categoryId, updateBody) => {
  const category = await getCategoryById(userId, categoryId);
  return prisma.category.update({
    where: { id: category.id },
    data: updateBody,
  });
};

const deleteCategory = async (userId, categoryId) => {
  const category = await getCategoryById(userId, categoryId);
  return prisma.category.delete({
    where: { id: category.id },
  });
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};