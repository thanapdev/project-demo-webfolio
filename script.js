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

    // Animate nav on scroll
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
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

    // Theme toggle
    const themeBtn = document.getElementById('toggle-theme');
    const body = document.body;

    function setTheme(isLight) {
        if (isLight) {
            body.classList.add('light-mode');
            themeBtn.textContent = '🌞';
        } else {
            body.classList.remove('light-mode');
            themeBtn.textContent = '🌙';
        }
    }

    // เริ่มต้นดูว่าต้องใช้ธีมไหน (เช็ค localStorage)
    let isLight = localStorage.getItem('theme') === 'light';
    setTheme(isLight);

    function animateAngle(from, to, duration = 700) {
        const start = performance.now();
        function frame(now) {
            const progress = Math.min((now - start) / duration, 1);
            const angle = from + (to - from) * progress;
            document.body.style.setProperty('--angle', angle + 'deg');
            if (progress < 1) {
                requestAnimationFrame(frame);
            }
        }
        requestAnimationFrame(frame);
    }

    function animateTheme(from, to, duration = 700) {
        const start = performance.now();
        function frame(now) {
            const progress = Math.min((now - start) / duration, 1);
            // องศา
            const angle = from.angle + (to.angle - from.angle) * progress;
            document.body.style.setProperty('--angle', angle + 'deg');
            // สี
            document.body.style.setProperty('--color1', lerpColor(from.color1, to.color1, progress));
            document.body.style.setProperty('--color2', lerpColor(from.color2, to.color2, progress));
            document.body.style.setProperty('--color3', lerpColor(from.color3, to.color3, progress));
            if (progress < 1) {
                requestAnimationFrame(frame);
            }
        }
        requestAnimationFrame(frame);
    }

    themeBtn.addEventListener('click', () => {
        isLight = !isLight;
        // อ่านค่าปัจจุบัน
        const currentAngle = parseFloat(getComputedStyle(document.body).getPropertyValue('--angle')) || 120;
        const from = {
            angle: currentAngle,
            color1: hexToRgb(getComputedStyle(document.body).getPropertyValue('--color1').trim()),
            color2: hexToRgb(getComputedStyle(document.body).getPropertyValue('--color2').trim()),
            color3: hexToRgb(getComputedStyle(document.body).getPropertyValue('--color3').trim())
        };
        // กำหนดเป้าหมาย
        const to = isLight
            ? { angle: currentAngle + 360, color1: hexToRgb('#f6d365'), color2: hexToRgb('#fda085'), color3: hexToRgb('#fffbe6') }
            : { angle: currentAngle + 360, color1: hexToRgb('#0E2148'), color2: hexToRgb('#483AA0'), color3: hexToRgb('#7965C1') };
        animateTheme(from, to, 1500); // เปลี่ยน 700 เป็น 1500 (1.5 วินาที)
        setTheme(isLight);
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    // --- Section fade-in on scroll ---
    const sections = document.querySelectorAll('.section');
    const observer = new window.IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    sections.forEach(section => observer.observe(section));

    // --- Dynamic GitHub Projects ---
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        fetch('https://api.github.com/users/thanapdev/repos?sort=updated&per_page=6')
            .then(res => res.json())
            .then(repos => {
                projectsGrid.innerHTML = '';
                repos.forEach(repo => {
                    const card = document.createElement('div');
                    card.className = 'project-card';
                    card.innerHTML = `
                        <h3>${repo.name}</h3>
                        <p>${repo.description ? repo.description : ''}</p>
                        <a href="${repo.html_url}" target="_blank">View on GitHub</a>
                    `;
                    projectsGrid.appendChild(card);
                });
            })
            .catch(() => {
                // fallback: do nothing, keep static content
            });
    }

    // --- Dynamic GitHub Skills ---
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
        fetch('https://api.github.com/users/thanapdev/repos?per_page=100')
            .then(res => res.json())
            .then(repos => {
                // Collect languages from all repos
                const langSet = new Set();
                repos.forEach(repo => {
                    if (repo.language) langSet.add(repo.language);
                });
                // Map language to icon and label
                const langMap = {
                    'HTML': {icon: 'html5', label: 'HTML5'},
                    'CSS': {icon: 'css3', label: 'CSS3'},
                    'JavaScript': {icon: 'javascript', label: 'JavaScript'},
                    'TypeScript': {icon: 'typescript', label: 'TypeScript'},
                    'Python': {icon: 'python', label: 'Python'},
                    'Java': {icon: 'java', label: 'Java'},
                    'C++': {icon: 'cplusplus', label: 'C++'},
                    'C#': {icon: 'csharp', label: 'C#'},
                    'Go': {icon: 'go', label: 'Go'},
                    'PHP': {icon: 'php', label: 'PHP'},
                    'Ruby': {icon: 'ruby', label: 'Ruby'},
                    'Shell': {icon: 'bash', label: 'Shell'},
                    'Vue': {icon: 'vuejs', label: 'Vue.js'},
                    'SCSS': {icon: 'sass', label: 'SCSS'},
                    'Jupyter Notebook': {icon: 'jupyter', label: 'Jupyter'},
                    'Dockerfile': {icon: 'docker', label: 'Docker'},
                    'Kotlin': {icon: 'kotlin', label: 'Kotlin'},
                    'Swift': {icon: 'swift', label: 'Swift'},
                    'Objective-C': {icon: 'objectivec', label: 'Objective-C'},
                    'Rust': {icon: 'rust', label: 'Rust'},
                    'Dart': {icon: 'dart', label: 'Dart'}
                };
                // Always show these core skills
                const coreSkills = [
                    {icon: 'html5', label: 'HTML5'},
                    {icon: 'css3', label: 'CSS3'},
                    {icon: 'javascript', label: 'JavaScript'},
                    {icon: 'react', label: 'React'},
                    {icon: 'nodejs', label: 'Node.js'},
                    {icon: 'express', label: 'Express'},
                    {icon: 'mongodb', label: 'MongoDB'},
                    {icon: 'git', label: 'Git'}
                ];
                // Add detected languages (avoid duplicate core skills)
                const skills = [...coreSkills];
                langSet.forEach(lang => {
                    const found = coreSkills.find(s => s.label === lang || s.label === langMap[lang]?.label);
                    if (!found && langMap[lang]) {
                        skills.push(langMap[lang]);
                    }
                });
                // Render
                skillsGrid.innerHTML = '';
                skills.forEach(skill => {
                    const card = document.createElement('div');
                    card.className = 'skill-card';
                    card.innerHTML = `
                        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${skill.icon}/${skill.icon}-original.svg" alt="${skill.label}" title="${skill.label}">
                        <span>${skill.label}</span>
                    `;
                    skillsGrid.appendChild(card);
                });
            });
    }

    function hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
        const num = parseInt(hex, 16);
        return [num >> 16, (num >> 8) & 255, num & 255];
    }
    function rgbToHex([r, g, b]) {
        return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    }
    function lerp(a, b, t) {
        return a + (b - a) * t;
    }
    function lerpColor(a, b, t) {
        return rgbToHex([
            Math.round(lerp(a[0], b[0], t)),
            Math.round(lerp(a[1], b[1], t)),
            Math.round(lerp(a[2], b[2], t))
        ]);
    }
});
