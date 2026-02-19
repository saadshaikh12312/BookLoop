const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController.js");
const { wrapAsync } = require("../middlewares/wrapAsync.js");
const passport = require("passport");
const { isLoggedIn } = require("../middlewares/authMiddlewares.js");

router.route("/signup")
    // render a signup form 
    .get(usersController.renderSignupForm)

    // add a user in DB
    .post(
        wrapAsync(usersController.signup)
    );

router.route("/login")
    // render a signup form 
    .get(usersController.renderLoginForm)

    // add a user in DB
    .post(
        // saveRedirectUrl,
        passport.authenticate(
            "local",
            {
                failureRedirect: "/login",
                failureFlash: true
            }
        ),
        wrapAsync(usersController.login)
    );

router.post(
    "/logout",
    isLoggedIn,
    wrapAsync(usersController.logout)
)

// message route : display messages about book request | received
router.get("/:id/messages",
    isLoggedIn,
    usersController.showMessages
)

module.exports = router;