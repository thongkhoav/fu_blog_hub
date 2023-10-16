import { getNewAccessToken } from "../controllers/userController";

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("./../controllers/authController");

/**
 * @swagger
 * /api/v1/users/refresh-token:
 *   get:
 *     summary: Lấy Beer token mới
 *     description: Lấy Beer token mới từ Beer token cũ và yêu cầu Beer token để xác thực.
 *     tags: [Users]
 *     security:
 *       - BeerToken: []  # Sử dụng Beer token để xác thực
 *     responses:
 *       '200':
 *         description: Beer token mới đã được tạo thành công
 *       '401':
 *         description: Không có quyền truy cập hoặc Beer token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo lỗi.
 */
router.post("/refresh-token", userController.getNewAccessToken);

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: API to manage your users.
 *
 * /api/v1/users/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     description: Đăng nhập người dùng bằng email và password.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Địa chỉ email của người dùng.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu của người dùng.
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token xác thực người dùng.
 *       '401':
 *         description: Đăng nhập thất bại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo lỗi.
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     summary: Tạo người dùng mới
 *     description: Tạo một người dùng mới bằng cách cung cấp thông tin như tên, email, mật khẩu, và vai trò.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên của người dùng.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Địa chỉ email của người dùng.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu của người dùng.
 *               passwordConfirm:
 *                 type: string
 *                 format: password
 *                 description: Xác nhận mật khẩu của người dùng.
 *               role:
 *                 type: string
 *                 enum: [user, admin]  # Nếu có danh sách các vai trò, hãy thay thế bằng danh sách thực tế.
 *                 description: Vai trò của người dùng (user hoặc admin).
 *             required:
 *               - name
 *               - email
 *               - password
 *               - passwordConfirm
 *               - role
 *     responses:
 *       '201':
 *         description: Người dùng đã được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: Thông tin của người dùng đã được tạo.
 *       '400':
 *         description: Yêu cầu không hợp lệ hoặc người dùng đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo lỗi.
 */
router.post("/signup", authController.signup);
router.get("/basic/:id", userController.getBasicProfile);

// PROTECT ALL ROUTES AFTER THIS MIDDLEWARE
router.use(authController.protect);

router.post(
  "/mentor",
  authController.restrictTo("admin"),
  authController.addMentorAccount
);
/**
 * @swagger
 * /api/v1/users/deleteMe:
 *   delete:
 *     summary: Xóa người dùng hiện tại
 *     description: Xóa người dùng hiện tại và yêu cầu Beer token để xác thực.
 *     tags: [Users]
 *     security:
 *       - BeerToken: []  # Sử dụng Beer token để xác thực
 *     responses:
 *       '204':
 *         description: Người dùng đã được xóa thành công
 *       '401':
 *         description: Không có quyền truy cập hoặc Beer token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo lỗi.
 */
router.delete("/deleteMe", userController.deleteMe);
router.route("/bookmark").get(userController.getUserBookmark);

router.route("/followings").get(userController.getUserFollowings);
router.route("/followers").get(userController.getUserFollowers);
router.route("/:followUserId/follow").post(userController.followUser);
router.route("/:followUserId/unfollow").delete(userController.unFollowUser);

// Only admin have permission to access for the below APIs
router.use(authController.restrictTo("admin"));
router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
