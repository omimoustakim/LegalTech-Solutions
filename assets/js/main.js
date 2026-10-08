/* LegalTech Solutions — interactions (vanilla, sans dépendance) */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.remove('no-js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Header au scroll */
  var hdr = d.querySelector('.hdr');
  function onScroll() { if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 12); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Méga-menus (clic + clavier + survol desktop) */
  var triggers = d.querySelectorAll('[data-mega]');
  function closeAll(except) {
    triggers.forEach(function (t) {
      if (t === except) return;
      t.setAttribute('aria-expanded', 'false');
      var m = d.getElementById(t.getAttribute('aria-controls')); if (m) m.classList.remove('open');
    });
  }
  triggers.forEach(function (t) {
    var menu = d.getElementById(t.getAttribute('aria-controls')), li = t.parentElement, timer;
    function open() { clearTimeout(timer); closeAll(t); t.setAttribute('aria-expanded', 'true'); menu.classList.add('open'); }
    function close() { t.setAttribute('aria-expanded', 'false'); menu.classList.remove('open'); }
    t.addEventListener('click', function (e) { e.stopPropagation(); t.getAttribute('aria-expanded') === 'true' ? close() : open(); });
    if (window.matchMedia('(hover: hover)').matches) {
      li.addEventListener('mouseenter', open);
      li.addEventListener('mouseleave', function () { timer = setTimeout(close, 160); });
    }
    li.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); t.focus(); } });
  });
  d.addEventListener('click', function () { closeAll(); });

  /* Tiroir mobile */
  var drawer = d.getElementById('drawer'), burger = d.querySelector('.burger');
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    burger && burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    d.body.style.overflow = open ? 'hidden' : '';
    if (open) { var x = drawer.querySelector('.drawer-x'); x && x.focus(); } else if (burger) { burger.focus(); }
  }
  burger && burger.addEventListener('click', function () { setDrawer(true); });
  if (drawer) {
    drawer.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', function () { setDrawer(false); }); });
    drawer.addEventListener('keydown', function (e) { if (e.key === 'Escape') setDrawer(false); });
  }

  /* Apparitions au scroll */
  var rv = d.querySelectorAll('.rv, .hl');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* L'acte : code et droit avancent ensemble, puis le tampon tombe */
  var acte = d.querySelector('.acte');
  if (acte) {
    var lines = acte.querySelectorAll('.ln'), clauses = acte.querySelectorAll('.cl'), stamp = acte.querySelector('.stamp');
    var map = [0, 0, 1, 1, 2, 3, 3, 3];
    function finish() { lines.forEach(function (l) { l.classList.add('on'); }); clauses.forEach(function (c) { c.classList.add('on'); }); stamp && stamp.classList.add('down'); acte.classList.add('done'); }
    if (reduce) { finish(); } else {
      var i = 0;
      var step = function () {
        if (i < lines.length) {
          lines[i].classList.add('on');
          var c = clauses[map[i] || 0]; c && c.classList.add('on');
          i++; setTimeout(step, 360);
        } else {
          setTimeout(function () { stamp && stamp.classList.add('down'); setTimeout(function () { acte.classList.add('thud', 'done'); }, 260); }, 380);
        }
      };
      setTimeout(step, 700);
    }
  }

  /* Vidéo : pause / lecture */
  d.querySelectorAll('[data-film]').forEach(function (btn) {
    var v = d.getElementById(btn.getAttribute('data-film'));
    if (!v) return;
    if (reduce) { v.pause(); v.removeAttribute('autoplay'); }
    function label() { btn.querySelector('span').textContent = v.paused ? 'Lire la vidéo' : 'Pause'; }
    btn.addEventListener('click', function () { v.paused ? v.play() : v.pause(); label(); });
    v.addEventListener('play', label); v.addEventListener('pause', label); label();
  });

  /* Formulaires : envoi Formspree sans rechargement, repli classique */
  d.querySelectorAll('form[data-ajax]').forEach(function (form) {
    var box = form.closest('.form');
    form.addEventListener('submit', function (e) {
      if (form.querySelector('.hp input') && form.querySelector('.hp input').value) { e.preventDefault(); return; }
      if (!window.fetch || !window.FormData) return;
      e.preventDefault();
      var btn = form.querySelector('[type=submit]'), txt = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = 'Envoi en cours…';
      box && box.classList.remove('error');
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error();
          var next = form.getAttribute('data-next');
          if (next) { window.location.href = next; return; }
          box && box.classList.add('sent');
          if (window.plausible) window.plausible('Lead');
        })
        .catch(function () { box && box.classList.add('error'); })
        .finally(function () { btn.disabled = false; btn.innerHTML = txt; });
    });
  });

  /* Cookies : Plausible n'est chargé qu'après accord explicite */
  var KEY = 'lts-consent', bar = d.getElementById('cookie');
  function loadAnalytics() {
    if (d.getElementById('plausible')) return;
    var s = d.createElement('script'); s.id = 'plausible'; s.defer = true;
    s.setAttribute('data-domain', 'legaltechsolutions.org'); s.src = 'https://plausible.io/js/script.js';
    d.head.appendChild(s);
  }
  var choice = null; try { choice = localStorage.getItem(KEY); } catch (e) {}
  if (choice === 'yes') loadAnalytics();
  else if (!choice && bar) setTimeout(function () { bar.classList.add('show'); }, 1400);
  function decide(v) { try { localStorage.setItem(KEY, v); } catch (e) {} bar && bar.classList.remove('show'); if (v === 'yes') loadAnalytics(); }
  d.querySelectorAll('[data-consent]').forEach(function (b) { b.addEventListener('click', function () { decide(b.getAttribute('data-consent')); }); });
  d.querySelectorAll('[data-cookie-reset]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); try { localStorage.removeItem(KEY); } catch (er) {} bar && bar.classList.add('show'); }); });

  /* Année du pied de page */
  d.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
