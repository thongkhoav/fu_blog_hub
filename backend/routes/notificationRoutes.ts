import { getNewAccessToken } from "../controllers/userController";
const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");
const notificationController = require("../controllers/notificationController");

router.use(authController.protect);
router.get("/",
    notificationController.getAllNotification,
)
router.get("/count",
    notificationController.getCountNotification,
)

module.exports = router;
