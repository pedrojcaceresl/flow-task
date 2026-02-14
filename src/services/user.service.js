const prisma = require('../utils/prisma');
const httpStatus = require('http-status').status;
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');

const updateUser = async (userId, updateBody) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: updateBody,
  });
  return user;
};

const updatePassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 8);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
};

const deleteUser = async (userId) => {
  await prisma.user.delete({
    where: { id: userId },
  });
};

const setActivationStatus = async (userId, isActive) => {
   const user = await prisma.user.update({
       where: { id: userId },
       data: { isActive }
   });
   return user;
}

module.exports = {
  updateUser,
  updatePassword,
  deleteUser,
  setActivationStatus
};