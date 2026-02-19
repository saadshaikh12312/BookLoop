const User = require("../models/userSchema.js");

module.exports.renderSignupForm = (req, res) => {
    if (!res.locals.redirectUrl)
        req.session.redirectUrl = req.get('referer').replace("http://localhost:3000/", "/");
    res.render("./user/signup", { pageStyle: "account" });
}

module.exports.signup = async (req, res,) => {
    let { user, password } = req.body;
    let savedUser = await User.register(user, password);
    req.login(savedUser, (err) => {
        if (err) {
            return next(err);
        }

        const redirectUrl = res.locals.redirectUrl || "/books";
        req.flash("success", `Welcome to the BookLoop ${req.user.name.firstName}`);
        res.redirect(redirectUrl);
    })
}

module.exports.renderLoginForm = (req, res) => {
    res.render("./user/login", { pageStyle: "account" });
}

module.exports.login = async (req, res) => {
    const redirectUrl = res.locals.redirectUrl || "/books";
    req.flash("success", `welcome back ${req.user.name.firstName}`);
    res.redirect(redirectUrl)
}

module.exports.logout = async (req, res) => {
    req.logout((err) => {
        if (err)
            return next(err);
        req.flash("success", "Logout Successfully.");
        res.redirect("/books");
    })
}


module.exports.showMessages = (req, res) => {
    res.render("./user/messages", { pageStyle: "messages" })
}