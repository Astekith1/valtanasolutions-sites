(function(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Example of simple config override capability (edit values below or set via JSON)
  const config = {
    founderName: 'Van Vo', // change once here
    email: 'vanvo@valtanasolutions.com',
    phoneText: '+1 (469)-773-1102',
    phoneHref: '+14697731102',
    linkedin: 'https://www.linkedin.com/in/vvo6/'
  };
  const byId = id => document.getElementById(id);
  const set = (id, text) => { const n = byId(id); if (n) n.textContent = text; };
  const setHref = (id, href, text) => { const n = byId(id); if (n){ n.href = href; if (text) n.textContent = text; } };

  set('founder-name', config.founderName);
  set('footer-contact-name', config.founderName);
  setHref('footer-contact-email', 'mailto:' + config.email, config.email);
  setHref('footer-contact-phone', 'tel:' + config.phoneHref, config.phoneText);
  const li = document.getElementById('linkedin'); if (li) li.href = config.linkedin;

  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', navToggle.classList.contains('active'));
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe sections and cards
  const animateElements = document.querySelectorAll('.section, .card, .process-step');
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animateElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.transition = 'none';
    });
    observer.disconnect();
  }

  // Contact Form Handling
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    // Web3Forms configuration
    const WEB3FORMS_ACCESS_KEY = '7cd4f79c-032f-422f-9657-2f85512403eb';
    const WEB3FORMS_API_URL = 'https://api.web3forms.com/submit';

    // Helper functions
    const showError = (fieldId, message) => {
      const errorEl = document.getElementById(`${fieldId}-error`);
      if (errorEl) {
        errorEl.textContent = message;
      }
    };

    const clearError = (fieldId) => {
      const errorEl = document.getElementById(`${fieldId}-error`);
      if (errorEl) {
        errorEl.textContent = '';
      }
    };

    const showMessage = (message, type) => {
      const messageEl = document.getElementById('form-message');
      if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `form-message ${type}`;
        messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    };

    const clearMessage = () => {
      const messageEl = document.getElementById('form-message');
      if (messageEl) {
        messageEl.textContent = '';
        messageEl.className = 'form-message';
      }
    };

    const setLoading = (loading) => {
      const submitBtn = document.getElementById('submit-btn');
      if (submitBtn) {
        if (loading) {
          submitBtn.classList.add('loading');
          submitBtn.disabled = true;
        } else {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }
      }
    };

    // Real-time validation
    const validateField = (field) => {
      const value = field.value.trim();
      const fieldId = field.id;
      
      clearError(fieldId);
      clearMessage();

      if (field.hasAttribute('required') && !value) {
        showError(fieldId, 'This field is required');
        return false;
      }

      if (field.type === 'email' && value && !field.validity.valid) {
        showError(fieldId, 'Please enter a valid email address');
        return false;
      }

      return true;
    };

    // Add validation on blur
    const formFields = contactForm.querySelectorAll('input, textarea');
    formFields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.validity.valid || !field.value.trim()) {
          clearError(field.id);
        }
      });
    });

    // Validate radio buttons
    const updatesRadio = contactForm.querySelectorAll('input[name="updates"]');
    updatesRadio.forEach(radio => {
      radio.addEventListener('change', () => {
        clearError('updates');
        clearMessage();
      });
    });

    // Form submission
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      clearMessage();
      
      // Validate all fields
      let isValid = true;
      formFields.forEach(field => {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      // Validate radio buttons
      const updatesChecked = contactForm.querySelector('input[name="updates"]:checked');
      if (!updatesChecked) {
        showError('updates', 'Please select an option');
        isValid = false;
      }

      if (!isValid) {
        showMessage('Please fill in all required fields correctly.', 'error');
        return;
      }

      // Prepare form data for Web3Forms
      const formData = new FormData(contactForm);
      
      // Create submission object with access key and form fields
      const submissionData = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: 'New Contact Form Submission - Valtana Solutions',
        from_name: 'Valtana Solutions Contact Form',
        email: formData.get('email'),
        name: formData.get('name'),
        message: formData.get('message'),
        phone: formData.get('phone') || 'Not provided',
        updates: formData.get('updates') || 'Not selected'
      };

      setLoading(true);

      // Submit to Web3Forms API
      try {
        const response = await fetch(WEB3FORMS_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(submissionData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
          showMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
          contactForm.reset();
          // Scroll to message
          document.getElementById('form-message').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          showMessage('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        showMessage('Sorry, there was an error sending your message. Please check your connection and try again.', 'error');
      } finally {
        setLoading(false);
      }
    });
  }
})();
