const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController')

/**
 * @swagger
 * /user/:id:
 *    get:
 *       summary: get user by id
 *       tags: [Users]
 *       description: get user by id
 * 
 *       responses:
 *          200:
 *             description: User data is listed
 *             content:
 *                application/json:
 *                   schema:
 *                      type: object
 *                      $ref: '#/components/schemas/User'
 *          400:
 *             description: Validation error
 *          500:
 *             description: Internal server error
 */

router.get('/user/:id', userController.getUserById)

/**
 * @swagger
 * components:
 *    schema:
 *       User:
 *           type: object 
 *           properties:
 *               _id:
 *                   type: mongodb object id
 *               name:
 *                   type: string
 *               email:
 *                   type: string
 *               userName:
 *                   type: string
 */

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 *                items:
 *                   $ref: '#/components/schemas/User'
 */
router.get('/users', userController.getAllUsers);

module.exports = router
