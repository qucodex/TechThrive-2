/**
 * TechThrive 2.0 Main Script
 * Handles Countdown, Navigation, Modals, and Filtering
 */

// --- CONFIGURATION ---
const GOOGLE_FORM_URL = 'https://forms.gle/WojRUFj1ywbuKV766'; 

// Event Start Date (02 December 2025, 09:00 AM IST)
// Format: YYYY-MM-DDTHH:MM:SS
const EVENT_START_DATE = new Date('2025-12-02T09:00:00+05:30').getTime();


// --- DOM ELEMENTS ---
const elements = {
    navbar: document.getElementById('navbar'),
    mobileToggle: document.querySelector('.mobile-toggle'),
    navLinks: document.querySelector('.nav-links'),
    countdown: {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds'),
        msg: document.getElementById('event-started-msg'),
        container: document.getElementById('countdown')
    },
    modal: document.getElementById('registerModal'),
    formBtn: document.getElementById('googleFormBtn'),
    heroSlides: document.querySelectorAll('.slide')
};


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initCountdown();
    initSlideshow();
    initScrollEffects();
    
    // Set up Google Form button
    if(elements.formBtn) {
        elements.formBtn.addEventListener('click', () => {
            window.open(GOOGLE_FORM_URL, '_blank');
        });
    }
});


// --- MOBILE MENU ---
function initMobileMenu() {
    if(!elements.mobileToggle) return;
    
    elements.mobileToggle.addEventListener('click', () => {
        const isExpanded = elements.mobileToggle.getAttribute('aria-expanded') === 'true';
        elements.mobileToggle.setAttribute('aria-expanded', !isExpanded);
        elements.navLinks.classList.toggle('active');
        
        // Icon toggle
        const icon = elements.mobileToggle.querySelector('i');
        if(icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    // Close menu when clicking a link
    elements.navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            elements.navLinks.classList.remove('active');
            elements.mobileToggle.setAttribute('aria-expanded', 'false');
            const icon = elements.mobileToggle.querySelector('i');
            if(icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });
    // Close menu when clicking outside
document.addEventListener('click', (e) => {
    // If click is NOT inside navLinks or mobileToggle
    if (
        !elements.navLinks.contains(e.target) &&
        !elements.mobileToggle.contains(e.target)
    ) {
        elements.navLinks.classList.remove('active');
        elements.mobileToggle.setAttribute('aria-expanded', 'false');

        const icon = elements.mobileToggle.querySelector('i');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    }
});
}


// --- COUNTDOWN TIMER ---
function initCountdown() {
    if(!elements.countdown.days) return;

    const updateTimer = () => {
        const now = new Date().getTime();
        const distance = EVENT_START_DATE - now;

        if (distance < 0) {
            // Event started
            if(elements.countdown.container) elements.countdown.container.classList.add('hidden');
            if(elements.countdown.msg) elements.countdown.msg.classList.remove('hidden');
            clearInterval(timerInterval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        elements.countdown.days.innerText = String(days).padStart(2, '0');
        elements.countdown.hours.innerText = String(hours).padStart(2, '0');
        elements.countdown.minutes.innerText = String(minutes).padStart(2, '0');
        elements.countdown.seconds.innerText = String(seconds).padStart(2, '0');
    };

    updateTimer(); // Initial call
    const timerInterval = setInterval(updateTimer, 1000);
}


// --- HERO SLIDESHOW ---
function initSlideshow() {
    if(elements.heroSlides.length === 0) return;
    
    let currentSlide = 0;
    setInterval(() => {
        elements.heroSlides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % elements.heroSlides.length;
        elements.heroSlides[currentSlide].classList.add('active');
    }, 5000); // Change every 5 seconds
}


// --- SCROLL EFFECTS ---
function initScrollEffects() {
    window.addEventListener('scroll', () => {
        // Navbar transparency toggle
        if (window.scrollY > 50) {
            elements.navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
            elements.navbar.style.background = 'rgba(10, 14, 23, 0.98)';
        } else {
            elements.navbar.style.boxShadow = 'none';
            elements.navbar.style.background = 'rgba(10, 14, 23, 0.9)';
        }
    });
}


// --- MODAL HANDLING ---
// Exposed globally for onclick attributes
window.openRegisterModal = function() {
    if (elements.modal) {
        elements.modal.setAttribute('aria-hidden', 'false');
    } else {
        window.open(GOOGLE_FORM_URL, '_blank'); // fallback to form
    }
};


window.closeRegisterModal = function() {
    if(elements.modal) {
        elements.modal.setAttribute('aria-hidden', 'true');
    }
};

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') window.closeRegisterModal();
});


// --- FILTERS (Problem Statements Page) ---
// Initialize only if on the problems page
function initFilters() {
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.problem-card');
    const noResults = document.getElementById('noResults');

    if(!searchInput || !cards.length) return;

    function filterProblems() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        let visibleCount = 0;

        cards.forEach(card => {
            const title = card.getAttribute('data-title').toLowerCase();
            const category = card.getAttribute('data-category'); // track-a or track-b
            const textContent = card.innerText.toLowerCase();

            // Check Category Match
            const categoryMatch = (activeCategory === 'all') || (activeCategory === category);
            
            // Check Search Match
            const searchMatch = title.includes(searchTerm) || textContent.includes(searchTerm);

            if (categoryMatch && searchMatch) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Show/Hide No Results Message
        if (visibleCount === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
    }

    // Event Listeners
    searchInput.addEventListener('input', filterProblems);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProblems();
        });
    });
}