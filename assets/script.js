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

// Contact form with FormSpark and invisible reCAPTCHA
const form = document.getElementById('inquiry-form');
const note = document.getElementById('form-note');
let recaptchaWidget;

// Initialize invisible reCAPTCHA when the page loads
window.onRecaptchaLoad = function() {
  console.log('reCAPTCHA loaded');
  if (form) {
    // Create a hidden div for the invisible reCAPTCHA
    const recaptchaDiv = document.createElement('div');
    recaptchaDiv.id = 'recaptcha-widget';
    recaptchaDiv.style.display = 'none';
    form.appendChild(recaptchaDiv);
    
    try {
      recaptchaWidget = grecaptcha.render('recaptcha-widget', {
        'sitekey': '6LdEUM4rAAAAAIP5ReRsncx8zpbl-56yDSEAnQ3p',
        'callback': submitForm,
        'size': 'invisible'
      });
      console.log('reCAPTCHA widget created:', recaptchaWidget);
    } catch (error) {
      console.error('reCAPTCHA render error:', error);
    }
  }
};

function submitForm(recaptchaToken) {
  // This function is called when reCAPTCHA is solved
  const formData = new FormData(form);
  formData.append('g-recaptcha-response', recaptchaToken);
  
  // Submit to FormSpark
  fetch('https://submit-form.com/2GKqoOcNb', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    console.log('Response status:', response.status);
    if (response.ok) {
      return response.json().catch(() => ({ success: true }));
    } else {
      return response.json().catch(() => ({ error: 'Server error' }));
    }
  })
  .then(data => {
    console.log('Response data:', data);
    if (data.success !== false) {
      note.className = 'form-note success';
      note.textContent = 'Thanks! Your message has been sent successfully. I will reach out shortly.';
      form.reset();
    } else {
      throw new Error(data.error || 'Form submission failed');
    }
  })
  .catch(error => {
    console.error('Form submission error:', error);
    note.className = 'form-note error';
    note.textContent = 'Sorry, there was an error sending your message. Please try again or email me directly at weboutright@gmail.com';
  })
  .finally(() => {
    // Restore button
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
    if (recaptchaWidget !== undefined) {
      grecaptcha.reset(recaptchaWidget);
    }
  });
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    note.className = 'form-note';

    const formData = new FormData(form);
    const required = ['name','email','service','budget'];
    
    // Validate required fields
    for (const key of required) {
      const v = (formData.get(key) || '').toString().trim();
      if (!v) {
        note.textContent = 'Please complete all required fields.';
        note.classList.add('error');
        return;
      }
    }

    // Validate email format
    const email = formData.get('email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      note.textContent = 'Please provide a valid email address.';
      note.classList.add('error');
      return;
    }

    // Show loading state
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Execute invisible reCAPTCHA
    if (recaptchaWidget !== undefined) {
      grecaptcha.execute(recaptchaWidget);
    } else {
      // Fallback: submit without reCAPTCHA if it failed to load
      console.warn('reCAPTCHA not loaded, submitting without it');
      submitFormWithoutRecaptcha();
    }
  });
}

// Fallback submission without reCAPTCHA
function submitFormWithoutRecaptcha() {
  const formData = new FormData(form);
  
  fetch('https://submit-form.com/2GKqoOcNb', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    console.log('Response status:', response.status);
    if (response.ok) {
      return response.json().catch(() => ({ success: true }));
    } else {
      return response.json().catch(() => ({ error: 'Server error' }));
    }
  })
  .then(data => {
    console.log('Response data:', data);
    if (data.success !== false) {
      note.className = 'form-note success';
      note.textContent = 'Thanks! Your message has been sent successfully. I will reach out shortly.';
      form.reset();
    } else {
      throw new Error(data.error || 'Form submission failed');
    }
  })
  .catch(error => {
    console.error('Form submission error:', error);
    note.className = 'form-note error';
    note.textContent = 'Sorry, there was an error sending your message. Please try again or email me directly at weboutright@gmail.com';
  })
  .finally(() => {
    // Restore button
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
  });
}

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
