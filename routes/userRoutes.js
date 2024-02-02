// importing required imports
const router = require("express").Router();
const usersController = require("../controllers/usersController");

// logging in
router.get("/login", usersController.login);
router.post("/login", usersController.authenticate);
// logging out
router.get("/logout", usersController.logout, usersController.redirectView);
router.get("/", usersController.index, usersController.indexView);
// creating a new user
router.get("/new", usersController.new);
router.post(
  "/create",
  usersController.validate,
  usersController.create,
  usersController.redirectView
);
// looking at user detailts
router.get("/:id", usersController.isLoggedIn, usersController.show, usersController.showView);
// editing user details
router.get("/:id/edit", usersController.isLoggedIn, usersController.edit);
router.put("/:id/update", usersController.isLoggedIn, usersController.update, usersController.redirectView);
// deleting a user 
router.delete(
  "/:id/delete",
  usersController.isLoggedIn,
  usersController.isAdmin,
  usersController.delete,
  usersController.redirectView
);

// exporting
module.exports = router;
