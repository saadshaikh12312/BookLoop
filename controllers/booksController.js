const { cloudinary } = require("../cloudinaryConfig.js");
const Book = require("../models/bookSchema.js");
const User = require("../models/userSchema.js");

// get route : index page / home page : show all books with search and filter options
module.exports.index = async (req, res) => {
    let { q, sort } = req.query;

    // search by title | subject | university | location
    if (req.query.q) {
        const regex = new RegExp(q.trim(), "i");
        let books = await Book.find({
            $or: [
                { title: regex },
                { subject: regex },
                { university: regex },
                { location: regex },
            ]
        });

        // if search result found
        if (books.length) {
            return res.render("books/index", { books, pageStyle: "index", heading: `Search result : " ${q} "` })
        }

        // if search result not found
        req.flash("error", `No result found for "${q}"`);
        return res.redirect("/books");
    }

    //sort by newest , price: low / high
    if (sort) {
        // sort by newest first
        if (sort === "newest") {
            let books = await Book.find().sort({ updatedAt: -1 });
            if (books)
                return res.render("books/index", { books, pageStyle: "index", heading: `Newly added :` })
        }
        // sort by lowest first
        else if (sort === "low") {
            let books = await Book.find().sort({ "price.sellingPrice": 1 });
            if (books)
                return res.render("books/index", { books, pageStyle: "index", heading: `Sort by Lowest First :` })
        }
        // sort by highest first
        else if (sort === "high") {
            let books = await Book.find().sort({ "price.sellingPrice": -1 });
            if (books)
                return res.render("books/index", { books, pageStyle: "index", heading: `Sort by Highest First :` })
        }
    }

    //filters 
    const filters = {};

    // remove null feilds
    if (req.query.course)
        filters.course = req.query.course;
    if (req.query.condition)
        filters.condition = req.query.condition;
    if (req.query.exchangeType)
        filters.exchangetype = req.query.exchangeType;

    let books = await Book.find(filters);

    // if filter is applied then filtered books is send , otherwise all books are send
    if (books) {
        let heading = (Object.keys(filters).length) ? `Filtered :` : `Available Books `;
        return res.render("books/index", { books, pageStyle: "index", heading })
    }
};

// get route : render new book form
module.exports.renderNewForm = (req, res) => {
    res.render("books/new", { pageStyle: "form" })
};

// post route : adds a new book in DB
module.exports.newBook = async (req, res) => {
    let { path, filename } = req.file;

    // added path and filename of uploaded image to book object
    let book = new Book(req.body.book);
    book.image = {
        url: path,
        filename: filename
    }
    book.owner = req.user._id;      // saved user's id in book -> owner
    let savedData = await book.save();      // saved book in DB
  
    // if book is not saved in DB , redirect to new book form
    if (!savedData) {
        req.flash("error", "some error occured! Please try again later.");
        return res.redirect("/books/new");
    }

    // save book id in user -> myBooks[]
    req.user.myBooks.push(savedData._id);
    await req.user.save();


    req.flash("success", "your book added succesfully.");
    res.redirect("/books");
};

// GET route : show a specific book
module.exports.showBook = async (req, res) => {
    const { id } = req.params;

    const book = await Book.findById(id);

    // if book is not found in DB , redirect to books index page
    if (!book) {
        req.flash("error", "The book you are trying to access is no longer available.");
        return res.redirect("/books");
    }

    let requestStatus = null;
    let url = null;

    // if user has sent a request for this book , then show the status of that request
    if (req.session.requestStatus) {
        requestStatus = req.session.requestStatus;
        delete req.session.requestStatus;

        if (requestStatus === "accepted") {
            const owner = await User.findById(book.owner);

            const message = `Hi ${owner.name.firstName}, this is ${req.user.name.firstName}.\nMy request for the book "${book.title}" was accepted. I’m contacting you to proceed further.`;

            url = `https://wa.me/${owner.mobileNo}?text=${encodeURIComponent(message)}`;
        }
    }

    //redirect to show page with book details and request status
    res.render("books/show", {
        book,
        pageStyle: "show",
        requestStatus,
        url
    });
};

// GET route : render edit form 
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let book = await Book.findById(id);

    // if book is not found in DB , redirect to books index page
    if (!book) {
        req.flash("error", "the book you are trying to access is no longer available.");
        return res.redirect("/books");
    }

    res.render("books/edit", { book, pageStyle: "form" });
};

// PUT route : edit the details of an existing book  
module.exports.editBook = async (req, res) => {
    let { id } = req.params;
    let book = req.body.book;
    book.updatedAt = new Date();

    // if new image is uploaded , delete old image from cloudinary and save new image info in DB
    let oldBook = await Book.findById(id);
    // deleting old image from cloudinary 
    if (req.file) {
        try {
            // delete old image 
            if (oldBook.image?.filename) {
                await cloudinary.uploader.destroy(oldBook.image.filename); 
            }

            // save new image info (already uploaded)
            book.image = {
                url: req.file.path,
                filename: req.file.filename
            }

        } catch (err) {
            await cloudinary.uploader.destroy(req.file.filename);  // delete newly uploaded image from cloudinary if error occurs
            req.flash("error", "Some error occured, please upload image again.");
            return res.redirect(`/books/${id}`);
        }
    }

    let updatedBook = await Book.findByIdAndUpdate(id, book, { runValidators: true });

    // if book is not found in DB , redirect to books index page
    if (!updatedBook) {
        req.flash("error", "the book you are trying to access is no longer available.");
        return res.redirect("/books");
    }

    // redirect to show page with updated book details
    req.flash("success", "Updated successfully.");
    res.redirect(`/books/${id}`)
}

// DELETE route : delete an existing book from DB
module.exports.destroyBook = async (req, res) => {
    let { id } = req.params;
    let deletedBook = await Book.findByIdAndDelete(id);

    // if book was deleted successfully , delete the image from cloudinary
    if (deletedBook?.image?.filename) {
        await cloudinary.uploader.destroy(deletedBook.image.filename);
    }

    // if book is not found in DB , redirect to books index page
    if (!deletedBook) {
        req.flash("error", "the book you are trying to access is no longer available.");
        return res.redirect("/books");
    }

    req.flash("success", "Deleted successfully.");
    res.redirect("/books");
}
