let navTogglerBtn = document.querySelector(".menu-icon");
let collapse = document.querySelector(".navbar-collapse");
let container = document.querySelector(".container-fluid");

// menu toggling effect
navTogglerBtn.addEventListener("click", () => {
    // icon toggle
    navTogglerBtn.classList.toggle("fa-bars");
    navTogglerBtn.classList.toggle("fa-xmark");

    // layout adjust
    container.classList.toggle("nav-icon-toggle-mg");

    // OPEN
    if (!collapse.classList.contains("show")) {
        collapse.classList.add("show", "navbar-collapse-show");
        collapse.classList.remove("navbar-collapse-hide");
        return;
    }

    // CLOSE with animation
    collapse.classList.add("navbar-collapse-hide");

    setTimeout(() => {
        collapse.classList.remove("show", "navbar-collapse-show", "navbar-collapse-hide");
    }, 400);
});

// when click on any link in side bar then side bar is closed
document.querySelectorAll(".navbar-collapse .nav-link").forEach(link => {
    link.addEventListener("click", () => {
        navTogglerBtn.click();
    });
});

// user toggling effect
let userIcon = document.querySelector(".account-icon");
let userToggler = document.querySelector(".user-toggler");

userIcon.addEventListener("click", () => {
    // OPEN
    if (!userToggler.classList.contains("user-toggler-show")) {
        userToggler.classList.add("user-toggler-show");
        userToggler.classList.remove("user-toggler-hide");
        return;
    }

    // CLOSE with animation
    userToggler.classList.add("user-toggler-hide");

    setTimeout(() => {
        userToggler.classList.remove("user-toggler-show", "user-toggler-hide");
    }, 400);
});

if (document.querySelector(".account-icon-lg")) {
    let userIcon = document.querySelector(".account-icon-lg");
    userIcon.addEventListener("click", () => {
        console.log(userToggler)
        if (!userToggler.classList.contains("user-toggler-show-lg")) {
            userToggler.classList.add("user-toggler-show-lg");
            userToggler.classList.remove("user-toggler-hide-lg");
            return;
        }
        // CLOSE with animation
        userToggler.classList.add("user-toggler-hide-lg");

        setTimeout(() => {
            userToggler.classList.remove("user-toggler-show-lg", "user-toggler-hide");
        }, 400);
    })
}


// -------------------- hide flash message after 5s -------------------- 
let flash = document.querySelector(".flash");
if (flash) {
    setTimeout(() => {
        flash.style.display = "none";
    }, 5000);
}


//--------------- auto typing effect in search bar ------------------
const searchInput = document.querySelector(".nav-search-input");

const words = [
    "Title",
    "Subject",
    "University",
    "Location",
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
        // typing
        searchInput.placeholder = currentWord.slice(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentWord.length) {
            setTimeout(() => (isDeleting = true), 1500);
        }
    } else {
        // deleting
        searchInput.placeholder = currentWord.slice(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
    }

    setTimeout(typeEffect, isDeleting ? 60 : 100);
}

typeEffect();