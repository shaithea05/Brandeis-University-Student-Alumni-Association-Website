// reqs
const mongoose = require("mongoose");
const User = require("../models/user");
const Event = require("../models/event")
const passport = require("passport");
const { isOrganizer } = require("./eventsController");
const token = process.env.TOKEN || "kitchenT0k3n";

// user parameters
const getUserParams = (body) => {
  return {
    name: body.name,
    email: body.email,
    password: body.password,
    role: body.role,
    graduationYear: body.graduationYear,
    major: body.major,
    job: body.job,
    company: body.company,
    city: body.city,
    state: body.state,
    country: body.country,
    zipCode: body.zipCode,
    bio: body.bio,
    interests: body.interests,
    isAdmin: body.isAdmin,
  };
};

// exporting everything
module.exports = {
  // gettin all the users informations 
  getAllUsers: (req, res, next) => {
    User.find()
      .then((users) => {
        req.data = users;
        next();
      })
      .catch((error) => {
        if (error) {
          next(error);
        }
      });
  },
  // finding all the users and creating a table
  index: (req, res, next) => {
    User.find()
      .then((users) => {
        res.locals.users = users;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },
  // showing the table of the users, and showing in json if asked for
  indexView: (req, res) => {
    // res.render("users/index");
    // res.json(res.locals.users);
    if (req.query.format === "json") {
      res.json(res.locals.users);
    } else {
      res.render("users/index");
    }
  },
  // going to the page to create a new user
  new: (req, res) => {
    res.render("users/new");
  },
  // creating a new user
  create: (req, res, next) => {
    if (req.skip) next();
    let newUser = new User(getUserParams(req.body));
    User.register(newUser, req.body.password, (error, user) => {
      if (user) {
        req.flash(
          "success",
          `${user.name}'s account created successfully! Now you may log in!`
        );
        res.locals.redirect = "/users";
        next();
      } else {
        req.flash(
          "error",
          `Failed to create user account because:${error.message}.`
        );
        res.locals.redirect = "/users/new";
        next();
      }
    });
  },
  // redirecting view as needed
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then((user) => {
        // console.log(user);
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
    res.render("users/show");
  },
  edit: (req, res, next) => {
    let userId = req.params.id;
    User.findById(userId)
      .then((user) => {
        res.render("users/edit", {
          user: user,
        });
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    let userId = req.params.id,
      userParams = getUserParams(req.body);

    User.findByIdAndUpdate(userId, {
      $set: userParams,
    })
      .then((user) => {
        res.locals.redirect = `/users/${userId}`;
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error updating user by ID: ${error.message}`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    let userId = req.params.id
    // User.findByIdAndRemove(userId)
    User.findByIdAndDelete(req.params.id)
      // User.findOneAndDelete(userId)
      .then(() => {
        res.locals.redirect = "/users";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting user by ID: ${error.message}`);
        next();
      });
  },
  login: (req, res) => {
    res.render("users/login");
  },
  authenticate: (req, res, next) => {
    passport.authenticate("local", function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash("error", "Failed to log in");
        return res.redirect("/users/login");
      }
      req.login(user, function (err) {
        if (err) {
          return next(err);
        }
        req.flash("success", "successfully logged in");
        return res.redirect("/");
      })
    })(req, res, next);
  },
  validate: (req, res, next) => {
    req
      .sanitizeBody("email")
      .normalizeEmail({
        all_lowercase: true,
      })
      .trim();
    req.check("email", "Email is invalid").isEmail();
    req
      .check("zipCode", "Zip code is invalid")
      .isInt()
      .isLength({
        min: 5,
        max: 5,
      })
      .equals(req.body.zipCode);
    req.check("password", "Password cannot be empty").notEmpty();
    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/users/new";
        next();
      } else {
        next();
      }
    });
  },
  logout: (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "You have been logged out!");
      res.locals.redirect = "/";
      next();
    })
  },
  verifyToken: (req, res, next) => {
    let token = req.query.apiToken;

    if (token) {
      User.findOne({ apiToken: token })
        .then((user) => {
          if (user) next();
          else next(new Error("Invalid API token"));
        })
        .catch((error) => {
          next(new Error(error.message));
        });
    } else next(new Error("Invalid API token"));
  },
  isLoggedIn: (req, res, next) => {
    let currentUser = res.locals.currentUser;
    if (!currentUser) {
      req.flash("error", "You must be logged in!");
      res.redirect('/users/login');
    } else {
      next();
    }
  },
  isAdmin: (req, res, next) => {
    let currentUser = res.locals.currentUser;
    // console.log(currentUser);
    // console.log(currentUser.isAdmin);
    if(!currentUser.isAdmin) {
      req.flash("error", "You must be an Admin!");
      res.redirect('/');
    } else {
      next();
    }
  },
};