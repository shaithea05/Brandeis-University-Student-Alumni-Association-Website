const router = require("express").Router();
const jobsController = require("../controllers/jobsController");
const usersController = require("../controllers/usersController");

router.get("/", jobsController.index, jobsController.indexView);
router.get("/new", usersController.isLoggedIn, jobsController.new);
router.post(
    "/create",
    usersController.isLoggedIn,
    jobsController.validate,
    jobsController.create,
    jobsController.redirectView
);
router.get("/:id", usersController.isLoggedIn, jobsController.show, jobsController.showView);
router.get(
    "/:id/edit",
    usersController.isLoggedIn,
    jobsController.edit
);
router.put(
    "/:id/update",
    jobsController.update,
    jobsController.redirectView
);
router.delete(
    "/:id/delete",
    usersController.isLoggedIn,
    usersController.isAdmin,
    jobsController.delete,
    jobsController.redirectView
);

module.exports = router;