const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController')
/**
 * @swagger
 * /signup:
 *    post:
 *       summary: Register a new user
 *       tags: [Auth]
 *       description: Register a new user
 *       responses:
 *          201:
 *             description: User registered successfully
 *          400:
 *             description: Validation error
 *          500:
 *             description: Internal server error
 */
router.post('/signup', authController.signup)
/**
 * @swagger
 * /login:
 *    post:
 *       summary: Login to the application
 *       tags: [Auth]
 *       description: Login to the application
 *       responses:
 *          200:
 *             description: User Login successfully
 *          400:
 *             description: Validation error
 *          500:
 *             description: Internal server error
 */
router.post('/login', authController.login)
/**
 * @swagger
 * /logout:
 *    post:
 *       summary: Logut from the application
 *       tags: [Auth]
 *       description: Logut from the application
 *       responses:
 *          200:
 *             description: User Logut successfully
 *          400:
 *             description: Validation error
 *          500:
 *             description: Internal server error
 */
router.post('/logout', authController.logout)



module.exports = router

