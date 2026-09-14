/* ===================================================================
   ANIMATIONS AU SCROLL — a charger en fin de <body> :
   <script src="assets/scroll-fx.js" defer></script>

   Aucune dependance. Environ 3 Ko.

   USAGE
   -----
   Ajouter data-reveal sur un titre ou un paragraphe :

       <h2 data-reveal>À propos</h2>

   Chaque mot est enveloppe dans une fenetre (.word) contenant le
   texte (.word-in) qui remonte depuis le dessous au passage du
   scroll.

   Reglages facultatifs :
       data-reveal-stagger="80"   decalage entre les mots, en ms
                                  (defaut 55)
   =================================================================== */

(function () {
  'use strict';

  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Decoupage du texte en mots masques ------------------------- */
  function decouper(el) {
    if (el.dataset.split === '1') return;

    var pas = parseInt(el.dataset.revealStagger || '55', 10);
    var index = 0;

    // On ne traite que les noeuds texte : <b>, <a>, <br> sont preserves.
    var noeuds = [];
    (function collecter(parent) {
      for (var i = 0; i < parent.childNodes.length; i++) {
        var n = parent.childNodes[i];
        if (n.nodeType === 3 && n.nodeValue.trim()) noeuds.push(n);
        else if (n.nodeType === 1 && !n.classList.contains('word')) collecter(n);
      }
    })(el);

    noeuds.forEach(function (noeud) {
      var fragment = document.createDocumentFragment();
      var morceaux = noeud.nodeValue.split(/(\s+)/);

      morceaux.forEach(function (mot) {
        if (!mot.trim()) {
          fragment.appendChild(document.createTextNode(mot));
          return;
        }

        var fenetre = document.createElement('span');
        fenetre.className = 'word';

        var contenu = document.createElement('span');
        contenu.className = 'word-in';
        contenu.textContent = mot;
        contenu.style.transitionDelay = (index * pas) + 'ms';
        index++;

        fenetre.appendChild(contenu);
        fragment.appendChild(fenetre);
      });

      noeud.parentNode.replaceChild(fragment, noeud);
    });

    el.dataset.split = '1';
  }

  /* --- Declenchement a l'entree dans le viewport ------------------- */
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
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px'
  });

  cibles.forEach(function (el) { observateur.observe(el); });
})();
