// GK CREATIONS - Main Interactive JavaScript
// Handles Navigation, Cost Estimator, Forms & UI Interactivity

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCostEstimator();
  initContactForm();
  initModals();
  initSpotlightCards();
  initNumberCounters();
});

// 1. Navigation & Header Scroll State
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('active');
      mobileToggle.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        mobileToggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active Link Highlight based on current path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// 2. Interactive Cost Estimator Modal
let estimatorState = {
  websiteType: 'single', // 'single' (6999) or 'multi' (16999)
  pages: 1, // extra pages for multi
  domain: 'in', // 'none' (0), 'in' (900), 'com' (1400)
  whatsappCheckout: false, // 2500
  qrIntegration: false, // 1500
  logoBranding: false, // 3000
  seoAddon: false // 2000
};

function initCostEstimator() {
  const modal = document.getElementById('estimator-modal');
  if (!modal) return;

  calculateEstimate();
}

function openEstimator() {
  const modal = document.getElementById('estimator-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    calculateEstimate();
  }
}

function closeEstimator() {
  const modal = document.getElementById('estimator-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function setPackageType(type) {
  estimatorState.websiteType = type;
  document.querySelectorAll('.pkg-choice-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-type') === type);
  });
  
  const pagesContainer = document.getElementById('extra-pages-wrap');
  if (pagesContainer) {
    pagesContainer.style.display = type === 'multi' ? 'block' : 'none';
  }

  calculateEstimate();
}

function setDomainChoice(domain) {
  estimatorState.domain = domain;
  document.querySelectorAll('.domain-choice-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-domain') === domain);
  });
  calculateEstimate();
}

function toggleAddon(checkbox, addonKey) {
  estimatorState[addonKey] = checkbox.checked;
  calculateEstimate();
}

function setExtraPages(val) {
  estimatorState.pages = parseInt(val, 10) || 1;
  const label = document.getElementById('extra-pages-val');
  if (label) label.innerText = `${val} Pages`;
  calculateEstimate();
}

function calculateEstimate() {
  let total = 0;
  let breakdown = [];

  // Base Package
  if (estimatorState.websiteType === 'single') {
    total += 6999;
    breakdown.push('Single-Page Website: ₹6,999');
  } else {
    total += 16999;
    breakdown.push('Multi-Page Website (Up to 5 Pages): ₹16,999');
    if (estimatorState.pages > 5) {
      const extra = (estimatorState.pages - 5) * 1500;
      total += extra;
      breakdown.push(`Additional ${estimatorState.pages - 5} Pages: ₹${extra.toLocaleString('en-IN')}`);
    }
  }

  // Domain
  if (estimatorState.domain === 'in') {
    total += 900;
    breakdown.push('.in Domain: ₹900');
  } else if (estimatorState.domain === 'com') {
    total += 1400;
    breakdown.push('.com Domain: ₹1,400');
  }

  // Free Hosting Notice
  breakdown.push('High-Speed Cloud Hosting: FREE (Included)');
  breakdown.push('Maintenance Retainer: ₹0 (No Ongoing Fees)');

  // Add-ons
  if (estimatorState.whatsappCheckout) {
    total += 2500;
    breakdown.push('WhatsApp Cart & Checkout: ₹2,500');
  }
  if (estimatorState.qrIntegration) {
    total += 1500;
    breakdown.push('Branded QR Code Solutions: ₹1,500');
  }
  if (estimatorState.logoBranding) {
    total += 3000;
    breakdown.push('Logo & Visual Branding: ₹3,000');
  }
  if (estimatorState.seoAddon) {
    total += 2000;
    breakdown.push('Advanced SEO & Meta Setup: ₹2,000');
  }

  const totalEl = document.getElementById('estimator-total');
  if (totalEl) {
    totalEl.innerText = `₹${total.toLocaleString('en-IN')}`;
  }

  const whatsappBtn = document.getElementById('estimator-whatsapp-btn');
  if (whatsappBtn) {
    const text = `Hello Gokul! I estimated my project on the GK Creations website:\n\n${breakdown.join('\n')}\n\n*Estimated Total: ₹${total.toLocaleString('en-IN')}*\n\nCan we discuss the schedule and begin development?`;
    whatsappBtn.href = `https://wa.me/917904303676?text=${encodeURIComponent(text)}`;
  }
}

// 3. Contact Form Submission over WhatsApp
function initContactForm() {
  const form = document.getElementById('it-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value.trim();
    const business = form.querySelector('[name="businessName"]')?.value.trim();
    const phone = form.querySelector('[name="phone"]')?.value.trim();
    const projectType = form.querySelector('[name="projectType"]')?.value || 'Website Development';
    const message = form.querySelector('[name="message"]')?.value.trim();

    if (!name || !phone) {
      alert('Please provide your Name and Phone Number.');
      return;
    }

    const text = `Hello Gokul! New Project Inquiry from GK Creations website:
- Client Name: ${name}
- Business: ${business || 'Not Specified'}
- Phone: ${phone}
- Project Type: ${projectType}
- Project Details: ${message || 'No additional details provided'}

Please get back to me with the timeline and quote.`;

    const url = `https://wa.me/917904303676?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    form.reset();
  });
}

// 4. Modal Backdrop Close Handlers
function initModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => {
        m.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  });
}

// 5. Spotlight Card Mouse Illumination Effect (21st.dev Style)
function initSpotlightCards() {
  const cards = document.querySelectorAll('.service-card, .project-card, .pricing-card, .bento-card, .spotlight-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '-999px');
      card.style.setProperty('--mouse-y', '-999px');
    });
  });
}

// 6. Smooth Number Counter Animation (21st.dev Ticker Style)
function initNumberCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-counter'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        const duration = 1400;
        const start = performance.now();

        function update(now) {
          const progress = Math.min((now - start) / duration, 1);
          // Ease-out cubic curve
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(easeOut * target);
          el.textContent = `${prefix}${current}${suffix}`;
          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            el.textContent = `${prefix}${target}${suffix}`;
          }
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.25 });

  counters.forEach(c => observer.observe(c));
}
