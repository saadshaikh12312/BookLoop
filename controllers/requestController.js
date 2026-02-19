const Book = require("../models/bookSchema.js");
const Request = require("../models/requestSchema.js");
const User = require("../models/userSchema.js");

module.exports.sendRequest = async (req, res) => {
    let currBook = await Book.findById(req.params.id);
    // if owner send req to own 
    if (req.user._id.equals(currBook.owner)) {
        req.flash("error", "You cannot request your own book.");
        return res.redirect(`/books/${req.params.id}`);
    }

    // check is alredy sented a request 
    let isAlreadyRequested = await Request.findOne({
        book: req.params.id,
        sender: req.user._id
    });
    if (isAlreadyRequested) {
        req.flash("error", "You’ve already requested this book. Please wait—we’ll notify you once the owner responds.")
        return res.redirect(`/books/${req.params.id}`);
    }


    let request = new Request({
        book: req.params.id,
        owner: currBook.owner,
        sender: req.user._id,
        status: "pending"
    });

    let owner = await User.findById(currBook.owner);

    let savedRequest = await request.save();
    if (!savedRequest)
        return next(err);
    let messageObj = {
        request: savedRequest._id,
        message: `${req.user.name.firstName} has requested your book “${currBook.title}”. Please accept or reject the request to proceed.`,
        status: "unread",
        type: "request"
    }
    owner.messages.push(messageObj);
    await owner.save();

    req.flash("success", "Request sented successfully. we'll notify when a owner accept your request");
    res.redirect(`/books/${req.params.id}`)
}

// accept request 
module.exports.acceptRequest = async (req, res) => {
    let reqId = req.params.id;
    let request = req.session.request;
    delete req.session.request;

    // changed req status to accepted and user message status to read
    request.status = "accepted";
    req.user.messages.forEach(msg => {
        if (msg.request.equals(reqId)) {
            msg.status = "read";
        }
    });

    let reqUser = await req.user.save();
    let savedRequest = await request.save();

    // sending message back to sender for request accepted
    let sender = await User.findById(request.sender);
    let book = await Book.findById(request.book);

    // if book is alredy deleted from db , redirect to user messages
    if (!book) {
        req.flash("error", "this book is no longer available");
        return res.redirect(`/${req.user._id}/messages`);
    }

    // new message
    let message = {
        request: reqId,
        message: `Your request for “${book.title}” has been accepted by ${req.user.name.firstName}. You can now contact the owner.`,
        status: "unread",
        type: "received",
    }
    sender.messages.push(message);
    await sender.save();

    res.redirect(`/${req.user._id}/messages`);
}

// reject request 
module.exports.rejectRequest = async (req, res) => {
    let reqId = req.params.id;
    let request = req.session.request;
    delete req.session.request;

    // changed req status to accepted and user message status to read
    request.status = "rejected";
    req.user.messages.forEach(msg => {
        if (msg.request.equals(reqId)) {
            msg.status = "read";
        }
    });

    let reqUser = await req.user.save();
    let savedRequest = await request.save();

    // sending message back to sender for request accepted
    let sender = await User.findById(request.sender);
    let book = await Book.findById(request.book);

    // if bokk is alredy deleted from db
    if (!book) {
        req.flash("error", "this book is no longer available");
        return res.redirect(`/${req.user._id}/messages`);
    }
    let message = {
        request: reqId,
        message: `Your request for “${book.title}” has been rejected by ${req.user.name.firstName}.`,
        status: "unread",
        type: "received",
    }
    sender.messages.push(message);
    await sender.save();

    res.redirect(`/${req.user._id}/messages`);
}

// seen request
module.exports.seenRequest = async (req, res) => {
    req.user.messages.forEach((msg) => {
        if (msg.request.equals(req.params.id)) {
            msg.status = "read";
            isFound = true;
        }
    });
    await req.user.save();
    if (isFound) {
        let request = await Request.findById(req.params.id);
        return res.redirect(`/books/${request.book}`);
    }
    res.redirect(`/${req.user._id}/messages`);
}