// ═══ REVEAL ON SCROLL ═══
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealElements.forEach(function(el) { revealObserver.observe(el); });

// ═══ NAVBAR SCROLL ═══
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

hamburger.addEventListener('click', function() {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

// Close menu on link click
var mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');
mobileLinks.forEach(function(link) {
  link.addEventListener('click', function() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

// ═══ ACTIVE NAV LINK ═══
var navLinks = document.querySelectorAll('.nav-link');
var sections = ['contact', 'portfolio', 'fondateur', 'pourquoi', 'services', 'accueil'];

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

  var cookieChoice = localStorage.getItem("legaltech_cookies");

  if (!cookieChoice) {
    cookieBanner.classList.remove("hidden");
  }

  btnAccept.addEventListener("click", function () {
    localStorage.setItem("legaltech_cookies", "accepted");
    cookieBanner.classList.add("hidden");
    console.log("Scripts de tracking activés légalement.");
  });

  btnDeny.addEventListener("click", function () {
    localStorage.setItem("legaltech_cookies", "denied");
    cookieBanner.classList.add("hidden");
  });
});

// ═══ MODALES SERVICES ═══
var modalOverlay = document.getElementById('modalOverlay');

// Ouvrir une modale
function openModal(id) {
  var modal = document.getElementById('modal' + id);
  if (modal) {
    modalOverlay.classList.add('active');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

// Fermer toutes les modales
function closeModal() {
  modalOverlay.classList.remove('active');
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
