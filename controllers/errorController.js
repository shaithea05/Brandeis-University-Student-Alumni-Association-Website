// error controller
const httpStatus = require("http-status-codes");

// exporting in one step
module.exports = {
    // page not found error
    pageNotFoundError: (req, res) => {
        let errorCode = httpStatus.NOT_FOUND;
        res.status(errorCode);
        res.render("error");
    },
    // internal server error
    internalServerError: (error, req, res, next) => {
        let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
        console.log(`ERROR occurred:${error.stack}`);
        res.status(errorCode);
        res.send(`${errorCode} | Sorry, our application is taking a nap!`);
    },
};


