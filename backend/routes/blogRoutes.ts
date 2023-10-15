import { getNewAccessToken } from "../controllers/userController";
import { checkBlogStatus, getOneBlog } from "../controllers/blogController";

const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const authController = require("./../controllers/authController");

router.get(
  "/:id",
  blogController.checkBlogStatus("public"),
  blogController.getOneBlog
);

// Protect all routes after this middleware
router.get(
  "/self/:id",
  authController.protect,
  authController.restrictTo("student"),
  blogController.checkBlogOwnership,
  blogController.checkBlogStatus(
    "public",
    "draft",
    "private",
    "waiting",
    "banned"
  ),
  blogController.getOneBlog
);

router.get(
  "/mentor/waiting-blogs",
  authController.protect,
  authController.restrictTo("mentor"),
  blogController.getWaitingBlogs,
);

router.get(
  "/mentor/:id",
  authController.protect,
  authController.restrictTo("mentor"),
  blogController.checkBlogStatus("waiting"),
  blogController.getOneBlog
);

router.get(
  "/admin/:id",
  authController.protect,
  authController.restrictTo("admin"),
  blogController.checkBlogStatus(
    "public",
    "draft",
    "private",
    "waiting",
    "banned",
    "removed"
  ),
  blogController.getOneBlog
);

router.patch(
  "/:id",
  authController.protect,
  blogController.checkBlogOwnership,
  authController.restrictTo("admin", "student"),
  blogController.formatUpdateData,
  blogController.updateBlog
);

router.patch(
  "/mentor/:id",
  authController.protect,
  authController.restrictTo("mentor"),
  blogController.formatMentorUpdateStatus,
  blogController.updateBlog
);

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
router.post(
  "/",
  authController.protect,
  authController.restrictTo("mentor", "student"),
  blogController.createBlog
);

module.exports = router;
