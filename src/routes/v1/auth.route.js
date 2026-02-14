const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrarse como usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: debe ser único
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: Al menos un número y una letra
 *     responses:
 *       201:
 *         description: Creado
 *       400:
 *         description: Solicitud incorrecta
 */
router.post('/register', validate(authValidation.register), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 tokens:
 *                   type: object
 *       401:
 *         description: No autorizado
 */
router.post('/login', validate(authValidation.login), authController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refrescar tokens de autenticación
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: No autorizado
 */
router.post('/refresh', validate(authValidation.refresh), authController.refreshTokens);

module.exports = router;