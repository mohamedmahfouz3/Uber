const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { validation } = require("express-validator");
const userController = require("../controllers/user.controller");

// Route to register a new user

router.post(
  "/register",
  [
    validation("fullName.firstName")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),
    validation("fullName.lastName")
      .isLength({ min: 3 })
      .withMessage("Last name must be at least 3 characters long"),
    validation("email").isEmail().withMessage("Invalid email format"),
    validation("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    validation("password")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,}$/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    validation("address")
      .isLength({ min: 5 })
      .withMessage("Address must be at least 5 characters long"),
  ],
  userController.registerUser
);

// route to login a user
router.post(
  "/login",
  [
    validation("email").isEmail().withMessage("Invalid email format"),
    validation("password")
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
    validation("fullName.firstName")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),
    validation("fullName.lastName")
      .isLength({ min: 3 })
      .withMessage("Last name must be at least 3 characters long"),
    validation("email").isEmail().withMessage("Invalid email format"),
    validation("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    validation("password")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,}$/)
      .withMessage(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    validation("address")
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
