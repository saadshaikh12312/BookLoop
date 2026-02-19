const User = require("../models/userSchema.js");

module.exports.myBooks = async (req, res) => {
    let user = await User.findById(req.user._id).populate("myBooks");
    res.render("books/index", { books: user.myBooks, pageStyle: "index", heading: "My Books" })
}