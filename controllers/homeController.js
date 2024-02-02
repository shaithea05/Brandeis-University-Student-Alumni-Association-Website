// reqs
const express = require("express");
const router = express.Router();

// exporting everything
module.exports = {
    // route to index page
    respondWithIndex: (req, res) => {
        res.render("index");
    },
    // route to about page
    respondWithAbout: (req, res) => {
        res.render("about");
    },
    // route to contact page
    respondWithContact: (req, res) => {
        res.render("contact");
    },
    // route to events page
    respondWithEvents: (req, res) => {
        res.render("events");
    },
    // route to jobs page
    respondWithJobs: (req, res) => {
        res.render("jobs");
    },
    // route to chat
    chat: (req, res) => {
        res.render("chat");
    },
};