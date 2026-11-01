/**
 * Velora Squad - Immersive 3D Glassmorphic Interactive Logic
 * 100% Client-Side Vanilla JavaScript (Zero Build, GitHub Pages Compatible)
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initNavbar();
    initBackgroundCanvas();
    init3DCardTilt();
    initHeroParallax();
    initTypewriter();
    initStatsCounter();
    initContactEmailCopy();
    initBackToTop();
});

/* ==========================================================================
   1. Scroll Progress Bar
   ========================================================================== */
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    }, { passive: true });
}

/* ==========================================================================
   2. Navbar Scroll Spy & Mobile Menu
   ========================================================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    // Scrolled class toggle
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link spy
        let currentSectionId = '';
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });

    // Mobile Hamburger
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close on link click
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}

/* ==========================================================================
   3. Interactive Neural Constellation Background Canvas
   ========================================================================== */
function initBackgroundCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking for particle attraction
    const mouse = {
        x: null,
        y: null,
        radius: 140
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
    });

    // Particle count scaled to screen size
    let particles = [];
    function initParticles() {
        particles = [];
        const count = Math.min(Math.floor((width * height) / 18000), 75);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.7,
                vy: (Math.random() - 0.5) * 0.7,
                radius: Math.random() * 2 + 1,
                color: Math.random() > 0.5 ? 'rgba(139, 92, 246,' : 'rgba(6, 182, 212,'
            });
        }
    }

    initParticles();

    let animationId;
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            p.x += p.vx;
            p.y += p.vy;

            // Bounce on edges
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            // Mouse proximity repulsion/nudge
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (mouse.radius - dist) / mouse.radius;
                    p.x -= Math.cos(angle) * force * 1.5;
                    p.y -= Math.sin(angle) * force * 1.5;
                }
            }

            // Draw particle dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `${p.color} 0.6)`;
            ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 115) {
                    const alpha = (1 - dist / 115) * 0.28;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
                    ctx.lineWidth = 0.9;
                    ctx.stroke();
                }
            }
        }

        animationId = requestAnimationFrame(animate);
    }

    animate();

    // Respect page visibility to save battery
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

/* ==========================================================================
   4. 3D Card Tilt Interaction with Specular Glare
   ========================================================================== */
function init3DCardTilt() {
    // Only enable on desktop/laptops with fine cursor
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // max 10 deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });
}

/* ==========================================================================
   5. Hero Visual 3D Mouse Parallax
   ========================================================================== */
function initHeroParallax() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const heroVisual = document.getElementById('heroVisual');
    const heroWrapper = document.querySelector('.hero-3d-wrapper');
    const floatingBadges = document.querySelectorAll('.floating-badge');

    if (!heroVisual || !heroWrapper) return;

    heroVisual.addEventListener('mousemove', (e) => {
        const rect = heroVisual.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseY = (e.clientY - rect.top) / rect.height - 0.5;

        // Subtle tilt for the main terminal
        heroWrapper.style.transform = `rotateX(${ -mouseY * 18 }deg) rotateY(${ mouseX * 22 }deg)`;

        // Floating badges with amplified 3D translation
        floatingBadges.forEach(badge => {
            const depth = parseFloat(badge.getAttribute('data-depth')) || 40;
            const moveX = mouseX * depth;
            const moveY = mouseY * depth;
            badge.style.transform = `translate3d(${moveX}px, ${moveY}px, ${depth}px)`;
        });
    });

    heroVisual.addEventListener('mouseleave', () => {
        heroWrapper.style.transform = 'rotateX(0deg) rotateY(0deg)';
        floatingBadges.forEach(badge => {
            badge.style.transform = '';
        });
    });
}

/* ==========================================================================
   6. Dynamic Typewriter Subtitle
   ========================================================================== */
function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const phrases = [
        'Artificial Intelligence & Neural Systems',
        'Immersive Web Architecture & 3D UIs',
        'Cross-Platform Mobile Ecosystems',
        'Cloud-Native Kubernetes & DevOps',
        'Distributed Microservices at Scale'
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    function tick() {
        const currentPhrase = phrases[phraseIdx];

        if (isDeleting) {
            el.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 35;
        } else {
            el.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 75;
        }

        if (!isDeleting && charIdx === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 1800; // Pause at end of phrase
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typingSpeed = 400; // Pause before new phrase
        }

        setTimeout(tick, typingSpeed);
    }

    tick();
}

/* ==========================================================================
   7. Animated Stats Counter (Scroll Triggered)
   ========================================================================== */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    let hasRun = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasRun) {
                hasRun = true;
                statNumbers.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
                    const duration = 1800; // ms
                    const stepTime = 20;
                    const steps = duration / stepTime;
                    const increment = target / steps;
                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target;
                            clearInterval(timer);
                        } else {
                            counter.textContent = Math.floor(current);
                        }
                    }, stepTime);
                });
            }
        });
    }, { threshold: 0.3 });

    const statsGrid = document.querySelector('.about-stats-grid');
    if (statsGrid) {
        observer.observe(statsGrid);
    }
}

/* ==========================================================================
   8. Contact Highlight Email & Clipboard Copy Action
   ========================================================================== */
function initContactEmailCopy() {
    const copyBtn = document.getElementById('copyEmailBtn');
    const emailBox = document.getElementById('emailHighlightBox');
    const contactEmail = document.getElementById('contactEmail');
    const emailToCopy = 'velorasquad.ai@gmail.com';

    function triggerCopy(e) {
        // Prevent default if clicked inside emailBox but not on the direct mailto anchor
        if (e && e.target === contactEmail) return;

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(emailToCopy)
                .then(showCopySuccess)
                .catch(() => fallbackCopy(emailToCopy));
        } else {
            fallbackCopy(emailToCopy);
        }
    }

    function fallbackCopy(text) {
        try {
            const temp = document.createElement('textarea');
            temp.value = text;
            temp.style.position = 'fixed';
            temp.style.opacity = '0';
            document.body.appendChild(temp);
            temp.focus();
            temp.select();
            const success = document.execCommand('copy');
            document.body.removeChild(temp);
            if (success) {
                showCopySuccess();
            } else {
                showToast('Unable to copy email automatically', 'error');
            }
        } catch (err) {
            showToast('Unable to copy email automatically', 'error');
        }
    }

    function showCopySuccess() {
        const copyBtnText = document.getElementById('copyBtnText');
        if (copyBtnText) {
            const originalText = copyBtnText.textContent;
            copyBtnText.textContent = 'Copied!';
            setTimeout(() => {
                copyBtnText.textContent = originalText;
            }, 2500);
        }
        showToast('Email address copied to clipboard!', 'success');
    }

    if (copyBtn) copyBtn.addEventListener('click', triggerCopy);
    if (emailBox) emailBox.addEventListener('click', triggerCopy);
}

/* ==========================================================================
   9. Glassmorphic Toast Notifications
   ========================================================================== */
function showToast(message, type = 'success') {
    const existing = document.querySelector('.glass-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `glass-toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: rgba(14, 18, 34, 0.92);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid ${type === 'success' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)'};
        color: #f8fafc;
        padding: 14px 26px;
        border-radius: 50px;
        font-family: 'Outfit', sans-serif;
        font-size: 0.95rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6), 0 0 20px ${type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
        z-index: 100000;
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        pointer-events: none;
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 350);
    }, 2800);
}

/* ==========================================================================
   10. Back to Top Button
   ========================================================================== */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}