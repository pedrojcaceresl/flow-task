const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de Usuarios
 */

/**
 * @swagger
 * /users/me/password:
 *   post:
 *     summary: Actualizar contraseña
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *     responses:
 *       204:
 *         description: Sin contenido
 *       400:
 *         description: Solicitud incorrecta
 */
router.post('/me/password', validate(userValidation.updatePassword), userController.updatePassword);

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Sin contenido
 *   patch:
 *     summary: Actualizar detalles del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OK
 */
router.delete('/me', userController.deleteUser);
router.patch('/me', validate(userValidation.updateUser), userController.updateUser);

/**
 * @swagger
 * /users/me/reactivate:
 *   patch:
 *     summary: Reactivar usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.patch('/me/reactivate', userController.reactivateUser);

/**
 * @swagger
 * /users/me/deactivate:
 *   patch:
 *     summary: Desactivar usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.patch('/me/deactivate', userController.deactivateUser);

module.exports = router;