const router = require("express").Router();
const homeController = require("../controllers/homeController");

router.get("/", homeController.respondWithIndex);
router.get("/index", homeController.respondWithIndex);
router.get("/about", homeController.respondWithAbout);
router.get("/contact", homeController.respondWithContact);
router.get("/events", homeController.respondWithEvents);
router.get("/jobs", homeController.respondWithJobs);
router.get("/chat", homeController.chat);

module.exports = router;
