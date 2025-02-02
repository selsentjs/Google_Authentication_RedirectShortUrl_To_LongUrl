const express = require('express');
const router = express.Router();
const {
    register,
    login,
    logout
} = require("../controller/authController");
const verifyToken = require("../../middleware/verifyToken");

/**
 * @swagger
 * components:
 *  schemas:
 *    Register:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - password
 *        - confirmPassword
 *      properties:
 *        name:
 *          type: string
 *          description: name of the user
 *        email:
 *          type: string
 *          description: email of the user
 *        password:
 *          type: string
 *          description: password of the user
 *        confirmPassword:
 *          type: string
 *          description: confirm password
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       201:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: User logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Internal Server Error
 */
router.get("/logout", logout);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Welcome to your profile"
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       description: ID of the user
 *                     email:
 *                       type: string
 *                       description: Email of the user
 *                     name:
 *                       type: string
 *                       description: Name of the user
 *       401:
 *         description: Unauthorized, invalid or missing JWT token
 *       500:
 *         description: Internal server error
 */
router.get("/profile", verifyToken, (req, res) => {
    res.json({ msg: "Welcome to your profile", user: req.user });
});

module.exports = router;
