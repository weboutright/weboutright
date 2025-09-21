/* ================================ */
/* WEB OUTRIGHT - MAIN JAVASCRIPT */
/* ================================ */

/* ================================ */
/* STRUCTURED DATA LOADING */
/* ================================ */
// Load Schema.org structured data from external JSON file
document.addEventListener('DOMContentLoaded', function() {
    // Load schema data asynchronously after critical content
    setTimeout(() => {
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
    }, 100);
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
    
    // Load Google Analytics asynchronously after initial page load - delayed for performance
    setTimeout(() => {
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
        
        // Make gtag available globally
        window.gtag = gtag;
    }, 2000); // Delay analytics by 2 seconds for better initial page load
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
    
    // Store current scroll position
    formScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    // Track analytics event
    if (typeof gtag === 'function') {
        gtag('event', 'submit', {'event_category': 'contact', 'event_label': 'contact_form'});
    }
    
    // Show submission feedback without leaving the page
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="mr-3">Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    submitButton.disabled = true;
    
    // Check if reCAPTCHA is loaded
    if (typeof grecaptcha === 'undefined') {
        console.warn('reCAPTCHA not loaded, submitting form without verification');
        // Submit form using AJAX to prevent page redirect
        submitFormAjax(event.target, submitButton, originalButtonText);
        return false;
    }
    
    // Execute reCAPTCHA
    grecaptcha.ready(function() {
        grecaptcha.execute('6LdEUM4rAAAAAIP5ReRsncx8zpbl-56yDSEAnQ3p', {action: 'submit'}).then(function(token) {
            // Add token to hidden input
            document.getElementById('g-recaptcha-response').value = token;
            console.log('reCAPTCHA token generated successfully');
            
            // Submit form using AJAX to prevent page redirect
            submitFormAjax(event.target, submitButton, originalButtonText);
        }).catch(function(error) {
            console.error('reCAPTCHA error:', error);
            // Submit form anyway on reCAPTCHA error using AJAX
            console.warn('Submitting form without reCAPTCHA due to error');
            submitFormAjax(event.target, submitButton, originalButtonText);
        });
    });
    
    return false; // Prevent default submission until reCAPTCHA is complete
}

// AJAX form submission to prevent page redirect and maintain scroll position
function submitFormAjax(form, submitButton, originalButtonText) {
    const formData = new FormData(form);
    
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Success - show success message
            submitButton.innerHTML = '<span class="mr-3">Message Sent!</span><i class="fas fa-check"></i>';
            submitButton.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            
            // Reset form
            form.reset();
            
            // Show success notification
            showNotification('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
                submitButton.style.background = '';
            }, 3000);
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        console.error('Form submission error:', error);
        
        // Reset button
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        
        // Show error notification
        showNotification('There was an issue sending your message. Please try again.', 'error');
    });
}

// Notification system
function showNotification(message, type) {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.form-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `form-notification fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg max-w-sm transform transition-all duration-300 translate-x-full opacity-0`;
    
    if (type === 'success') {
        notification.className += ' bg-green-500 text-white';
        notification.innerHTML = `<div class="flex items-center"><i class="fas fa-check-circle mr-2"></i>${message}</div>`;
    } else {
        notification.className += ' bg-red-500 text-white';
        notification.innerHTML = `<div class="flex items-center"><i class="fas fa-exclamation-circle mr-2"></i>${message}</div>`;
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Restore scroll position if form submission fails or is interrupted
window.addEventListener('pageshow', function(event) {
    if (event.persisted && formScrollPosition > 0) {
        setTimeout(function() {
            window.scrollTo(0, formScrollPosition);
        }, 50);
    }
});

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
/* MOBILE MENU FUNCTIONALITY */
/* ================================ */
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const body = document.body;

    // Toggle mobile menu
    function toggleMobileMenu() {
        const isActive = mobileMenu.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // Open mobile menu
    function openMobileMenu() {
        mobileMenu.classList.add('active');
        hamburgerIcon.classList.add('active');
        body.style.overflow = 'hidden'; // Prevent background scrolling
        body.style.position = 'fixed'; // Additional scroll prevention
        body.style.width = '100%'; // Maintain width when position fixed
    }

    // Close mobile menu
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        hamburgerIcon.classList.remove('active');
        body.style.overflow = ''; // Restore scrolling
        body.style.position = ''; // Restore position
        body.style.width = ''; // Restore width
    }

    // Event listeners
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking on overlay (outside the panel)
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                closeMobileMenu();
            }
        });
    }

    // Close menu when clicking on menu links
    const menuLinks = document.querySelectorAll('.mobile-menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
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
