const bcrypt = require('bcryptjs');
const httpStatus = require('http-status').status;
const prisma = require('../utils/prisma');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/token');
const AppError = require('../utils/AppError');

const register = async (userBody) => {
  if (await prisma.user.findUnique({ where: { email: userBody.email } })) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const hashedPassword = await bcrypt.hash(userBody.password, 8);
  const user = await prisma.user.create({
    data: {
      email: userBody.email,
      password: hashedPassword,
      name: userBody.name,
    },
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + process.env.JWT_REFRESH_EXPIRATION_DAYS * 24 * 60 * 60 * 1000),
    },
  });

  return { user, tokens: { access: accessToken, refresh: refreshToken } };
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  if (!user.isActive) {
      throw new AppError(httpStatus.FORBIDDEN, 'User account is deactivated');
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = await generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + process.env.JWT_REFRESH_EXPIRATION_DAYS * 24 * 60 * 60 * 1000),
    },
  });

  return { user, tokens: { access: accessToken, refresh: refreshToken } };
};

const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await prisma.refreshToken.findUnique({
      where: { token: refreshToken, revoked: false },
    });

    if (!refreshTokenDoc) {
      throw new Error();
    }
    
    // Check if expired
    if (new Date() > refreshTokenDoc.expiresAt) {
         throw new Error();
    }

    const payload = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (payload.userId !== refreshTokenDoc.userId) {
       throw new Error();
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      throw new Error();
    }

    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = await generateRefreshToken(user.id);
    
    // Revoke old token and save new one
    await prisma.refreshToken.update({
        where: { id: refreshTokenDoc.id },
        data: { revoked: true }
    });
    
    await prisma.refreshToken.create({
        data: {
            token: newRefreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + process.env.JWT_REFRESH_EXPIRATION_DAYS * 24 * 60 * 60 * 1000),
        }
    });

    return { access: newAccessToken, refresh: newRefreshToken };
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

module.exports = {
  register,
  login,
  refreshAuth,
};