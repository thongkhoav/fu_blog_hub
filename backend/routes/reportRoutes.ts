import { getNewAccessToken } from "../controllers/userController";

const express = require("express");
const router = express.Router();
const blogController = require("../controllers/reportController");
const authController = require("./../controllers/authController");

router
  .route("/blogs")
  .get(blogController.getReportedBlogs)
  .post(blogController.reportBlog);
module.exports = router;
