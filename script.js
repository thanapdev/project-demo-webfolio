// script.js
// Optionally add more interactive animations here
window.addEventListener('DOMContentLoaded', () => {
    // Theme toggle
    const toggleBtn = document.getElementById('toggle-theme');
    const body = document.body;
    let dark = !body.classList.contains('light-mode');
    toggleBtn.addEventListener('click', () => {
        dark = !dark;
        // Add animation class for wave effect
        body.classList.add('animated-bg');
        setTimeout(() => {
            body.classList.toggle('light-mode', !dark);
        }, 10);
        setTimeout(() => {
            body.classList.remove('animated-bg');
        }, 1200);
        toggleBtn.textContent = dark ? '🌙mode' : '☀️mode';
    });
    // Animate nav on scroll
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            nav.style.background = 'rgba(34,34,34,0.8)';
            nav.style.backdropFilter = 'blur(4px)';
        } else {
            nav.style.background = 'none';
            nav.style.backdropFilter = 'none';
        }
    });
});
