// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('main-nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  });

  // Close menu when clicking a link
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (nav.classList.contains('open')){
      nav.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.classList.remove('menu-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }));
}

// Current year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Pricing service selection for contact form
document.addEventListener('DOMContentLoaded', () => {
  const pricingButtons = document.querySelectorAll('[data-service]');
  const serviceSelect = document.querySelector('select[name="service"]');
  
  pricingButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const selectedService = e.target.getAttribute('data-service');
      if (serviceSelect && selectedService) {
        // Wait a moment for the scroll to complete, then set the service
        setTimeout(() => {
          serviceSelect.value = selectedService;
          // Add a subtle highlight to show it was pre-selected
          serviceSelect.style.borderColor = '#2d7cff';
          serviceSelect.style.boxShadow = '0 0 0 4px rgba(45,124,255,.15)';
          setTimeout(() => {
            serviceSelect.style.borderColor = '';
            serviceSelect.style.boxShadow = '';
          }, 2000);
        }, 800);
      }
    });
  });
});

// FAQ: close others when opening one
const detailsList = document.querySelectorAll('.faq details');
detailsList.forEach(d => {
  d.addEventListener('toggle', () => {
    if (d.open) {
      detailsList.forEach(o => { if (o !== d) o.removeAttribute('open'); });
    }
  });
});

// Floating back-to-top visibility after hero
document.addEventListener('DOMContentLoaded', () => {
  const toTop = document.getElementById('toTop');
  const hero = document.querySelector('.hero');
  
  if (toTop && hero) {
    const threshold = () => (hero.offsetTop + hero.offsetHeight * 0.6);
    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > threshold()) {
        toTop.classList.add('show');
      } else {
        toTop.classList.remove('show');
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial check
    onScroll();
    
    // Also ensure the button actually scrolls to top when clicked
    toTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

// Hook the contact form to show a success modal without navigating away
(function(){
  const form = document.getElementById('inquiry-form');
  if (!form) return;

  // Create a hidden iframe target for the form so the page doesn't navigate
  let iframe = document.getElementById('form-target');
  if (!iframe){
    iframe = document.createElement('iframe');
    iframe.name = 'form-target';
    iframe.id = 'form-target';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }
  form.setAttribute('target','form-target');

  const modalBackdrop = document.getElementById('thankyou-modal');
  let formSubmitting = false; // gate to avoid showing modal on initial iframe load

  const bindClose = () => {
    if (!modalBackdrop) return;
    // Close buttons/links
    modalBackdrop.querySelectorAll('.modal-close').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        hideModal();
      });
    });
    // Click outside
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) hideModal();
    });
    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('show')) hideModal();
    });
  };

  const showModal = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
    const focusEl = modalBackdrop.querySelector('.modal-close, .btn');
    if (focusEl) focusEl.focus();
  };
  const hideModal = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('show');
    document.body.style.overflow = '';
  };
  bindClose();

  // Show modal only after a real submit completes
  iframe.addEventListener('load', () => {
    if (!formSubmitting) return; // ignore initial/load unrelated events
    formSubmitting = false;
    showModal();
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn){
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
    }
    form.reset();
  });

  form.addEventListener('submit', () => {
    formSubmitting = true;
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn){
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
    }
  });
})();

  // Privacy Policy modal functionality
  const privacyModal = document.getElementById('privacy-modal');
  const privacyLink = document.getElementById('privacy-link');
  
  if (privacyLink && privacyModal) {
    privacyLink.addEventListener('click', function(e) {
      e.preventDefault();
      privacyModal.style.display = 'flex';
      privacyModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
    
    // Close privacy modal
    privacyModal.addEventListener('click', function(e) {
      if (e.target === privacyModal || e.target.classList.contains('modal-close')) {
        privacyModal.style.display = 'none';
        privacyModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // Terms of Service modal functionality
  const termsModal = document.getElementById('terms-modal');
  const termsLink = document.getElementById('terms-link');
  
  if (termsLink && termsModal) {
    termsLink.addEventListener('click', function(e) {
      e.preventDefault();
      termsModal.style.display = 'flex';
      termsModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
    
    // Close terms modal
    termsModal.addEventListener('click', function(e) {
      if (e.target === termsModal || e.target.classList.contains('modal-close')) {
        termsModal.style.display = 'none';
        termsModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // Cookies modal functionality
  const cookiesModal = document.getElementById('cookies-modal');
  const cookiesLink = document.getElementById('cookies-link');
  
  if (cookiesLink && cookiesModal) {
    cookiesLink.addEventListener('click', function(e) {
      e.preventDefault();
      cookiesModal.style.display = 'flex';
      cookiesModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
    
    // Close cookies modal
    cookiesModal.addEventListener('click', function(e) {
      if (e.target === cookiesModal || e.target.classList.contains('modal-close')) {
        cookiesModal.style.display = 'none';
        cookiesModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
      }
    });
  }
