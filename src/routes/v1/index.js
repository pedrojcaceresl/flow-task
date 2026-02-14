const express = require('express');
const authRoute = require('./auth.route');
const todoRoute = require('./todo.route');
const categoryRoute = require('./category.route');
const userRoute = require('./user.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/todos', todoRoute);
router.use('/categories', categoryRoute);
router.use('/users', userRoute);

module.exports = router;