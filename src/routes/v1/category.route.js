const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const categoryValidation = require('../../validations/category.validation');
const categoryController = require('../../controllers/category.controller');

const router = express.Router();

router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Gestión de Categorías
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crear una categoría
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - color
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Creado
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: No autorizado
 */
router
  .route('/')
  .post(validate(categoryValidation.createCategory), categoryController.createCategory)
  .get(categoryController.getCategories);

/**
 * @swagger
 * /categories/{categoryId}:
 *   get:
 *     summary: Obtener una categoría
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: No encontrado
 *   put:
 *     summary: Actualizar una categoría
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Solicitud incorrecta
 *       404:
 *         description: No encontrado
 *   delete:
 *     summary: Eliminar una categoría
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Sin contenido
 *       404:
 *         description: No encontrado
 */
router
  .route('/:categoryId')
  .get(validate(categoryValidation.getCategory), categoryController.getCategory)
  .put(validate(categoryValidation.updateCategory), categoryController.updateCategory)
  .delete(validate(categoryValidation.deleteCategory), categoryController.deleteCategory);

module.exports = router;