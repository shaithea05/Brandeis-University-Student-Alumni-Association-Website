const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const passportLocalMongoose = require("passport-local-mongoose");

const eventSchema = Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        isOnline: {
            type: Boolean,
            default: false,
        },
        registrationLink: {
            type: String,
        },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        // represent an event with many users
        // storing user IDs in event documents to rep attendees coming
    }
);

// eventSchema.plugin(passportLocalMongoose, { usernameField: "title" });

module.exports = mongoose.model("Event", eventSchema);

