/* ================================ */
/* WEB OUTRIGHT - MAIN JAVASCRIPT */
/* ================================ */

/* ================================ */
/* STRUCTURED DATA LOADING */
/* ================================ */
// Load Schema.org structured data from external JSON file
document.addEventListener('DOMContentLoaded', function() {
    fetch('./schema.json')
        .then(response => response.json())
        .then(data => {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(data);
            document.head.appendChild(script);
        })
        .catch(error => {
            console.warn('Schema.org data could not be loaded:', error);
        });
});

/* ================================ */
/* PERFORMANCE MONITORING */
/* ================================ */
window.addEventListener('load', function() {
    // Log Core Web Vitals
    if ('web-vital' in window) {
        console.log('Page load performance optimized');
    }
    
    // Report page load time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log('Page load time:', loadTime + 'ms');
    
    // Register service worker for caching (if available)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(function() {
            // Service worker not available, continue without caching
        });
    }
    
    // Load Google Analytics asynchronously after initial page load
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-LD3JGJF16R';
    script.async = true;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-LD3JGJF16R', {
        // Minimize data collection for better performance
        send_page_view: false,
        cookie_flags: 'SameSite=None;Secure'
    });
    
    // Send page view after everything is loaded
    gtag('event', 'page_view');
});

/* ================================ */
/* AOS ANIMATION LOADING */
/* ================================ */
document.addEventListener('DOMContentLoaded', function() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Load AOS unless user specifically prefers reduced motion
    if (!prefersReducedMotion) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
        script.async = true;
        script.onload = function() {
            AOS.init({
                duration: 600, // Restored normal duration
                easing: 'ease-in-out',
                once: true,
                offset: 50, // Restored normal offset
                disable: false,
                // Disable on mobile only if performance is poor
                disable: window.innerWidth < 576 ? true : false
            });
        };
        document.head.appendChild(script);
    } else {
        // Remove AOS attributes only if user prefers reduced motion
        const aosElements = document.querySelectorAll('[data-aos]');
        aosElements.forEach(el => {
            el.removeAttribute('data-aos');
            el.removeAttribute('data-aos-delay');
        });
    }
});

/* ================================ */
/* PREVENT AUTO-SCROLL ON REFRESH */
/* ================================ */
// Prevent unwanted scrolling on page refresh, especially on mobile
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Temporarily disable smooth scrolling during page load
document.documentElement.style.scrollBehavior = 'auto';

// Reset scroll position on page load
window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});

// Re-enable smooth scrolling after page is fully loaded
window.addEventListener('load', function() {
    // Small delay to ensure everything is loaded
    setTimeout(function() {
        document.documentElement.style.scrollBehavior = 'smooth';
    }, 100);
});

// Handle hash fragments in URL that might cause unwanted scrolling
window.addEventListener('DOMContentLoaded', function() {
    // If there's a hash in the URL, temporarily remove it to prevent auto-scroll
    if (window.location.hash) {
        const hash = window.location.hash;
        // Remove hash from URL without triggering scroll
        history.replaceState(null, null, window.location.pathname + window.location.search);
        // Scroll to top
        window.scrollTo(0, 0);
        // Restore hash after a delay if needed
        setTimeout(function() {
            if (hash && document.querySelector(hash)) {
                history.replaceState(null, null, window.location.pathname + window.location.search + hash);
            }
        }, 500);
    }
});

/* ================================ */
/* FAQ FUNCTIONALITY */
/* ================================ */
function toggleFaq(id) {
    const answer = document.getElementById(`answer-${id}`);
    const icon = document.getElementById(`icon-${id}`);
    
    if (answer.classList.contains('hidden')) {
        answer.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        answer.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}

// Make toggleFaq globally available
window.toggleFaq = toggleFaq;

/* ================================ */
/* MOBILE MENU FUNCTIONALITY */
/* ================================ */
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuPanel = document.getElementById('mobileMenuPanel');
    const hamburgerIcon = document.getElementById('hamburgerIcon');
    const closeIcon = document.getElementById('closeIcon');
    
    function openMobileMenu() {
        mobileMenu.classList.remove('hidden');
        setTimeout(() => {
            mobileMenuPanel.classList.remove('translate-x-full');
        }, 10);
        hamburgerIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMobileMenu() {
        mobileMenuPanel.classList.add('translate-x-full');
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 300);
        hamburgerIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
        document.body.style.overflow = '';
    }
    
    // Make closeMobileMenu globally available
    window.closeMobileMenu = closeMobileMenu;
    
    // Mobile menu event listeners
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            if (mobileMenu.classList.contains('hidden')) {
                openMobileMenu();
            } else {
                closeMobileMenu();
            }
        });
    }
    
    // Close menu when clicking overlay
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                closeMobileMenu();
            }
        });
    }
});

/* ================================ */
/* BACK TO TOP FUNCTIONALITY */
/* ================================ */
const backToTopButton = document.getElementById('backToTop');
let ticking = false;

// Throttled scroll handler for better performance
function updateBackToTop() {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
    ticking = false;
}

// Optimized scroll listener using requestAnimationFrame
window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateBackToTop);
        ticking = true;
    }
}, { passive: true });

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Make scrollToTop globally available
window.scrollToTop = scrollToTop;

/* ================================ */
/* RECAPTCHA FUNCTIONALITY */
/* ================================ */
function submitForm() {
    // Check if reCAPTCHA is loaded
    if (typeof grecaptcha === 'undefined') {
        console.error('reCAPTCHA not loaded');
        alert('Please wait for the page to fully load and try again.');
        return;
    }
    
    // Execute reCAPTCHA with the site key
    grecaptcha.ready(function() {
        grecaptcha.execute('6LdEUM4rAAAAAIP5ReRsncx8zpbl-56yDSEAnQ3p', {action: 'submit'}).then(function(token) {
            // Add token to hidden input
            document.getElementById('g-recaptcha-response').value = token;
            console.log('reCAPTCHA token generated successfully');
            // Submit the form
            document.querySelector('form[action*="submit-form.com"]').submit();
        }).catch(function(error) {
            console.error('reCAPTCHA error:', error);
            alert('There was an issue with the security verification. Please try again.');
        });
    });
}

// Make submitForm globally available
window.submitForm = submitForm;

/* ================================ */
/* FORM SUBMISSION HANDLER */
/* ================================ */
function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Check if reCAPTCHA is loaded
    if (typeof grecaptcha === 'undefined') {
        console.warn('reCAPTCHA not loaded, submitting form without verification');
        // Submit form directly if reCAPTCHA is not available
        event.target.submit();
        return false;
    }
    
    // Execute reCAPTCHA
    grecaptcha.ready(function() {
        grecaptcha.execute('6LdEUM4rAAAAAIP5ReRsncx8zpbl-56yDSEAnQ3p', {action: 'submit'}).then(function(token) {
            // Add token to hidden input
            document.getElementById('g-recaptcha-response').value = token;
            console.log('reCAPTCHA token generated successfully');
            
            // Submit the form
            event.target.submit();
        }).catch(function(error) {
            console.error('reCAPTCHA error:', error);
            // Submit form anyway on reCAPTCHA error
            console.warn('Submitting form without reCAPTCHA due to error');
            event.target.submit();
        });
    });
    
    return false; // Prevent default submission until reCAPTCHA is complete
}

// Make handleFormSubmit globally available
window.handleFormSubmit = handleFormSubmit;

function onRecaptchaSuccess(token) {
    // This function is no longer needed with the new implementation
    // but keeping it for compatibility
    document.getElementById('g-recaptcha-response').value = token;
    document.querySelector('form[action*="submit-form.com"]').submit();
}

/* ================================ */
/* RECAPTCHA LOADING */
/* ================================ */
// Load reCAPTCHA only when user interacts with the form
let recaptchaLoaded = false;

function loadRecaptcha() {
    if (!recaptchaLoaded) {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?render=6LdEUM4rAAAAAIP5ReRsncx8zpbl-56yDSEAnQ3p';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        recaptchaLoaded = true;
    }
}

// Load reCAPTCHA when user focuses on contact form
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('form[action*="submit-form.com"]');
    if (contactForm) {
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', loadRecaptcha, { once: true });
        });
    }
});

/* ================================ */
/* ANALYTICS EVENT TRACKING */
/* ================================ */
// Make gtag globally available for onclick events
window.gtag = function() {
    if (window.dataLayer) {
        window.dataLayer.push(arguments);
    }
};
