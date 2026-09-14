/* ===================================================================
   ANIMATIONS AU SCROLL — a charger en fin de <body> :
   <script src="assets/scroll-fx.js" defer></script>

   Aucune dependance : ni GSAP, ni ScrollTrigger. Environ 2 Ko.

   USAGE
   -----
   1. Revelation mot a mot : ajouter data-reveal sur un titre ou un
      paragraphe. Le texte est decoupe automatiquement.

        <h2 data-reveal>Du câble au CRM</h2>

   2. Decalage entre les mots : data-reveal-stagger="40" (ms).

   3. Trait qui se trace : <span class="rule-draw" data-reveal></span>
   =================================================================== */

(function () {
  'use strict';

  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- 1. Decoupage du texte en mots ----------------------------- */
  function decouper(el) {
    if (el.dataset.split === '1') return;

    var pas = parseInt(el.dataset.revealStagger || '35', 10);
    var index = 0;

    // On ne parcourt que les noeuds texte, pour preserver <b>, <a>, <br>...
    var noeuds = [];
    (function collecter(parent) {
      for (var i = 0; i < parent.childNodes.length; i++) {
        var n = parent.childNodes[i];
        if (n.nodeType === 3 && n.nodeValue.trim()) noeuds.push(n);
        else if (n.nodeType === 1) collecter(n);
      }
    })(el);

    noeuds.forEach(function (noeud) {
      var fragment = document.createDocumentFragment();
      var mots = noeud.nodeValue.split(/(\s+)/);

      mots.forEach(function (mot) {
        if (!mot.trim()) {
          fragment.appendChild(document.createTextNode(mot));
          return;
        }
        var span = document.createElement('span');
        span.className = 'word';
        span.textContent = mot;
        span.style.transitionDelay = (index * pas) + 'ms';
        index++;
        fragment.appendChild(span);
      });

      noeud.parentNode.replaceChild(fragment, noeud);
    });

    el.dataset.split = '1';
  }

  /* --- 2. Declenchement a l'entree dans le viewport --------------- */
  var cibles = document.querySelectorAll('[data-reveal]');
  if (!cibles.length) return;

  if (reduit || !('IntersectionObserver' in window)) {
    cibles.forEach(function (el) { el.classList.add('is-revealed'); });
    return;
  }

  cibles.forEach(function (el) {
    if (!el.classList.contains('rule-draw')) decouper(el);
  });

  var observateur = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (entree) {
      if (!entree.isIntersecting) return;
      entree.target.classList.add('is-revealed');
      observateur.unobserve(entree.target);   // une seule fois
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -12% 0px'   // declenche un peu avant le bas d'ecran
  });

  cibles.forEach(function (el) { observateur.observe(el); });
})();
