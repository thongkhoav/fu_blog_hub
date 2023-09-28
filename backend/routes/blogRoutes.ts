import {getNewAccessToken} from "../controllers/userController";

const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authController = require('./../controllers/authController');

// Protect all routes after this middleware
router.use(authController.protect);

/**
 * @swagger
 * tags:
 *  name: Blogs
 *  description: API to manage your blogs.
 *
 * /api/v1/blogs:
 *   post:
 *     summary: Create a new resource
 *     description: Create a new resource with the provided data.
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               description:
 *                 type: string
 *               contentRaw:
 *                 type: string
 *               blogSeriesId:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Resource created successfully.
 *       '400':
 *         description: Bad request, check your input data.
 */
router.route('/')
    .post(blogController.createBlog);

module.exports = router;