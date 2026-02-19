const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController.js");
const { wrapAsync } = require("../middlewares/wrapAsync.js");
const { isLoggedIn, isOwner, isAlreadyChecked } = require("../middlewares/authMiddlewares.js");

router.get(
    "/:id",
    isLoggedIn,
    wrapAsync(requestController.sendRequest)
)

router.get(
    "/:id/accept",
    isLoggedIn,
    wrapAsync(isAlreadyChecked),
    wrapAsync(requestController.acceptRequest)
)

router.get(
    "/:id/reject",
    isLoggedIn,
    wrapAsync(isAlreadyChecked),
    wrapAsync(requestController.rejectRequest)

)
router.get(
    "/:id/seen",
    isLoggedIn,
    wrapAsync(requestController.seenRequest)
)

module.exports = router;