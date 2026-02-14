const httpStatus = require('http-status').status;
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');

const register = catchAsync(async (req, res) => {
  const { user, tokens } = await authService.register(req.body);
  // Remove password from response
  const { password, ...userWithoutPassword } = user;
  res.status(httpStatus.CREATED).send({ user: userWithoutPassword, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, tokens } = await authService.login(email, password);
  const { password: userPassword, ...userWithoutPassword } = user;
  res.send({ user: userWithoutPassword, tokens });
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

module.exports = {
  register,
  login,
  refreshTokens,
};