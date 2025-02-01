const express = require("express");
const {
  shortenURL,
  redirectToLongUrl,
  analyseUserDetails,
  getAnalytics,
} = require("../controller/shortenUrlController");

const {
  shortenUrlLimiter,
} = require("../controller/rateLimit");

const {
  getUrlAnalyticsAPI,
} = require("../controller/getUrlAnalyticsAPI");

const {analysisTopic} = require("../controller/getTopicAnalysis")
const router = express.Router();

// if you post more than 10 times you will get error message using rateLimit
// error 429 Too Many Requests (that is shortenUrlLimiter works)

/**
 * @swagger
 * /api/createShortUrl:
 *   post:
 *     summary: Create a new shortened URL
 *     tags: [Shorten URL]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 example: "https://example.com"
 *               customAlias:
 *                 type: string
 *                 example: "short123"
 *               topic:
 *                 type: string
 *                 example: "technology"
 *               expiryTime:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       201:
 *         description: URL successfully shortened
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   example: "https://short.ly/short123"
 *       500:
 *         description: Internal server error
 */
router.post("/createShortUrl", shortenUrlLimiter, shortenURL);

/**
 * @swagger
 * /api/redirectLongUrl/{alias}:
 *   get:
 *     summary: Redirect to the original long URL
 *     tags: [Shorten URL]
 *     parameters:
 *       - name: alias
 *         in: path
 *         required: true
 *         description: The alias of the short URL
 *         schema:
 *           type: string
 *           example: "short123"
 *     responses:
 *       302:
 *         description: Redirect to the long URL
 *       404:
 *         description: Short URL not found
 *       410:
 *         description: Short URL has expired
 */
router.get("/redirectLongUrl/:alias", redirectToLongUrl);
/**
 * @swagger
 * /api/analyseUserDetails/{alias}:
 *   get:
 *     summary: Analyze and log user details (IP, device, OS) for a short URL
 *     tags: [Analytics]
 *     parameters:
 *       - name: alias
 *         in: path
 *         required: true
 *         description: The alias for the short URL
 *         schema:
 *           type: string
 *           example: "short123"
 *     responses:
 *       200:
 *         description: User details successfully logged
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User details logged successfully"
 *                 analytics:
 *                   type: object
 *                   properties:
 *                     shortUrl:
 *                       type: string
 *                       example: "https://short.ly/short123"
 *                     userAgent:
 *                       type: string
 *                       example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
 *                     ipAddress:
 *                       type: string
 *                       example: "192.168.1.1"
 *                     deviceType:
 *                       type: string
 *                       example: "desktop"
 *                     osType:
 *                       type: string
 *                       example: "Windows 10"
 *       404:
 *         description: Alias not found
 *       500:
 *         description: Internal server error
 */
router.get("/analyseUserDetails/:alias", analyseUserDetails);
/**
 * @swagger
 * /api/getAnalytics/{alias}:
 *   get:
 *     summary: Get analytics for a short URL alias
 *     tags: [Analytics]
 *     parameters:
 *       - name: alias
 *         in: path
 *         required: true
 *         description: The alias for the short URL
 *         schema:
 *           type: string
 *           example: "short123"
 *     responses:
 *       200:
 *         description: Analytics for the short URL
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Analytics'
 *       404:
 *         description: Alias not found
 *       500:
 *         description: Internal server error
 */
router.get("/getAnalytics/:alias", getAnalytics);
/**
 * @swagger
 * /api/analytics/{alias}:
 *   get:
 *     summary: Get analytics for a short URL alias
 *     tags: [Analytics]
 *     parameters:
 *       - name: alias
 *         in: path
 *         required: true
 *         description: The alias for the short URL
 *         schema:
 *           type: string
 *           example: "short123"
 *     responses:
 *       200:
 *         description: Analytics for the short URL
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Analytics'
 *       404:
 *         description: Alias not found
 *       500:
 *         description: Internal server error
 */
router.get("/analytics/:alias", getUrlAnalyticsAPI);
/**
 * @swagger
 * /api/analytics/topic/{topic}:
 *   get:
 *     summary: Get analytics for a specific topic
 *     tags: [Topic Analytics]
 *     parameters:
 *       - name: topic
 *         in: path
 *         required: true
 *         description: The topic to retrieve analytics for
 *         schema:
 *           type: string
 *           example: "technology"
 *     responses:
 *       200:
 *         description: Topic analytics
 *         content:
 *           application/json:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   example: "https://short.ly/short123"
 *                 clickCount:
 *                   type: integer
 *                   example: 120
 *                 uniqueUsers:
 *                   type: integer
 *                   example: 100
 *       404:
 *         description: No data found for this topic
 *       500:
 *         description: Internal server error
 */
router.get("/analytics/topic/:topic",analysisTopic);

module.exports = router;
