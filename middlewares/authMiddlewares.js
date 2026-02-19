const Request = require("../models/requestSchema.js")

module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.redirectUrl = req.originalUrl;

    req.flash("error", "Please logged-in to perform these operations");
    res.redirect("/login");
}

module.exports.isOwner = async (req, res, next) => {
    let book = await Book.findById(req.params.id);
    if (req.user._id.equals(book.owner))
        return next();

    req.flash("error", "You don't have acces to peform these operations.")
    res.redirect(`/books/${req.params.id}`)
}

module.exports.isAlreadyChecked = async (req, res, next) => {
    let reqId = req.params.id;
    let request = await Request.findById(reqId);

    // if request is not found in DB
    if (!request) {
        req.flash("error", "No request found !")
        res.redirect(`/${req.user._id}/messages`)
    }

    // if request is already accepted , redirect to message page
    if (request.status === "accepted") {
        req.flash("error", "You already accepted this request.");
        return res.redirect(`/${req.user._id}/messages`);
    }

    // if request is already rejected , redirect to message page
    if (request.status === "rejected") {
        req.flash("error", "You already rejected this request.");
        return res.redirect(`/${req.user._id}/messages`);
    }

    // if request status is pending: next is call and temporarily requestis stored in session 
    req.session.request = request;
    next();
}

module.exports.isRequestAccepted = async (req, res, next) => {
    if (req.user) {
        let bookId = req.params.id;
        let request = await Request.findOne({
            book: bookId,
            sender: req.user._id
        })
        if (request) {
            req.session.requestStatus = request.status;
            return next();
        }
    }
    next();
}