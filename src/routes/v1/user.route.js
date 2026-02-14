const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.use(auth);

router.post('/me/password', validate(userValidation.updatePassword), userController.updatePassword);
router.delete('/me', userController.deleteUser);
router.patch('/me', validate(userValidation.updateUser), userController.updateUser);
router.patch('/me/reactivate', userController.reactivateUser);
router.patch('/me/deactivate', userController.deactivateUser);

module.exports = router;