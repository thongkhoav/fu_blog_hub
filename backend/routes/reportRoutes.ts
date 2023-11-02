import { getNewAccessToken } from "../controllers/userController";

const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const authController = require("./../controllers/authController");

router.use(authController.protect);
router.route("/").post(reportController.reportOne);
router.put("/:id", reportController.resolveReport);

router.get("/blog/:state", reportController.getReportedBlogs);
router.get("/blog/detail/:idReport", reportController.getBlogReportDetail);

router.get("/user/:state", reportController.getReportedUsers);
router.get("/user/detail/:idUser", reportController.getUserReportDetail);
module.exports = router;
