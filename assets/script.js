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

// Contact form - Simplified version with multiple fallbacks
const form = document.getElementById('inquiry-form');
const note = document.getElementById('form-note');

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

    // Try direct form submission first
    submitFormDirect(formData)
      .catch(() => {
        console.log('Direct submission failed, trying alternative method...');
        return submitFormAlternative(formData);
      })
      .catch(() => {
        console.log('All submission methods failed, showing mailto fallback...');
        showMailtoFallback(formData);
      });
  });
}

// Direct submission method
function submitFormDirect(formData) {
  return fetch('https://submit-form.com/2GKqoOcNb', {
    method: 'POST',
    body: formData,
    mode: 'cors',
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    console.log('Direct submission response:', response.status, response.statusText);
    if (response.ok || response.status === 200) {
      showSuccess();
      return Promise.resolve();
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  });
}

// Alternative submission method (without CORS mode)
function submitFormAlternative(formData) {
  return fetch('https://submit-form.com/2GKqoOcNb', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    console.log('Alternative submission response:', response.status);
    if (response.ok || response.status === 200) {
      showSuccess();
      return Promise.resolve();
    } else {
      throw new Error(`Alternative method failed: ${response.status}`);
    }
  });
}

// Mailto fallback for when all else fails
function showMailtoFallback(formData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const business = formData.get('business') || 'Not specified';
  const website = formData.get('website') || 'Not specified';
  const service = formData.get('service');
  const budget = formData.get('budget');
  const details = formData.get('details') || 'No additional details provided';

  const subject = encodeURIComponent(`New ${service} Inquiry from ${name}`);
  const body = encodeURIComponent(`
Name: ${name}
Email: ${email}
Business: ${business}
Current Website: ${website}
Service: ${service}
Budget: ${budget}

Project Details:
${details}

---
This message was sent from your website contact form.
  `);

  const mailtoLink = `mailto:weboutright@gmail.com?subject=${subject}&body=${body}`;
  
  note.className = 'form-note error';
  note.innerHTML = `
    Form submission is experiencing issues. Please:
    <br><br>
    <a href="${mailtoLink}" style="color: #2d7cff; text-decoration: underline;">
      Click here to send via your email client
    </a>
    <br><br>
    Or email me directly at: 
    <a href="mailto:weboutright@gmail.com" style="color: #2d7cff; text-decoration: underline;">
      weboutright@gmail.com
    </a>
  `;

  // Restore button
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.textContent = 'Send Message';
  submitBtn.disabled = false;
}

// Success handler
function showSuccess() {
  note.className = 'form-note success';
  note.textContent = 'Thanks! Your message has been sent successfully. I will reach out shortly.';
  form.reset();

  // Restore button
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.textContent = 'Send Message';
  submitBtn.disabled = false;
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
