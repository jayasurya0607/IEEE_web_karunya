/* ============================================
   IEEE Student Branch - Academic Website
   JavaScript - Smooth Animations & Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initNavigation();
    initParallax();
    initScrollAnimations();
    initSmoothScroll();
    initFormHandler();
    initAboutGallery();
});

/* ============================================
   Navigation
   ============================================ */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll(); // Check initial state

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ============================================
   Parallax Effect
   ============================================ */
function initParallax() {
    const heroParallax = document.getElementById('heroParallax');

    if (!heroParallax) return;

    let ticking = false;

    function updateParallax() {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector('.hero').offsetHeight;

        // Only apply parallax when hero is visible
        if (scrollY < heroHeight) {
            // Subtle parallax - background moves at 0.4x scroll speed
            const translateY = scrollY * 0.4;
            heroParallax.style.transform = `translateY(${translateY}px)`;
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

/* ============================================
   Scroll Animations (Intersection Observer)
   ============================================ */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.scroll-animate');

    if (!animatedElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.dataset.delay || 0;

                setTimeout(() => {
                    element.classList.add('visible');
                }, delay);

                // Unobserve after animation
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/* ============================================
   Smooth Scrolling
   ============================================ */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip if just "#"
            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   Form Handler
   ============================================ */
function initFormHandler() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Simple validation
        if (!data.name || !data.email || !data.message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Simulate form submission (no backend)
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        submitButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
                <circle cx="12" cy="12" r="10" stroke-dasharray="30" stroke-dashoffset="10"></circle>
            </svg>
            Sending...
        `;
        submitButton.disabled = true;

        // Simulate async operation
        setTimeout(() => {
            submitButton.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Message Sent!
            `;

            contactForm.reset();
            showNotification('Thank you for your message! We will get back to you soon.', 'success');

            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 3000);
        }, 1500);
    });
}

/* ============================================
   About Section - Scroll Image Gallery
   ============================================ */
function initAboutGallery() {
    const gallery = document.getElementById('aboutImageGallery');

    if (!gallery) return;

    const images = gallery.querySelectorAll('.gallery-image');
    const indicators = gallery.querySelectorAll('.indicator');
    const aboutSection = document.getElementById('about');

    if (!images.length || !aboutSection) return;

    let currentIndex = 0;
    const totalImages = images.length;

    // Function to update active image
    function setActiveImage(index) {
        if (index === currentIndex) return;

        // Remove active from all
        images.forEach(img => img.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));

        // Add active to current
        images[index].classList.add('active');
        indicators[index].classList.add('active');

        currentIndex = index;
    }

    // Scroll-based image switching
    function handleScroll() {
        const sectionRect = aboutSection.getBoundingClientRect();
        const sectionHeight = aboutSection.offsetHeight;
        const viewportHeight = window.innerHeight;

        // Only start transitioning when the section top reaches the viewport
        // sectionRect.top = distance from viewport top to section top
        // Positive = section is below viewport, Negative = section has scrolled up

        // Calculate progress only when section is fully visible
        // Start: when section top reaches 30% down the viewport (clearly in view)
        // Use 80% of the section height for all transitions (much slower)

        const startThreshold = viewportHeight * 0.3; // Section must be near top of viewport
        const scrollDistance = sectionHeight * 0.8;  // Use 80% of section height for transitions

        // If section hasn't reached the start threshold, show first image
        if (sectionRect.top > startThreshold) {
            if (currentIndex !== 0) setActiveImage(0);
            return;
        }

        // If section has scrolled past our scroll distance, show last image
        if (sectionRect.top < startThreshold - scrollDistance) {
            if (currentIndex !== totalImages - 1) setActiveImage(totalImages - 1);
            return;
        }

        // Calculate progress within the section
        // Progress goes from 0 to 1 as we scroll through the scroll distance
        const currentPosition = startThreshold - sectionRect.top;
        const progress = Math.max(0, Math.min(1, currentPosition / scrollDistance));

        // Determine which image to show based on progress
        const imageIndex = Math.min(
            totalImages - 1,
            Math.floor(progress * totalImages)
        );

        setActiveImage(imageIndex);
    }

    // Click on indicators to change image
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            setActiveImage(index);
        });
    });

    // Throttled scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial check
    handleScroll();
}

/* ============================================
   Notification System
   ============================================ */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close" aria-label="Close notification">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `;

    // Add styles dynamically
    notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 9999;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#1a4480'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.4s ease;
    `;

    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 1rem;
    `;

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        display: flex;
        opacity: 0.8;
        transition: opacity 0.2s;
    `;
    closeBtn.querySelector('svg').style.cssText = `
        width: 18px;
        height: 18px;
    `;

    document.body.appendChild(notification);

    // Trigger animation
    requestAnimationFrame(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    });

    // Close button handler
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 400);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 400);
        }
    }, 5000);
}

/* ============================================
   Additional Enhancements
   ============================================ */

// Add active state to nav links based on scroll position
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
}

// Initialize active nav links after DOM is ready
document.addEventListener('DOMContentLoaded', initActiveNavLinks);

// Add CSS for active nav link
const activeNavStyle = document.createElement('style');
activeNavStyle.textContent = `
    .nav-link.active::after {
        width: 100%;
    }
    .nav-link.active {
        color: var(--color-primary) !important;
    }
    .navbar:not(.scrolled) .nav-link.active {
        color: var(--color-white) !important;
    }
    
    /* Spin animation for loading state */
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .spin {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(activeNavStyle);
