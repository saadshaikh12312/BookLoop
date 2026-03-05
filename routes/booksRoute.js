const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController.js");
const multer = require("multer");
const { storage } = require("../cloudinaryConfig.js");
const { wrapAsync } = require("../middlewares/wrapAsync.js");
const { validateBookSchema } = require("../Schema/bookValidation.js");
const { isLoggedIn, isOwner, isRequestAccepted } = require("../middlewares/authMiddlewares.js");

const upload = multer({ storage });

const validateBook = (req, res, next) => {
    const { error } = validateBookSchema.validate(req.body);
    if (error) {
        return next(error);
    }
    next();
}


router.route("/")
    // home page: show all books
    .get(
        wrapAsync(booksController.index)
    )

    //new route : add a new book in DB
    .post(
        isLoggedIn,
        validateBook,
        upload.single("book[image]"),
        wrapAsync(booksController.newBook)
    )

// new page : render new form
router.get(
    "/new",
    isLoggedIn,
    booksController.renderNewForm
);

router.route("/:id")
    // show page : show details of specific book
    .get(
        wrapAsync(isRequestAccepted),
        wrapAsync(booksController.showBook)
    )

    // edit route : update book details in DB
    .put(
        isLoggedIn,
        isOwner,
        upload.single("book[image]"),
        validateBook,
        wrapAsync(booksController.editBook)
    )

    // delete route : delete an book from DB
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(booksController.destroyBook)
    )

// edit page : render edit form 
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    booksController.renderEditForm
);

module.exports = router;