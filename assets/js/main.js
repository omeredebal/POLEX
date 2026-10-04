/**
 * POLEX TRADE & CONSULTANCY - MASTER APPLICATION SCRIPT
 * Modular Interactive B2B Features
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTradeMap();
  initProductFilter();
  initRfqWizard();
  initGallery();
  initContactForm();
  initFloatingActions();
  initScrollAnimations();
});

/* --- 1. Navbar & Mobile Drawer --- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  const closeBtn = document.querySelector('.mobile-drawer-close');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  function openDrawer() {
    drawer?.classList.add('open');
    overlay?.classList.add('open');
    toggle?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer?.classList.remove('open');
    overlay?.classList.remove('open');
    toggle?.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggle?.addEventListener('click', () => {
    if (drawer?.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  closeBtn?.addEventListener('click', closeDrawer);
  overlay?.addEventListener('click', closeDrawer);

  document.querySelectorAll('.mobile-drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer?.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* --- 2. Interactive World Map & Trade Corridors --- */
function initTradeMap() {
  const corridorCard = document.getElementById('mapCorridorDetails');
  if (!corridorCard) return;

  const corridors = {
    ankara: {
      title: "Ankara Central Hub (HQ)",
      desc: "Command center for regulatory approvals, letters of credit (L/C), laboratory analysis, and strategic sourcing.",
      metric: "HQ Operations"
    },
    rotterdam: {
      title: "European Union Corridor (Rotterdam / Hamburg)",
      desc: "Continuous outbound shipping for premium textiles, pharmaceutical excipients, furniture, and custom engineering.",
      metric: "Transit: 4-6 Days"
    },
    dubai: {
      title: "MENA & Gulf Corridor (Jebel Ali / Jeddah)",
      desc: "Agricultural bulk commodities, dairy derivatives, hospital consumables, and specialized building materials.",
      metric: "Transit: 5-8 Days"
    },
    almaty: {
      title: "CIS & Central Asia Corridor (Baku / Almaty)",
      desc: "Overland and rail intermodal transport for pharmaceuticals, medical equipment, and heavy agricultural machinery.",
      metric: "Transit: 7-10 Days"
    },
    lagos: {
      title: "African Atlantic Corridor (Lagos / Tema)",
      desc: "Essential medical supplies, food commodities, construction steel, and industrial tools dispatched via sea lines.",
      metric: "Transit: 12-16 Days"
    }
  };

  document.querySelectorAll('.map-hotspot').forEach(spot => {
    spot.addEventListener('mouseenter', () => {
      const key = spot.getAttribute('data-corridor');
      const data = corridors[key];
      if (data) {
        corridorCard.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <h4 class="map-corridor-title" style="margin:0;">${data.title}</h4>
            <span style="font-size:0.75rem; background:rgba(201,151,56,0.2); color:#E0B45C; padding:2px 8px; border-radius:12px; font-weight:700;">${data.metric}</span>
          </div>
          <p class="map-corridor-desc">${data.desc}</p>
        `;
      }
    });
  });
}

/* --- 3. Product Catalog Filter --- */
function initProductFilter() {
  const tabs = document.querySelectorAll('.product-tab');
  const cards = document.querySelectorAll('.product-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Clicking Inquire on product jumps to RFQ and selects category
  document.querySelectorAll('.btn-inquire-product').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const category = btn.getAttribute('data-category');
      const rfqSelect = document.getElementById('rfqCommodity');
      if (rfqSelect && category) {
        rfqSelect.value = category;
      }
      const rfqSec = document.getElementById('rfq-section');
      if (rfqSec) {
        rfqSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* --- 4. Interactive B2B RFQ (Request for Quotation) Wizard --- */
function initRfqWizard() {
  let currentStep = 1;
  const totalSteps = 4;

  const prevBtn = document.getElementById('rfqPrevBtn');
  const nextBtn = document.getElementById('rfqNextBtn');
  const submitBtn = document.getElementById('rfqSubmitBtn');
  const rfqForm = document.getElementById('rfqWizardForm');

  if (!rfqForm) return;

  function updateStepsUI() {
    // Hide all step contents
    document.querySelectorAll('.rfq-step-content').forEach(c => {
      c.classList.remove('active');
    });

    // Show current step content
    const activeContent = document.getElementById(`rfqStepContent${currentStep}`);
    activeContent?.classList.add('active');

    // Update stepper headers
    document.querySelectorAll('.rfq-step').forEach(stepEl => {
      const stepNum = parseInt(stepEl.getAttribute('data-step') || '1', 10);
      stepEl.classList.remove('active', 'completed');
      if (stepNum === currentStep) {
        stepEl.classList.add('active');
      } else if (stepNum < currentStep) {
        stepEl.classList.add('completed');
      }
    });

    // Navigation button states
    if (prevBtn) {
      prevBtn.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    }

    if (currentStep === totalSteps) {
      if (nextBtn) nextBtn.style.display = 'none';
      if (submitBtn) submitBtn.style.display = 'inline-flex';
    } else {
      if (nextBtn) nextBtn.style.display = 'inline-flex';
      if (submitBtn) submitBtn.style.display = 'none';
    }
  }

  nextBtn?.addEventListener('click', () => {
    // Quick validation for step
    if (currentStep === 1) {
      const cat = document.getElementById('rfqCommodity')?.value;
      if (!cat) {
        showToast('Please select a commodity category to proceed.', 'warning');
        return;
      }
    }
    if (currentStep === 2) {
      const port = document.getElementById('rfqPort')?.value.trim();
      if (!port) {
        showToast('Please enter the destination port or city.', 'warning');
        return;
      }
    }
    if (currentStep < totalSteps) {
      currentStep++;
      updateStepsUI();
    }
  });

  prevBtn?.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateStepsUI();
    }
  });

  rfqForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('rfqName')?.value.trim();
    const email = document.getElementById('rfqEmail')?.value.trim();
    const company = document.getElementById('rfqCompany')?.value.trim();

    if (!name || !email || !company) {
      showToast('Please provide your name, company, and corporate email.', 'warning');
      return;
    }

    // Generate reference ID
    const refId = 'PLX-' + Math.floor(100000 + Math.random() * 900000);

    const rfqBox = document.querySelector('.rfq-box');
    if (rfqBox) {
      rfqBox.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem;">
          <div style="width: 80px; height: 80px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); color: #10B981; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h3 style="font-size: 1.85rem; margin-bottom: 0.75rem; color: #F8FAFC;">RFQ Successfully Logged</h3>
          <p style="color: #94A3B8; max-width: 540px; margin: 0 auto 1.5rem; line-height: 1.6;">
            Thank you, <strong>${name}</strong> (${company}). Your procurement request has been routed to our international trade desk.
          </p>
          <div style="background: rgba(14, 24, 49, 0.85); border: 1px solid rgba(201, 151, 56, 0.3); border-radius: 12px; padding: 1rem 1.5rem; display: inline-block; margin-bottom: 2rem;">
            <span style="font-size: 0.8rem; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 4px;">Tracking Reference ID</span>
            <span style="font-family: monospace; font-size: 1.25rem; font-weight: 700; color: #E0B45C;">${refId}</span>
          </div>
          <div>
            <a href="index.html" class="btn btn-primary">Return to Homepage</a>
          </div>
        </div>
      `;
    }

    showToast(`RFQ ${refId} submitted successfully!`, 'success');
  });

  updateStepsUI();
}

/* --- 5. Gallery Lightbox --- */
function initGallery() {
  const cards = document.querySelectorAll('.gallery-card');
  const modal = document.querySelector('.lightbox-modal');
  const modalImg = document.querySelector('.lightbox-img');
  const modalClose = document.querySelector('.lightbox-close');
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');

  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-full') || card.querySelector('img')?.src;
      if (modal && modalImg && src) {
        modalImg.src = src;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    modal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeModal();
    }
  });

  // Filter
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-category');

      cards.forEach(c => {
        const itemCat = c.getAttribute('data-category');
        if (cat === 'all' || itemCat === cat) {
          c.style.display = 'block';
        } else {
          c.style.display = 'none';
        }
      });
    });
  });
}

/* --- 6. Contact Form Validation --- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const message = form.querySelector('[name="message"]')?.value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.', 'warning');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Transmitting...';
    }

    setTimeout(() => {
      form.reset();
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Dispatched Successfully';
      }
      showToast(window.i18n ? window.i18n.get('contactSuccess') : 'Message sent successfully!', 'success');
    }, 900);
  });
}

/* --- 7. Floating Action Buttons --- */
function initFloatingActions() {
  const topBtn = document.querySelector('.floating-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      topBtn?.classList.add('show');
    } else {
      topBtn?.classList.remove('show');
    }
  }, { passive: true });

  topBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --- 8. Scroll Fade-Up Animations --- */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

/* --- Utility: Global Toast Notice --- */
function showToast(message, type = 'info') {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  let icon = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
  `;
  if (type === 'success') {
    icon = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    `;
  } else if (type === 'warning') {
    icon = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E0B45C" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
    `;
  }

  toast.innerHTML = `${icon} <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
