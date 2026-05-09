const navToggle = document.getElementById("navToggle");
const navDrawer = document.getElementById("navDrawer");
const navbar = document.getElementById("navbar");

navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navDrawer.classList.toggle("open");
});

/* efeito scroll */
window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});
