const express = require('express');
const router = express.Router();
const {createGoogleLogin} = require('../controller/googleSignInController');

/**
 * @swagger
 * components:
 *   schemas:
 *     GoogleLogin:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: Google ID token received from the frontend after successful Google login
 */

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Google login authentication
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleLogin'
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User authenticated"
 *                 user:
 *                   type: object
 *                   properties:
 *                     google_id:
 *                       type: string
 *                       description: Google ID of the user
 *                     email:
 *                       type: string
 *                       description: Email of the user
 *                     name:
 *                       type: string
 *                       description: Name of the user
 *       201:
 *         description: New user created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created"
 *                 user:
 *                   type: object
 *                   properties:
 *                     google_id:
 *                       type: string
 *                       description: Google ID of the user
 *                     email:
 *                       type: string
 *                       description: Email of the user
 *                     name:
 *                       type: string
 *                       description: Name of the user
 *       400:
 *         description: Invalid token or error verifying Google token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid token"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.post('/', createGoogleLogin)


module.exports = router;