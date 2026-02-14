const jwt = require('jsonwebtoken');
const httpStatus = require('http-status').status;
const prisma = require('../utils/prisma');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Please authenticate' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });

      if (!user || !user.isActive) {
        throw new Error();
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = auth;