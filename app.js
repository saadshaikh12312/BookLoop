require('dotenv').config({ quiet: true });
const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const ExpErrors = require("./middlewares/ExpErrors.js");
const booksRoute = require("./routes/booksRoute.js");
const usersRoute = require("./routes/usersRoute.js");
const requestsRoute = require("./routes/requestsRoute.js");
const usersBookRoute = require("./routes/usersBookRoute.js");
const pagesRoute = require("./routes/pagesRoute.js");
const ejsMate = require("ejs-mate");
const methodOverride = require('method-override')
const session = require('express-session');
const passport = require("passport");
const localStrategy = require("passport-local");
const flash = require('connect-flash');
const MongoStore = require('connect-mongo').default;
const User = require("./models/userSchema.js");

const app = express();
const dbUrl = process.env.ATLAS_DB_URL;
const port = process.env.PORT;


// ----------------------- middleware functions -----------------------

//session store in mongoDB
const store = new MongoStore({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
    ttl: 604800,
})

// session configuration
const sessionOption = session({
    secret: process.env.SESSION_SECRET,
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
});

// flash data middleware
const flashDataMiddleware = (req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.redirectUrl = req.session.redirectUrl;
    res.locals.currentPath = req.path;
    next();
}


// ----------------------- view engine and views directory -----------------------

app.engine("ejs", ejsMate);     // use ejs-mate for all ejs templates  
app.set("view engine", "ejs");      // set view engine to ejs
app.set("views", path.join(__dirname, ("views")));      // set views directory to /views


// ----------------------- middlewares -----------------------

app.use(express.urlencoded({ extended: true }));        // parse incoming request bodies with urlencoded payloads
app.use(express.json());        // parse incoming request bodies with JSON payloads
app.use(methodOverride("_method")) ;        // override HTTP methods using query parameter _method
app.use(express.static(path.join(__dirname, "public")));        // serve static files from /public directory
app.use((req, res, next) => {       // set default title for all pages
    res.locals.title = "BookLoop";
    next();
});
app.use(sessionOption);     // use session middleware with the configured options
app.use(flash());           // use flash middleware for storing flash messages in session

// ----------------------- passport configuration - middlewares -----------------------
app.use(passport.initialize());     // initialize passport middleware for authentication
app.use(passport.session());        // use passport session middleware to persist login sessions
passport.use(new localStrategy(User.authenticate()));   // use local strategy for authentication with the User model
passport.serializeUser(User.serializeUser())        // serialize user instance to the session
passport.deserializeUser(User.deserializeUser());       // deserialize user instance from the session

// storing flash data in res.locals
app.use(flashDataMiddleware);


// ----------------------- database connection -----------------------
function connect_db(db) {
    mongoose
        .connect(db, { serverSelectionTimeoutMS: 5000 })
        .then(() => console.log("💻 Mondodb Connected"))
        .catch(err => {
            console.error("MongoDB connection failed:", err.message || err);
        });
}
connect_db(dbUrl);


// -------------------- Routes --------------------

// books routes
app.use("/books", booksRoute);

// user's books
app.use("/mybooks", usersBookRoute);

// request routes
app.use("/request", requestsRoute);

// users routes
app.use("/", usersRoute)

// pages routes
app.use("/", pagesRoute);


app.listen(port, () => console.log(`Server running on port ${port} 🔥`));

// ----------------------- Error Handling Middlewares -----------------------

// Page not found 
app.use((req, res, next) => {
    if (res.headersSent) return;

    // For HTML requests render the 404 page directly (avoid creating an error
    // which will bubble into the final error handler and produce stack traces
    // for every missing asset). For API/json requests return JSON; otherwise
    // return plain text.
    if (req.accepts("html")) {
        return res.status(404).render("errors/404.ejs", { pageStyle: "error" });
    }
    if (req.accepts("json")) {
        return res.status(404).json({ error: "Not Found" });
    }
    res.status(404).type("txt").send("Not Found");
});

// CastError (invalid ObjectId)
app.use((err, req, res, next) => {
    if (err.name === "CastError") {
        err = new ExpErrors(400, "Invalid request. The requested resource does not exist.");
    }
    next(err);
});

// 404 page
app.use((err, req, res, next) => {
    if (err.statusCode === 404) {
        return res.status(404).render("errors/404.ejs", {
            pageStyle: "error"
        });
    }
    next(err);
});

// Final error handler (ONLY ONE)
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";

    console.error(err);

    res.status(statusCode).render("errors/error.ejs", {
        message,
        pageStyle: "error"
    });
});
