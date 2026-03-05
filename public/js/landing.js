setTimeout(() => {
    document.body.classList.add("fade-out");

    setTimeout(() => {
        window.location.href = "/books";
    }, 200);

}, 3500);