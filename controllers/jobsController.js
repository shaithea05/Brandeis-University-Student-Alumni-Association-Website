// reqs
const mongoose = require("mongoose");
const Job = require("../models/job");
const passport = require("passport");
const job = require("../models/job");

// Job Parameters
const getJobParams = (body) => {
    return {
        title: body.title,
        company: body.company,
        location: body.location,
        description: body.description,
        requirements: body.requirements,
        salary: body.salary,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        postDate: body.postDate,
        deadlineDate: body.deadlineDate,
        isActive: body.isActive,
        organizer: body.organizer,
    };
};

// exporting everything
module.exports = {
    // getting all jobs 
    getAllJobs: (req, res, next) => {
        Job.find()
            .then((jobs) => {
                req.data = jobs;
                next();
            })
            .catch((error) => {
                if (error) {
                    next(error);
                }
            });
    },
    // showing all the jobs in a table 
    index: (req, res, next) => {
        Job.find()
            .then((jobs) => {
                res.locals.jobs = jobs;
                next();
            })
            .catch((error) => {
                console.log(`Error fetching jobs: ${error.message}`);
                next(error);
            });
    },
    // going to the indexview to see the table of jobs 
    indexView: (req, res) => {
        res.render("jobs/index");
    },
    // going to create a new job
    new: (req, res) => {
        res.render("jobs/new");
    },
    // creating a new job
    create: (req, res, next) => {
        let jobParams = getJobParams(req.body);
        // console.log(jobParams);

        jobParams.organizer = res.locals.currentUser._id;
        Job.create(jobParams)
            .then((job) => {
                req.flash(
                    "success",
                    `${job.title} created successfully!`
                );
                res.locals.redirect = "/jobs";
                res.locals.job = job;
                next();
            })
            .catch((error) => {
                console.log(`Error creating job: ${error.message}`);
                res.locals.redirect = "/jobs/new";
                req.flash(
                    "error",
                    `Failed to create the job because: ${error.message}`
                );
                res.locals.redirect("/jobs/new");
                next();
            });
    },
    // validating the new job
    validate: (req, res, next) => {
        req
            .check("title", "title cannot be empty")
            .notEmpty();
        req
            .check("company", "company can not be empty")
            .notEmpty();
        req
            .check("location", "location can not be empty")
            .notEmpty();
        req
            .check("description", "description can not be empty")
            .notEmpty();
        req
            .check("requirements", "requirements can not be empty")
            .notEmpty();
        req
            .check("salary", "description can not be empty")
            .notEmpty();
        req
            .check("contactEmail", "contact email can not be empty")
            .notEmpty();
        req
            .check("contactPhone", "contact phone can not be empty")
            .notEmpty();
        req
            .check("postDate", "post date can not be empty")
            .notEmpty();
        req
            .check("deadlineDate", "deadline date can not be empty")
            .notEmpty();

        req.getValidationResult().then((error) => {
            if (!error.isEmpty()) {
                let messages = error.array().map((e) => e.msg);
                req.skip = true;
                req.flash("error", messages.join(" and "));
                res.locals.redirect = "/events/new";
                next();
            } else {
                next();
            }
        });
    },
    // redirecting view to go to where need to 
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },
    // showing details of job
    show: (req, res, next) => {
        let jobId = req.params.id;
        Job.findById(jobId)
            .then((job) => {
                res.locals.job = job;
                next();
            })
            .catch((error) => {
                console.log(`Error fetching job by ID: ${error.message}`);
                next(error);
            });
    },
    // showing the detailed view 
    showView: (req, res) => {
        res.render("jobs/show");
    },
    // editing a job
    edit: (req, res, next) => {
        let jobId = req.params.id;
        Job.findById(jobId)
            .then((job) => {
                if (req.user.isAdmin || req.user._id.equals(job.organizer)) {
                    console.log(job.organizer);
                    console.log(req.user._id);
                    res.render("jobs/edit", {
                        job: job,
                    });
                } else {
                    console.log(job);
                    console.log(job.organizer); //undefined
                    console.log(req.user._id);

                    req.flash("error", "You must have created this job!");
                    res.redirect('/');
                }
            })
            .catch((error) => {
                console.log(`Error fetching job by ID: ${error.message}`);
                next(error);
            });
    },
    // updating the edited version of the job
    update: (req, res, next) => {

        let jobId = req.params.id,
            jobParams = getJobParams(req.body);
        Job.findByIdAndUpdate(jobId, {
            $set: jobParams,
        })
            .then((job) => {
                res.locals.redirect = `/jobs/${jobId}`;
                res.locals.job = job;
                next();
            })
            .catch((error) => {
                console.log(`Error updating job by ID: ${error.message}`);
                next(error);
            });
    },
    // deleting a job
    delete: (req, res, next) => {
        let jobId = req.params.id;
        // Job.findByIdAndRemove(jobId)
        Job.findByIdAndDelete(req.params.id)
            .then(() => {
                res.locals.redirect = "/jobs";
                next();
            })
            .catch((error) => {
                console.log(`Error deleting job by ID: ${error.message}`);
                next();
            });
    },
}