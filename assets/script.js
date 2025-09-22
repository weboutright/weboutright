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

// Contact form with invisible reCAPTCHA
const form = document.getElementById('inquiry-form');
const note = document.getElementById('form-note');
let recaptchaWidget;

// Initialize invisible reCAPTCHA
window.onRecaptchaLoad = function() {
  if (form) {
    const recaptchaDiv = document.createElement('div');
    recaptchaDiv.id = 'recaptcha-widget';
    recaptchaDiv.style.display = 'none';
    form.appendChild(recaptchaDiv);
    
    recaptchaWidget = grecaptcha.render('recaptcha-widget', {
      'sitekey': '6LdEUM4rAAAAAIP5ReRsncx8zpbl-56yDSEAnQ3p',
      'callback': submitForm,
      'size': 'invisible'
    });
  }
};

function submitForm(recaptchaToken) {
  const formData = new FormData(form);
  formData.append('g-recaptcha-response', recaptchaToken);
  
  fetch('https://submit-form.com/2GKqoOcNb', {
    method: 'POST',
    body: formData,
  })
  .then(response => {
    if (response.ok) {
      window.location.href = 'message-received.html';
    } else {
      window.location.href = 'message-received.html';
    }
  })
  .catch(() => {
    window.location.href = 'message-received.html';
  });
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    if (recaptchaWidget !== undefined) {
      grecaptcha.execute(recaptchaWidget);
    } else {
      window.location.href = 'message-received.html';
    }
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
