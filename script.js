'use strict';

/* ===========================
   NAVBAR — SCROLL
   =========================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ===========================
   MENU MOBILE

   Lógica simplificada: apenas uma classe controla tudo.
   .open   → drawer visível, interativo, animado
   (vazio) → drawer invisível, NÃO interativo (via CSS visibility + pointer-events)

   Sem display toggle, sem race conditions, sem transitionend frágil.
   =========================== */
const navToggle  = document.getElementById('navToggle');
const navDrawer  = document.getElementById('navDrawer');
let   isOpen     = false;

function openDrawer() {
    isOpen = true;
    navDrawer.classList.add('open');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    navDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // impede scroll do body quando menu aberto
}

function closeDrawer() {
    isOpen = false;
    navDrawer.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    navDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function toggleDrawer() {
    isOpen ? closeDrawer() : openDrawer();
}

/* Botão hambúrguer */
navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDrawer();
});

/* Fecha ao clicar em link dentro do drawer */
navDrawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
});

/* Fecha ao clicar fora do drawer */
document.addEventListener('click', (e) => {
    if (!isOpen) return;
    if (!navDrawer.contains(e.target) && !navToggle.contains(e.target)) {
        closeDrawer();
    }
});

/* Fecha ao pressionar Escape */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeDrawer();
});

/* Fecha ao redimensionar para desktop */
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && isOpen) closeDrawer();
}, { passive: true });

/* ===========================
   PREVENT GHOST CLICKS
   Cards não devem navegar ao clicar fora de botões/links
   =========================== */
document.querySelectorAll('.nft-card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (!e.target.closest('a, button')) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
});

const heroCardEl = document.getElementById('heroCard');
if (heroCardEl) {
    heroCardEl.addEventListener('click', (e) => {
        if (!e.target.closest('a, button')) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
}

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
   PARALLAX HERO CARD (desktop only)
   =========================== */
const heroCard = document.getElementById('heroCard');
const isTouch  = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

if (heroCard && !isTouch && window.matchMedia('(min-width: 1024px)').matches) {
    let raf    = null;
    let target = { rx: 0, ry: 0 };
    let current = { rx: 0, ry: 0 };
    let leaving = false;

    heroCard.addEventListener('mousemove', (e) => {
        leaving = false;
        const rect   = heroCard.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        target.ry    = ((e.clientX - cx) / (rect.width  / 2)) *  8;
        target.rx    = ((e.clientY - cy) / (rect.height / 2)) * -6;
    });

    heroCard.addEventListener('mouseleave', () => {
        leaving = true;
        target.rx = 0;
        target.ry = 0;
    });

    function animateCard() {
        const ease   = leaving ? 0.08 : 0.14;
        current.rx  += (target.rx - current.rx) * ease;
        current.ry  += (target.ry - current.ry) * ease;

        const done = Math.abs(current.rx) < 0.01 && Math.abs(current.ry) < 0.01 && leaving;

        if (done) {
            heroCard.style.transform = '';
            raf = null;
            return;
        }

        heroCard.style.transform = `rotateX(${current.rx}deg) rotateY(${current.ry}deg) translateY(-4px)`;
        raf = requestAnimationFrame(animateCard);
    }

    heroCard.addEventListener('mouseenter', () => {
        if (!raf) raf = requestAnimationFrame(animateCard);
    });
}

/* ===========================
   CONTADOR DE STATS
   =========================== */
const statsRow      = document.getElementById('statsRow');
let   statsAnimated = false;

function animateCounters() {
    if (statsAnimated) return;
    statsAnimated = true;

    statsRow.querySelectorAll('h3[data-target]').forEach(el => {
        const target   = parseInt(el.getAttribute('data-target'), 10);
        const suffix   = el.getAttribute('data-suffix') || '';
        const duration = 1400;
        const start    = performance.now();

        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased    = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    });
}

if (statsRow) {
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounters();
            statsObserver.disconnect();
        }
    }, { threshold: 0 });

    statsObserver.observe(statsRow);

    // Fallback se já estiver visível no carregamento
    if (statsRow.getBoundingClientRect().top < window.innerHeight) {
        animateCounters();
    }
}

/* ===========================
   GALERIA — animação de entrada escalonada
   =========================== */
const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';
            }, i * 60);
            galleryObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.05 });

document.querySelectorAll('.gallery-item').forEach(item => {
    item.style.opacity    = '0';
    item.style.transform  = 'translateY(40px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    galleryObserver.observe(item);
});

/* ===========================
   TROCA DE IMAGEM PRINCIPAL (páginas de produto)
   =========================== */
const mainImage = document.querySelector('.main-image img');

if (mainImage) {
    document.querySelectorAll('.gallery-item img').forEach(thumb => {
        thumb.addEventListener('click', () => {
            mainImage.src = thumb.src;
            mainImage.animate(
                [
                    { opacity: 0.4, transform: 'scale(0.96)' },
                    { opacity: 1,   transform: 'scale(1)'    }
                ],
                { duration: 450, easing: 'ease' }
            );
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

/* ===========================
   BOTÕES DE COMPRA (páginas de produto)
   =========================== */
document.querySelectorAll('.purchase-box .btn-primary').forEach(button => {
    button.addEventListener('click', () => {
        if (button.classList.contains('done')) return;
        button.classList.add('done');
        button.textContent    = 'Processing...';
        button.style.pointerEvents = 'none';

        setTimeout(() => {
            button.textContent          = 'Purchased ✓';
            button.style.background     = '#16a34a';
            button.style.borderColor    = '#16a34a';
        }, 1800);
    });
});

document.querySelectorAll('.purchase-box .btn-outline').forEach(button => {
    button.addEventListener('click', () => {
        if (button.classList.contains('done')) return;
        button.classList.add('done');
        button.textContent       = 'Bid Added ✓';
        button.style.background  = '#0f2182';
        button.style.color       = '#fff';
        button.style.borderColor = '#0f2182';
    });
});

/* ===========================
   PARALLAX IMAGEM DE PRODUTO (páginas de produto)
   =========================== */
const imageCard = document.querySelector('.product-image-card');

if (imageCard && !isTouch && window.innerWidth > 1024) {
    let productRaf     = null;
    let productTarget  = { rx: 0, ry: 0 };
    let productCurrent = { rx: 0, ry: 0 };
    let productLeaving = false;

    imageCard.addEventListener('mousemove', (e) => {
        productLeaving = false;
        const rect          = imageCard.getBoundingClientRect();
        const cx            = rect.left + rect.width  / 2;
        const cy            = rect.top  + rect.height / 2;
        productTarget.ry    = ((e.clientX - cx) / (rect.width  / 2)) *  8;
        productTarget.rx    = ((e.clientY - cy) / (rect.height / 2)) * -6;
    });

    imageCard.addEventListener('mouseleave', () => {
        productLeaving = true;
        productTarget.rx = 0;
        productTarget.ry = 0;
    });

    function animateProduct() {
        const ease         = productLeaving ? 0.08 : 0.14;
        productCurrent.rx += (productTarget.rx - productCurrent.rx) * ease;
        productCurrent.ry += (productTarget.ry - productCurrent.ry) * ease;

        const done = Math.abs(productCurrent.rx) < 0.01 && Math.abs(productCurrent.ry) < 0.01 && productLeaving;

        if (done) {
            imageCard.style.transform = '';
            productRaf = null;
            return;
        }

        imageCard.style.transform = `perspective(1400px) rotateX(${productCurrent.rx}deg) rotateY(${productCurrent.ry}deg)`;
        productRaf = requestAnimationFrame(animateProduct);
    }

    imageCard.addEventListener('mouseenter', () => {
        if (!productRaf) productRaf = requestAnimationFrame(animateProduct);
    });
}

/* ===========================
   FAQ ACCORDION
   =========================== */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {

    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {

        const isActive = item.classList.contains('active');

        faqItems.forEach(faq => {
            faq.classList.remove('active');
        });

        if (!isActive) {
            item.classList.add('active');
        }

    });

});
