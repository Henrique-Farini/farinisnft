const tabs = document.querySelectorAll('.tab-btn');
const forms = document.querySelectorAll('.auth-form');
const tabsContainer = document.querySelector('.auth-tabs');

tabs.forEach(tab => {

    tab.addEventListener('click', () => {

        tabs.forEach(btn => btn.classList.remove('active'));
        forms.forEach(form => form.classList.remove('active'));

        tab.classList.add('active');

        const target = tab.dataset.tab;

        if(target === 'login'){
            document.getElementById('loginForm')
            .classList.add('active');

            tabsContainer.classList.remove('register-mode');

        } else {

            document.getElementById('registerForm')
            .classList.add('active');

            tabsContainer.classList.add('register-mode');
        }

    });

});
const params = new URLSearchParams(window.location.search);
const mode = params.get('mode');

if (mode === 'register') {

    tabs.forEach(btn => btn.classList.remove('active'));
    forms.forEach(form => form.classList.remove('active'));

    document.querySelector('[data-tab="register"]')
    .classList.add('active');

    document.getElementById('registerForm')
    .classList.add('active');

    tabsContainer.classList.add('register-mode');

}
