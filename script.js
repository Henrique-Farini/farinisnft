/* ===========================
   NAVBAR SCROLL
   =========================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ===========================
   MENU MOBILE
   =========================== */
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

navDrawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        drawerOpen = false;
        navToggle.classList.remove('active');
        navDrawer.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
        navDrawer.setAttribute('aria-hidden', true);
    });
});

/* ===========================
   SCROLL REVEAL
   =========================== */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    revealObserver.observe(el);
});

/* ===========================
   PARALLAX HERO CARD
   =========================== */
const heroCard = document.getElementById('heroCard');

if (heroCard && window.matchMedia('(min-width: 1024px)').matches) {

    heroCard.addEventListener('mousemove', (e) => {

        const rect = heroCard.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 8;
        const rotateX = ((centerY - y) / centerY) * 6;

        heroCard.style.transform = `
            rotateY(${rotateY}deg)
            rotateX(${rotateX}deg)
            translateY(-4px)
        `;
    });

    heroCard.addEventListener('mouseleave', () => {

        heroCard.style.transition =
            'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)';

        heroCard.style.transform =
            'rotateY(0deg) rotateX(0deg) translateY(0px)';

        setTimeout(() => {
            heroCard.style.transition = '';
        }, 700);
    });
}

/* ===========================
   CONTADOR DE STATS
   =========================== */
const statsRow = document.getElementById('statsRow');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsAnimated) {
        statsAnimated = true;

        statsRow.querySelectorAll('h3[data-target]').forEach(el => {
            const target = parseInt(el.getAttribute('data-target'));
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1400;
            const startTime = performance.now();

            const update = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased) + suffix;
                if (progress < 1) requestAnimationFrame(update);
            };

            requestAnimationFrame(update);
        });

        statsObserver.disconnect();
    }
}, { threshold: 0.5 });

if (statsRow) statsObserver.observe(statsRow);



/* =========================================
   NFT PRODUCT PAGE INTERACTIONS
========================================= */

const mainImage = document.querySelector('.main-image img');
const galleryItems = document.querySelectorAll('.gallery-item img');
const buyButton = document.querySelector('.btn-primary');
const bidButton = document.querySelector('.btn-outline');

/* =========================================
   CHANGE MAIN IMAGE
========================================= */

galleryItems.forEach(item => {

    item.addEventListener('click', () => {

        // troca imagem principal
        mainImage.src = item.src;

        // animação suave
        mainImage.animate(
            [
                { opacity: 0.4, transform: 'scale(0.96)' },
                { opacity: 1, transform: 'scale(1)' }
            ],
            {
                duration: 450,
                easing: 'ease'
            }
        );

        // sobe para o topo suavemente
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    });

});/* =========================================
   BUY BUTTONS
========================================= */

const buyButtons = document.querySelectorAll('.purchase-box .btn-primary');
const bidButtons = document.querySelectorAll('.purchase-box .btn-outline');

buyButtons.forEach(button => {

    button.addEventListener('click', () => {

        if(button.classList.contains('done')) return;

        button.classList.add('done');

        button.innerHTML = 'Processing...';

        button.style.pointerEvents = 'none';

        setTimeout(() => {

            button.innerHTML = 'Purchased ✓';

            button.style.background = '#16a34a';

        }, 1800);

    });

});

/* =========================================
   BID BUTTONS
========================================= */

bidButtons.forEach(button => {

    button.addEventListener('click', () => {

        if(button.classList.contains('done')) return;

        button.classList.add('done');

        button.innerHTML = 'Bid Added ✓';

        button.style.background = '#0f2182';
        button.style.color = '#fff';

    });

});

/* =========================================
   PARALLAX IMAGE
========================================= */

const imageCard = document.querySelector('.product-image-card');

if (window.innerWidth > 1024) {

    imageCard.addEventListener('mousemove', (e) => {

        const rect = imageCard.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 8;
        const rotateX = ((centerY - y) / centerY) * 6;

        imageCard.style.transform = `
            perspective(1400px)
            rotateY(${rotateY}deg)
            rotateX(${rotateX}deg)
        `;

    });

    imageCard.addEventListener('mouseleave', () => {

        imageCard.style.transition = 'transform 0.7s ease';

        imageCard.style.transform = `
            perspective(1400px)
            rotateY(0deg)
            rotateX(0deg)
        `;

        setTimeout(() => {
            imageCard.style.transition = '';
        }, 700);

    });

}

/* =========================================
   REVEAL ANIMATION
========================================= */

const reveals = document.querySelectorAll('.gallery-item');

const revealOnScroll = () => {

    reveals.forEach((item, index) => {

        const windowHeight = window.innerHeight;
        const top = item.getBoundingClientRect().top;

        if (top < windowHeight - 60) {

            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';

        }

    });

};

reveals.forEach(item => {

    item.style.opacity = '0';
    item.style.transform = 'translateY(40px)';
    item.style.transition = 'all 0.7s ease';

});

window.addEventListener('scroll', revealOnScroll);

revealOnScroll();

