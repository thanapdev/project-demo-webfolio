// script.js
// Optionally add more interactive animations here
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.zIndex = '-1';

    const dots = Array.from({length: 40}, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 2 + Math.random() * 3,
        dx: -0.5 + Math.random(),
        dy: -0.5 + Math.random(),
        alpha: 0.2 + Math.random() * 0.3
    }));

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (const dot of dots) {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.r, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(100, 180, 255, ${dot.alpha})`;
            ctx.fill();
            dot.x += dot.dx;
            dot.y += dot.dy;
            if (dot.x < 0 || dot.x > width) dot.dx *= -1;
            if (dot.y < 0 || dot.y > height) dot.dy *= -1;
        }
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });

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
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(34,34,34,0.8)';
            nav.style.backdropFilter = 'blur(4px)';
        } else {
            nav.style.background = 'none';
            nav.style.backdropFilter = 'none';
        }
    });
    document.querySelectorAll('.nav-menu a[href^="#"]').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const yOffset = -60; // ปรับตามความสูงของ navbar
          const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
        // ปิดเมนู (สำหรับ mobile)
        document.getElementById('nav-toggle').checked = false;
      });
    });

    // Back to Top button
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
