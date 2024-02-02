const express = require("express");
const router = require("express").Router();
const eventsController = require("../controllers/eventsController");
const usersController = require("../controllers/usersController");

router.get("/", eventsController.index, eventsController.indexView);
router.get("/new", usersController.isLoggedIn, eventsController.new);

router.post(
    "/create",
    usersController.isLoggedIn,
    eventsController.validate,
    eventsController.create,
    eventsController.redirectView
);

router.get("/:id", usersController.isLoggedIn, eventsController.show, eventsController.showView);
router.get(
    "/:id/edit", 
    usersController.isLoggedIn, 
    eventsController.edit
);
router.put(
    "/:id/update",
    usersController.isLoggedIn,
    eventsController.update,
    eventsController.redirectView
);
router.delete(
    "/:id/delete",
    usersController.isLoggedIn,
    usersController.isAdmin,
    eventsController.delete,
    eventsController.redirectView
);

router.get(
    "/:id/register",
    usersController.isLoggedIn,
    eventsController.register,
);
router.put(
    "/:id/attend",
    usersController.isLoggedIn,
    eventsController.attend,
    eventsController.redirectView
)


module.exports = router;
