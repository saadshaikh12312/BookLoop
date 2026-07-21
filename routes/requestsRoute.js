const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController.js");
const { wrapAsync } = require("../middlewares/wrapAsync.js");
const { isLoggedIn, isOwner, isAlreadyChecked } = require("../middlewares/authMiddlewares.js");

//send request route
router.get(
    "/:id",
    isLoggedIn,
    wrapAsync(requestController.sendRequest)
)

// accept request route
router.get(
    "/:id/accept",
    isLoggedIn,
    wrapAsync(isAlreadyChecked),
    wrapAsync(requestController.acceptRequest)
)

// reject request route
router.get(
    "/:id/reject",
    isLoggedIn,
    wrapAsync(isAlreadyChecked),
    wrapAsync(requestController.rejectRequest)
)

// seen request route
router.get(
    "/:id/seen",
    isLoggedIn,
    wrapAsync(requestController.seenRequest)
)

module.exports = router;