/* =========================================
   REVEAL ON SCROLL
========================================= */

const reveals = document.querySelectorAll('.reveal');

function revealElements() {

    reveals.forEach((element) => {

        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {
            element.classList.add('active');
        }

    });

}

window.addEventListener('scroll', revealElements);

revealElements();

/* =========================================
   PARALLAX CARD
========================================= */

const card = document.querySelector('.about-image-card');

if(window.innerWidth > 1024){

    card.addEventListener('mousemove', (e) => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 8;
        const rotateX = ((centerY - y) / centerY) * 6;

        card.style.transform = `
            perspective(1400px)
            rotateY(${rotateY}deg)
            rotateX(${rotateX}deg)
        `;

    });

    card.addEventListener('mouseleave', () => {

        card.style.transition = 'transform .7s ease';

      card.style.transform = `
    perspective(1400px)
    rotateY(${rotateY}deg)
    rotateX(${rotateX}deg)
    translateZ(0)
`;

        setTimeout(() => {
            card.style.transition = '';
        }, 700);

    });

}

/* ===========================
   NAVBAR SCROLL
   =========================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* =========================
   MOBILE MENU
========================= */

const navToggle = document.getElementById('navToggle');
const navDrawer = document.getElementById('navDrawer');

let drawerOpen = false;

navToggle.addEventListener('click', () => {

    drawerOpen = !drawerOpen;

    navToggle.classList.toggle('active', drawerOpen);

    navDrawer.classList.toggle('open', drawerOpen);

    navToggle.setAttribute('aria-expanded', drawerOpen);

    navDrawer.setAttribute('aria-hidden', !drawerOpen);

});

/* CLOSE MENU */

navDrawer.querySelectorAll('a').forEach(link => {

    link.addEventListener('click', () => {

        drawerOpen = false;

        navToggle.classList.remove('active');

        navDrawer.classList.remove('open');

        navToggle.setAttribute('aria-expanded', false);

        navDrawer.setAttribute('aria-hidden', true);

    });

});