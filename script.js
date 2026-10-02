// ═══ REVEAL ON SCROLL ═══
document.addEventListener('DOMContentLoaded', function() {
  var revealElements = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealElements.forEach(function(el) { revealObserver.observe(el); });
});

// ═══ NAVBAR INIT ═══
function initNavbar() {
  var navbar = document.getElementById('navbar');
  var lastScroll = 0;

  window.addEventListener('scroll', function() {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    if (st > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = st;
    updateActiveLink();
  }, { passive: true });

  // ═══ HAMBURGER MENU ═══
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  var mobileMenuClose = document.getElementById('mobileMenuClose');

  function openMobileMenu() {
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    mobileMenuClose?.focus();
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  function toggleMobileMenu() {
    if (mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Keyboard support
    hamburger.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMobileMenu();
      }
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', closeMobileMenu);
      mobileMenuClose.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeMobileMenu();
      });
    }
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    // Close menu on link click
    var mobileLinks = document.querySelectorAll('.mobile-link, .mobile-sublinks a, .mobile-cta');
    mobileLinks.forEach(function(link) {
      link.addEventListener('click', closeMobileMenu);
    });

    // Mobile section toggles
    var sectionToggles = document.querySelectorAll('.mobile-section-toggle');
    sectionToggles.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var section = this.closest('.mobile-section');
        var sublinks = section.querySelector('.mobile-sublinks');
        var isOpen = section.classList.contains('open');
        document.querySelectorAll('.mobile-section').forEach(function(s) {
          s.classList.remove('open');
          s.querySelector('.mobile-sublinks').classList.remove('open');
        });
        if (!isOpen) {
          section.classList.add('open');
          sublinks.classList.add('open');
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // ═══ DESKTOP DROPDOWNS (click to open, click outside to close) ═══
  var dropdownTriggers = document.querySelectorAll('.nav-dropdown .dropdown-trigger');
  dropdownTriggers.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var dropdown = this.closest('.nav-dropdown');
      var isOpen = dropdown.classList.contains('open');
      document.querySelectorAll('.nav-dropdown').forEach(function(d) { d.classList.remove('open'); });
      if (!isOpen) dropdown.classList.add('open');
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown').forEach(function(d) { d.classList.remove('open'); });
    }
  });

  // ═══ ACTIVE NAV LINK ═══
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = ['contact', 'portfolio', 'fondateur', 'pourquoi', 'services', 'accueil', 'methode', 'equipe', 'faq', 'motion'];

  function updateActiveLink() {
    var atBottom = (window.innerHeight + window.pageYOffset) >= document.body.scrollHeight - 60;
    if (atBottom) { setActive('contact'); return; }
    for (var i = 0; i < sections.length; i++) {
      var el = document.getElementById(sections[i]);
      if (el && window.pageYOffset >= el.offsetTop - 130) {
        setActive(sections[i]);
        return;
      }
    }
  }

  function setActive(sectionId) {
    navLinks.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === sectionId) {
        link.classList.add('active');
      }
    });
  }

  // ═══ SMOOTH SCROLL FOR SAFARI ═══
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var top = target.offsetTop - 64;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
}

// Make initNavbar globally accessible
window.initNavbar = initNavbar;

// Auto-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  initNavbar();
});



// ═══ EBOOK FORM ═══
document.addEventListener("DOMContentLoaded", function () {
  var ebookForm = document.getElementById("ebook-form");
  if (ebookForm) {
    ebookForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(ebookForm);
      fetch(ebookForm.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      }).then(function () {
        window.location.href = "merci-ebook.html";
      }).catch(function () {
        window.location.href = "merci-ebook.html";
      });
    });
  }
});

// ═══ COOKIE BANNER ═══
document.addEventListener("DOMContentLoaded", function () {
  var cookieBanner = document.getElementById("cookie-banner");
  var btnAccept = document.getElementById("btn-accept-cookies");
  var btnDeny = document.getElementById("btn-deny-cookies");

  if (!cookieBanner) return;

  var cookieChoice = localStorage.getItem("legaltech_cookies");

  if (!cookieChoice) {
    // Use .show class to display (matches the CSS rule .cookie-banner.show)
    cookieBanner.classList.add("show");
  }

  if (btnAccept) {
    btnAccept.addEventListener("click", function () {
      localStorage.setItem("legaltech_cookies", "accepted");
      cookieBanner.classList.remove("show");
    });
  }

  if (btnDeny) {
    btnDeny.addEventListener("click", function () {
      localStorage.setItem("legaltech_cookies", "denied");
      cookieBanner.classList.remove("show");
    });
  }
});

// ═══ MODALES SERVICES ═══
var modalOverlay;

// Ouvrir une modale
function openModal(id) {
  if (!modalOverlay) modalOverlay = document.getElementById('modalOverlay');
  var modal = document.getElementById('modal' + id);
  if (modal && modalOverlay) {
    modalOverlay.classList.add('active');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

// Fermer toutes les modales
function closeModal() {
  if (!modalOverlay) modalOverlay = document.getElementById('modalOverlay');
  if (modalOverlay) modalOverlay.classList.remove('active');
  document.querySelectorAll('.modal').forEach(function(m) {
    m.classList.remove('active');
  });
  document.body.style.overflow = '';
}

// Fermer avec la touche Echap
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// ═══ TEMOIGNAGES CAROUSEL ═══
document.addEventListener('DOMContentLoaded', function() {
  var grid = document.getElementById('temoignagesGrid');
  var prevBtn = document.querySelector('.temoignage-nav.prev');
  var nextBtn = document.querySelector('.temoignage-nav.next');
  var dotsContainer = document.getElementById('temoignageDots');

  if (!grid || !prevBtn || !nextBtn) return;

  var cards = grid.querySelectorAll('.temoignage-card');
  var cardWidth = 0;
  var maxScroll = 0;

  function updateDimensions() {
    if (cards.length === 0) return;
    var style = window.getComputedStyle(cards[0]);
    var gap = parseInt(window.getComputedStyle(grid).gap) || 24;
    cardWidth = cards[0].offsetWidth + gap;
    maxScroll = grid.scrollWidth - grid.clientWidth;
  }

  function updateNav() {
    var scrollLeft = grid.scrollLeft;
    prevBtn.disabled = scrollLeft <= 10;
    nextBtn.disabled = scrollLeft >= maxScroll - 10;
    updateDots(scrollLeft);
  }

  function updateDots(scrollLeft) {
    if (!dotsContainer) return;
    var page = Math.round(scrollLeft / cardWidth);
    var dots = dotsContainer.querySelectorAll('.temoignage-dot');
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === page);
    });
  }

  function createDots() {
    if (!dotsContainer) return;
    var pages = Math.ceil(grid.scrollWidth / grid.clientWidth);
    dotsContainer.innerHTML = '';
    for (var i = 0; i < pages; i++) {
      var dot = document.createElement('button');
      dot.className = 'temoignage-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Aller au témoignage ' + (i + 1));
      dot.addEventListener('click', function() {
        grid.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
      });
      dotsContainer.appendChild(dot);
    }
  }

  prevBtn.addEventListener('click', function() {
    grid.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', function() {
    grid.scrollBy({ left: cardWidth, behavior: 'smooth' });
  });

  grid.addEventListener('scroll', function() {
    updateNav();
  });

  window.addEventListener('resize', function() {
    updateDimensions();
    createDots();
    updateNav();
  });

  // Init
  updateDimensions();
  createDots();
  updateNav();

  // Auto-scroll pause on hover
  var autoScrollTimer;
  function startAutoScroll() {
    autoScrollTimer = setInterval(function() {
      if (grid.scrollLeft >= maxScroll - 10) {
        grid.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        grid.scrollBy({ left: cardWidth, behavior: 'smooth' });
      }
    }, 5000);
  }
  function stopAutoScroll() { clearInterval(autoScrollTimer); }

  grid.addEventListener('mouseenter', stopAutoScroll);
  grid.addEventListener('mouseleave', startAutoScroll);
  grid.addEventListener('focusin', stopAutoScroll);
  grid.addEventListener('focusout', startAutoScroll);

  startAutoScroll();
});
