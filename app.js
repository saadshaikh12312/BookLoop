// Load .env from parent directory first, before anything else
const fs = require('fs');
const path = require('path');
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
} else {
    require('dotenv').config();
}

const express = require("express");
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


// ---------------- middleware functions ----------------
const store = new MongoStore({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
    ttl: 604800,
})

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

// ---------------- middlewares ----------------

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, ("views")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
    res.locals.title = "BookLoop";
    next();
});
app.use(sessionOption);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());

// storing flash data in res.locals
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.redirectUrl = req.session.redirectUrl;
    res.locals.currentPath = req.path;
    next();
})


function connect_db(db) {
    mongoose
        .connect(db)
        .then(() => console.log("💻 Mondodb Connected"))
        .catch(err => console.error(err));
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
