// LGB Autowork - Main JavaScript

// Language Switching
function switchLanguage(lang) {
    document.body.className = lang;
    localStorage.setItem('lgb-language', lang);

    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.style.background = 'transparent';
        btn.style.color = '#B0B0B0';
    });
    event.target.style.background = '#FF6B00';
    event.target.style.color = '#000';
}

// Load saved language preference
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('lgb-language') || 'en';
    document.body.className = savedLang;

    // Set active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.textContent.includes(savedLang.toUpperCase())) {
            btn.style.background = '#FF6B00';
            btn.style.color = '#000';
        }
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Mobile Menu Toggle (if needed)
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

console.log('LGB Autowork website loaded successfully!');
