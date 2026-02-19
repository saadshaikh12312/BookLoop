const express = require("express");
const router = express.Router();
const usersBookController = require("../controllers/usersBookController.js");
const { wrapAsync } = require("../middlewares/wrapAsync.js");
const { isLoggedIn } = require("../middlewares/authMiddlewares.js");

router.get(
    "/",
    isLoggedIn,
    wrapAsync(usersBookController.myBooks)
)

module.exports = router;