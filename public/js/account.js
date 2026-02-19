// bootstrap + custom validation
(() => {
    const forms = document.querySelectorAll(".needs-validation");

    Array.from(forms).forEach(form => {
        form.addEventListener("submit", event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add("was-validated");
        });
    });
})();

// password toggle
const toggle = document.querySelector(".toggle-password");
const passwordInput = document.getElementById("password");

toggle.addEventListener("click", () => {
    passwordInput.type =
        passwordInput.type === "password" ? "text" : "password";
});
