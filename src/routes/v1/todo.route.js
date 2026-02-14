const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const todoValidation = require('../../validations/todo.validation');
const todoController = require('../../controllers/todo.controller');

const router = express.Router();

router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Gestión de Todos
 */

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Crear un todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               categoryId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Creado
 *       400:
 *         description: Solicitud incorrecta
 *   get:
 *     summary: Obtener todos los todos
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router
  .route('/')
  .post(validate(todoValidation.createTodo), todoController.createTodo)
  .get(todoController.getTodos);

/**
 * @swagger
 * /todos/today:
 *   get:
 *     summary: Obtener todos para hoy
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/today', todoController.getTodayTodos);

/**
 * @swagger
 * /todos/due:
 *   get:
 *     summary: Obtener todos vencidos
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/due', todoController.getDueTodos);

/**
 * @swagger
 * /todos/category/{categoryId}:
 *   get:
 *     summary: Obtener todos por categoría
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/category/:categoryId', validate(todoValidation.getByCategory), todoController.getTodosByCategory);

/**
 * @swagger
 * /todos/{todoId}:
 *   get:
 *     summary: Obtener un todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: todoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: No encontrado
 *   put:
 *     summary: Actualizar un todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: todoId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               isCompleted:
 *                 type: boolean
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: No encontrado
 *   delete:
 *     summary: Eliminar un todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: todoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Sin contenido
 *       404:
 *         description: No encontrado
 */
router
  .route('/:todoId')
  .get(validate(todoValidation.getTodo), todoController.getTodo)
  .put(validate(todoValidation.updateTodo), todoController.updateTodo)
  .delete(validate(todoValidation.deleteTodo), todoController.deleteTodo);

module.exports = router;