const router = require("express").Router();

const errorRoutes = require("./errorRoutes");
const eventsRoutes = require("./eventsRoutes");
const homeRoutes = require("./homeRoutes");
const jobsRoutes = require("./jobsRoutes");
const userRoutes = require("./userRoutes");
const apiRoutes = require("./apiRoutes");

router.use("/api", apiRoutes);
router.use("/events", eventsRoutes)
router.use("/jobs", jobsRoutes);
router.use("/users", userRoutes);
router.use("/", homeRoutes);

router.use("/", errorRoutes);

module.exports = router; 