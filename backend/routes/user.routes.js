const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { body } = require("express-validator");

// Route to register a new user

router.post(
  "/register",
  [
    body("fullName.firstName")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),
    body("fullName.lastName")
      .isLength({ min: 3 })
      .withMessage("Last name must be at least 3 characters long"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    body("password")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,}$/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    body("address")
      .isLength({ min: 5 })
      .withMessage("Address must be at least 5 characters long"),
  ],
  userController.registerUser
);

// route to login a user
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  userController.loginUser
);
// Route to get all users
router.get("/", userController.getAllUsers);
// Route to get a user by ID
router.get("/:id", userController.getUserById);
// Route to update a user by ID
router.put(
  "/:id",
  [
    body("fullName.firstName")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),
    body("fullName.lastName")
      .isLength({ min: 3 })
      .withMessage("Last name must be at least 3 characters long"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    body("password")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,}$/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    body("address")
      .isLength({ min: 5 })
      .withMessage("Address must be at least 5 characters long"),
  ],
  userController.updateUserById
);
// Route to delete a user by ID
router.delete("/:id", userController.deleteUserById);
// Route to to get all deleted users
router.get("/deleted", userController.getDeletedUsers);

// Route to get all users with a specific role
router.get("/role/:role", userController.getUsersByRole);

module.exports = router;
