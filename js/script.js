// ===========================
// Navigation & Smooth Scrolling
// ===========================

const navLinks = document.querySelectorAll('.nav-links a');
const hamburger = document.querySelector('.hamburger');
const navLinksContainer = document.querySelector('.nav-links');

// Smooth scroll for all anchor links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Close mobile menu if open
        if (navLinksContainer.classList.contains('active')) {
            navLinksContainer.classList.remove('active');
        }
    });
});

// Mobile hamburger menu
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
    });
}

// ===========================
// Contact Email Copy Handling
// ===========================

const copyEmailBtn = document.getElementById('copyEmailBtn');
const contactEmail = document.getElementById('contactEmail');

if (copyEmailBtn) {
    function setCopySuccessState() {
        const copyBtnText = document.getElementById('copyBtnText');
        if (copyBtnText) {
            const prev = copyBtnText.textContent;
            copyBtnText.textContent = 'Copied!';
            setTimeout(() => {
                copyBtnText.textContent = prev;
            }, 2000);
        }
        showAlert('Email copied to clipboard!', 'success');
    }

    function fallbackCopy(text) {
        try {
            const tempInput = document.createElement('textarea');
            tempInput.value = text;
            tempInput.style.position = 'fixed';
            tempInput.style.opacity = '0';
            document.body.appendChild(tempInput);
            tempInput.focus();
            tempInput.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(tempInput);
            if (successful) {
                setCopySuccessState();
            } else {
                showAlert('Could not copy email', 'error');
            }
        } catch (err) {
            showAlert('Could not copy email', 'error');
        }
    }

    copyEmailBtn.addEventListener('click', () => {
        const emailText = contactEmail ? contactEmail.textContent.trim() : 'velorasquad.ai@gmail.com';
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(emailText)
                .then(setCopySuccessState)
                .catch(() => fallbackCopy(emailText));
        } else {
            fallbackCopy(emailText);
        }
    });
}

// ===========================
// Utility Functions
// ===========================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showAlert(message, type) {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Style the alert
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        ${type === 'success' ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);' : 'background: #f5576c;'}
    `;
    
    document.body.appendChild(alert);
    
    // Remove alert after 3 seconds
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// ===========================
// Scroll Animations
// ===========================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
const cards = document.querySelectorAll('.service-card, .portfolio-card, .stat-item, .contact-highlight-card');
cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// ===========================
// Active Navigation Link
// ===========================

window.addEventListener('scroll', () => {
    let current = '';
    
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ===========================
// Add CSS for animations
// ===========================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .nav-links.active {
        display: flex !important;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .nav-links a.active {
        opacity: 0.6;
        font-weight: bold;
    }
`;

document.head.appendChild(style);

// ===========================
// Page Load Animation
// ===========================

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

console.log('Velora Squad Website Loaded Successfully! 🚀');