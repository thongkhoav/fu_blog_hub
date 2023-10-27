import { getNewAccessToken } from "../controllers/userController";

const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const authController = require("./../controllers/authController");

router.route("/").post(reportController.reportOne);
router.get("/blog/:state", reportController.getReportedBlogs);
router.get("/blog/detail/:idReport", reportController.getBlogReportDetail);
module.exports = router;
