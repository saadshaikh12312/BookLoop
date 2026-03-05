const express = require("express");
const router = express.Router();

// landing page 
router.get("/", (req, res) => {
    res.render("pages/landing", { pageStyle: "landing" });
});

router.get("/contact", (req, res) => {
    res.render("pages/contact", { pageStyle: "pages" });
});

router.get("/help", (req, res) => {
    res.render("pages/help", { pageStyle: "pages" });
});

router.get("/terms", (req, res) => {
    res.render("pages/terms", { pageStyle: "pages" });
});

router.get("/privacy", (req, res) => {
    res.render("pages/privacy", { pageStyle: "pages" });
});

router.get("/about", (req, res) => {
    res.render("pages/about", { pageStyle: "pages" });
});



//    POST contact
router.post("/contact", (req, res) => {
    // no DB, no email — just feedback
    req.flash("success", "Thanks for contacting us. We'll get back to you soon.");
    res.redirect("/contact");
});

module.exports = router;
