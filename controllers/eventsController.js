// reqs 
const mongoose = require("mongoose");
const express = require("express");
const Event = require("../models/event");
const User = require("../models/user");
const router = express.Router();
const passport = require("passport");
const httpStatus = require("http-status-codes");

// gets params
const getEventParams = (body) => {
    return {
        title: body.title,
        description: body.description,
        location: body.location,
        startDate: body.startDate,
        endDate: body.endDate,
        isOnline: body.isOnline,
        registrationLink: body.registrationLink,
        organizer: body.organizer,
        attendees: body.attendees,
    };
};
// exporting everything 
module.exports = {
    // gettings all events
    getAllEvents: (req, res, next) => {
        Event.find()
            .then((events) => {
                req.data = events;
                next();
            })
            .catch((error) => {
                if (error) {
                    next(error);
                }
            });
    },
    // getting events page
    getEventsPage: (req, res) => {
        res.render("events");
    },
    // showing all events
    index: (req, res, next) => {
        Event.find({})
            .populate("organizer")
            .populate("attendees")
            .then((events) => {
                res.locals.events = events;
                next();
            })
            // Event.find()
            //     .then((events) => {
            //         res.locals.events = events;
            //         next();
            //     })
            .catch((error) => {
                console.log(`Error fetching events: ${error.message}`);
                next(error);
            });
    },
    // returns an index of the events in a table format or the events in JSON format
    indexView: (req, res) => {
        if (req.query.format === "json") {
            res.json(res.locals.events);
        } else {
            res.render("events/index");
        }
    },
    // getting new events page
    new: (req, res) => {
        res.render("events/new");
    },
    // creating new events
    create: (req, res, next) => {
        let eventParams = getEventParams(req.body);
        //this assigns the organizer to be the User that is logged in and creating the event
        eventParams.organizer = res.locals.currentUser._id;
        console.log(eventParams);

        Event.create(eventParams)
            .then((event) => {
                req.flash(
                    "success",
                    `${event.title} created successfully!`
                );
                // console.log(eventParams);
                res.locals.redirect = "/events";
                res.locals.event = event;
                console.log(event);
                next();
            })
            .catch((error) => {
                console.log(`Error creating event: ${error.message}`);
                res.locals.redirect = "/events/new";
                req.flash(
                    "error",
                    `Failed to create the event because: ${error.message}`
                );
                res.locals.redirect = "/events/new";
                next();
            });
    },
    // redirects the view post action
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },
    // shows the details of a specific event
    show: (req, res, next) => {
        let eventId = req.params.id;
        Event.findById(eventId)
            .populate("organizer")
            .populate("attendees")
            .exec()
            .then((event) => {
                console.log(event);
                res.locals.event = event;
                next();
            })
            .catch((error) => {
                console.log(`Error fetching event by ID: ${error.message}`);
                next(error);
            });
    },
    showView: (req, res) => {
        res.render("events/show");
    },
    // edit: (req, res, next) => {
    //     let eventId = req.params.id;
    //     let eventEditting = Event.findById(eventId);
    //     let eventParams = getEventParams(req.body); //trying res instead of req
    //     // eventParams.organizer = res.locals.currentUser._id;
    //     if(req.user.isAdmin || req.user._id.equals(eventParams.organizer)) {
    //         Event.findById(eventId)
    //         .then((event) => {
    //             res.render("events/edit", {
    //                 event: event,
    //             });
    //         })
    //         .catch((error) => {
    //             console.log(`Error fetching event by ID: ${error.message}`);
    //             next(error);
    //         });
    //     } else {
    //         console.log(eventEditting.organizer);
    //         console.log(eventParams.organizer);    // this is undefined
    //         console.log(req.user._id);   // this is email's id
    //         req.flash("error", "You must have created this event!");
    //         res.redirect('/');
    //     }

    // },

    // edit: (req, res, next) => {
    //     let eventId = req.params.id;
    //     Event.findById(eventId)
    //     .then((event) => {
    //         if(req.user.isAdmin || req.user._id.equals(req.params.organizer)) {
    //             // Event.findById(eventId)
    //             // .then((event) => {
    //                 res.render("events/edit", {
    //                     event: event,
    //                 });
    //             // })
    //             // .catch((error) => {
    //                 console.log(`Error fetching event by ID: ${error.message}`);
    //                 next(error);
    //             // });
    //         } else {
    //             console.log(req.params.organizer);    // this is undefined
    //             console.log(req.user._id);   // this is email's id 
    //             req.flash("error", "You must have created this event!");
    //             res.redirect('/');
    //         }
    //     })
    //     .catch((error) => {
    //         console.log(`Error fetching event by ID: ${error.message}`);
    //         next(error);
    //     });

    // },

    // editing the event
    edit: (req, res, next) => {
        let eventId = req.params.id;
        Event.findById(eventId)
            .then((event) => {
                if (req.user.isAdmin || req.user._id.equals(event.organizer)) {
                    // console.log(event.organizer);
                    // console.log(req.user._id);

                    res.render("events/edit", {
                        event: event,
                    });
                }
                else {
                    // console.log(event.organizer);
                    // console.log(req.user._id);

                    req.flash("error", "You must have created this event!");
                    res.redirect('/');
                }

            })
            .catch((error) => {
                console.log(`Error fetching event by ID: ${error.message}`);
                next(error);
            });
    },
    // updating the edits to show on the event
    update: (req, res, next) => {
        let eventId = req.params.id,
            eventParams = getEventParams(req.body);
        Event.findByIdAndUpdate(eventId, {
            $set: eventParams,
        })
            .then((event) => {
                res.locals.redirect = `/events/${eventId}`;
                res.locals.event = event;
                next();
            })
            .catch((error) => {
                console.log(`Error updating event by ID: ${error.message}`);
                next(error);
            });
    },
    // deleting an event
    delete: (req, res, next) => {
        let eventId = req.params.id;
        Event.findByIdAndDelete(req.params.id)
            .then(() => {
                res.locals.redirect = "/events";
                next();
            })
            .catch((error) => {
                console.log(`Error deleting event by ID: ${error.message}`);
                next();
            });
    },
    // register form 
    register: (req, res) => {
        res.render("events/register");
    },
    // registering to attend an event
    attend: (req, res, next) => {
        let eventId = req.params.id;
        Event.findByIdAndUpdate(req.params.id, {
            // $addToSet: { attendees: currentUser._id },
            $addToSet: { attendees: res.locals.currentUser._id },
        },
        ).then((event) => {
            req.flash(
                "success",
                `Registered for ${event.title} successfully!`
            );
            res.locals.redirect = `/events`;
            next();
        }).catch((error) => {
            console.log(`Error : ${error.message}`);
            next(error);
        });
    },
    // validating the event
    validate: (req, res, next) => {
        req.check("title", "title cannot be empty").notEmpty();
        req
            .check("description", "description can not be empty")
            .notEmpty();
        req
            .check("location", "location can not be empty")
            .notEmpty();
        req
            .check("startDate", "start date can not be empty")
            .notEmpty();
        req
            .check("endDate", "end date can not be empty")
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
    // responding in JSON format
    respondJSON: (req, res) => {
        res.json({
            status: httpStatus.OK,
            data: res.locals,
        });
    },
    errorJSON: (error, req, res, next) => {
        let errorObject;
        if (error) {
            errorObject = {
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: error.message,
            };
        } else {
            errorObject = {
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: "Unknown Error.",
            };
        }
        res.json(errorObject);
    },
    join: (req, res, next) => {
        let eventId = req.params.id,
            currentUser = req.user;
        if (currentUser) {
            User.findByIdAndUpdate(currentUser, {
                $addToSet: {		//$addtoSet method ensures that the array of events has no duplicate IDs
                    events: eventId,
                },
            })
                .then(() => {
                    res.locals.success = true;
                    next();
                })
                .catch((error) => {
                    next(error);
                });
        } else {
            next(new Error("User must log in."));
        }
    },


    // join: (req, res, next) => {
    //     let eventId = req.params.id;
    //     // currentUser = req.user;
    //     // if (currentUser) {
    //     User.findByIdAndUpdate(currentUser, {
    //         $addToSet: {
    //             events: eventId,
    //         },
    //     })
    //         .then(() => {
    //             res.locals.success = true;
    //             next();
    //         })
    //         .catch((error) => {
    //             next(error);
    //         });
    //     // } else {
    //     // next(new Error("User must log in."));
    //     // }
    // },

    filterUserEvents: (req, res, next) => {
        // Get the current user from res.locals
        let currentUser = res.locals.currentUser;
        // Check if there is a current user
        if (currentUser) {
            // Map through the events in res.locals
            let mappedEvents = res.locals.events.map((event) => {
                // Check if the current user has joined the event
                let userJoined = currentUser.events.some((userEvent) => {
                    return userEvent.equals(event._id);
                });
                // Add a 'joined' property to the event object indicating whether the user has joined
                return Object.assign(event.toObject(), { joined: userJoined });
            });
            // Update res.locals.events with the mapped events
            res.locals.events = mappedEvents;
            // Continue to the next middleware
            next();
        } else {
            // If there is no current user, continue to the next middleware
            next();
        }
    },
    // isOrganizer: (req, res, next) => {
    //     let eventId = req.params.id,
    //         eventParams = getEventParams(req.body);
    //     // console.log(res.locals.currentUser.id);
    //     if (eventParams.organizer == res.locals.currentUser.id) {
    //         req.flash("success", "good job");
    //     } else {
    //         req.flash("error", "You must have created this event!");
    //         res.redirect('/');
    //     }


    // let currentUser = res.locals.currentUser;
    // let eventOrganizer = req.params.organizer;
    // // enters this all the time 
    // if (eventOrganizer != res.locals.currentUser.id) {
    //     console.log(req.params.organizer); //65722c6866821c83e70fa32f = eventID 
    //     req.flash("error", "You must have created this event!");
    //     res.redirect('/');
    // } else {
    //     console.log(res.locals.currentUser)
    //     // comes into this, doesn't go into the if statement
    //     next();
    // }
    // console.log(eventId.organizer);


    // Event.findById(eventId)
    //     .then((event) => {
    //         if (eventId.organizer =! res.locals.currentUser._id) {
    //             req.flash("error", "You must have created this event!");
    //             res.redirect('/');
    //         } else {
    //             next();
    //         }
    //     })
    //     .catch((error) => {
    //         console.log(`Error fetching event by ID: ${error.message}`);
    //         next(error);
    //     });

    // },
}