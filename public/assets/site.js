/* Portfolio v2 — site behavior. Vanilla JS, no framework, no build step. */
(() => {
  'use strict';

  /* ------------------------------------------------------------------
     Centralized project data. Add, edit or remove a project here —
     nothing else in the page needs to change.
  ------------------------------------------------------------------- */
  const PROJECTS = [
    {
      id: 'webrtc-crm', cat: 'Voix', status: 'En cours, 2026', accent: true,
      title: "Le navigateur devient le téléphone de l'agent",
      summary: "Plateforme unifiée Twenty CRM et téléphonie WebRTC : l'agent appelle, reçoit et qualifie sans quitter son CRM, sans softphone.",
      context: "20 agents, 16 à 32 appels simultanés, modes manuel, progressif et prédictif. La voix arrive par une passerelle GSM OpenVox, pas par un opérateur SIP.",
      decisions: [
        "Tout dans le cloud, latence assumée : Asterisk et coturn sur un VPS européen, après mesure réelle depuis Lomé (RTT moyen de 167 ms).",
        "Passerelle GSM raccordée par tunnel OpenVPN à IP fixes, jamais exposée sur Internet.",
        "Asterisk compilé depuis les sources, piloté par ARI via un middleware indépendant.",
        "Règle bloquante : pas une ligne de code CRM avant un appel navigateur ⇄ ligne GSM validé dans les deux sens."
      ],
      outcome: "Serveur AlmaLinux 9 durci (SELinux enforcing, SSH par clé uniquement), plan de réalisation en 16 phases et 26 livrables d'architecture.",
      tech: ['Asterisk 22', 'PJSIP', 'ARI', 'WebRTC / WSS', 'coturn', 'VICIdial', 'Twenty CRM', 'Docker Compose', 'OpenVPN', 'AlmaLinux 9'],
      link: ''
    },
    {
      id: 'goautodial-angular', cat: 'Application', status: 'ADKONTACT, 2026',
      title: "Refonte d'un centre de contacts en production",
      summary: "Remplacer l'interface PHP de GOautodial par une application Angular bilingue, sans toucher au backend qui tourne en production.",
      context: "Trois surfaces héritées (back-office, écran agent, rapports VICIdial) sur CentOS 7. L'ancien PHP reste en place et sert d'API.",
      decisions: [
        "Superviseur et administrateur distingués via l'endpoint userinfo(), le backend ne transmettant jamais le niveau utilisateur au client.",
        "Lignes utilisateur filtrées par liste blanche : un mot de passe ne peut pas atteindre le navigateur.",
        "Pas d'édition partielle quand l'API réécrit des champs positionnels : un lien vers l'ancien écran vaut mieux qu'une corruption silencieuse.",
        "Déploiement par rsync, sans Node.js sur le serveur de production."
      ],
      outcome: "Tableau de bord, utilisateurs, campagnes, recherche, listes DNC et serveurs livrés ; 99 tests au vert ; interface compilée en français et en anglais.",
      tech: ['Angular', 'RxJS', 'SIP.js', 'i18n FR/EN', 'GOautodial / VICIdial', 'Apache', 'CentOS 7'],
      link: ''
    },
    {
      id: 'ssh-logs', cat: 'Sécurité', status: 'Master, 2026', accent: true,
      title: 'Repérer 6 946 attaquants dans des logs SSH',
      summary: "Un pipeline de données qui transforme des logs d'authentification bruts en règles de détection et en tableau de bord de SOC.",
      context: "Projet de groupe du module Data Engineering (UCAO-UUT) : 500 000 à 2 millions de lignes de logs SSH, stockées dans un bucket S3 raw/processed.",
      decisions: [
        "Seuils calculés sur la distribution des données (percentile et plancher minimal) plutôt que fixés à la main.",
        "Export Parquet via DuckDB vers Power BI, après des verrous de fichier persistants côté ODBC.",
        "Règles alignées sur MITRE ATT&CK, IP géolocalisées avec MaxMind GeoLite2."
      ],
      outcome: "6 946 IP en brute force, 17 comptes visés par password spraying, 222 heures de pic. Un rapport de qualité documente 20,9 % de doublons et un trou de couverture de cinq mois.",
      tech: ['Python', 'boto3', 'AWS S3', 'DuckDB', 'Parquet', 'Power BI', 'MITRE ATT&CK'],
      link: 'https://github.com/t-h-e-4-5/data_engineering'
    },
    {
      id: 'saas-ccaas', cat: 'Application', status: 'En conception, 2026',
      title: "Les fondations d'un centre de contacts en SaaS",
      summary: "Passer d'une vision très large à un socle livrable : le contrat d'API d'abord, trois modules, l'isolation des clients dès la base de données.",
      context: "Une plateforme francophone face aux grands éditeurs du marché, dont le premier client est un centre d'appels réellement exploité.",
      decisions: [
        "Contrat OpenAPI 3.1 écrit avant toute implémentation : identité, annuaire, appels, événements, routes opérateur.",
        "PostgreSQL multi-tenant avec Row Level Security forcée.",
        "Un seul niveau d'organisation, l'équipe, pour garder le modèle simple.",
        "Multi-opérateurs dès la conception : trunks SIP, passerelles GSM et Twilio."
      ],
      outcome: "Socle d'architecture arrêté et documenté, prêt pour une première implémentation module par module.",
      tech: ['OpenAPI 3.1', 'PostgreSQL', 'Row Level Security', 'SIP', 'Twilio'],
      link: ''
    },
    {
      id: 'durcissement', cat: 'Système', status: 'En production',
      title: 'Des serveurs VoIP face à de vraies attaques',
      summary: "Un audit non destructif d'abord, un durcissement progressif ensuite, chaque étape validée avec un accès console de secours.",
      context: "Plateformes GOautodial et Kamailio exposées, ciblées par des attaques SIP actives.",
      decisions: [
        "SELinux maintenu en mode enforcing plutôt que désactivé pour « faire marcher » la téléphonie.",
        "SSH par clé ed25519 uniquement, root bloqué, fail2ban et firewalld.",
        "OpenVPN en split tunnel avec IP fixes par client pour isoler le trafic SIP et RTP."
      ],
      outcome: "Une méthode reproductible, appliquée sur AlmaLinux et Ubuntu, avec les outils natifs de chaque distribution.",
      tech: ['AlmaLinux', 'Ubuntu', 'SELinux', 'firewalld', 'fail2ban', 'OpenVPN', 'Kamailio'],
      link: ''
    },
    {
      id: 'reseaux-entreprise', cat: 'Réseau', status: 'Livré',
      title: "Deux réseaux d'entreprise, du câble au plan de numérotation",
      summary: "Architectures réseau, sécurité et téléphonie complètes, rédigées pour répondre à des appels d'offres.",
      context: "Deux organisations, deux dossiers complets : réseau, sécurité, téléphonie et budget.",
      decisions: [
        "Ingénierie SIP, QoS et codec détaillée équipement par équipement.",
        "Budget en trois niveaux pour laisser le client arbitrer."
      ],
      outcome: "Schémas SVG et Draw.io, listes d'équipements, modèles de rapports de mission pour les déploiements de centres d'appels.",
      tech: ['Cisco', 'MikroTik', 'VLAN', 'QoS', 'SIP', 'Draw.io'],
      link: ''
    }
  ];

  const CATS = ['Tous', 'Voix', 'Application', 'Sécurité', 'Réseau', 'Système'];
  const MODELS = [
    { id: 'gsm', label: 'Passerelle GSM' },
    { id: 'rack', label: 'Baie serveur' },
    { id: 'phone', label: 'Téléphone IP' }
  ];

  /* Remplacez par votre vraie adresse avant la mise en ligne (repli mailto). */
  const EMAIL = 'theophiledumashie@gmail.com';

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ------------------------------------------------------------------
     Hero name — letter-by-letter reveal, name kept accessible via
     aria-label on the <h1> (the split lines are aria-hidden).
  ------------------------------------------------------------------- */
  function splitHeroLines() {
    document.querySelectorAll('[data-hero-line]').forEach((line, li) => {
      if (line.dataset.split) return;
      line.dataset.split = '1';
      line.setAttribute('aria-hidden', 'true');
      const txt = line.textContent;
      line.textContent = '';
      [...txt].forEach((c, i) => {
        const s = document.createElement('span');
        s.textContent = c;
        s.style.display = 'inline-block';
        s.style.animation = reduceMotion ? 'none' : `letterIn .62s ${(li * 0.22 + i * 0.035).toFixed(2)}s cubic-bezier(.2,.8,.25,1) both`;
        line.appendChild(s);
      });
    });
  }

  /* ------------------------------------------------------------------
     Scroll reveal for [data-anim] blocks, with a 4s fallback so
     content stays visible if IntersectionObserver ever fails.
  ------------------------------------------------------------------- */
  function initScrollReveal() {
    if (reduceMotion) return;
    const items = [...document.querySelectorAll('[data-anim]')];
    items.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'opacity .6s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1)';
    });
    const reveal = (el) => { el.style.opacity = '1'; el.style.transform = 'none'; };
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach((el) => io.observe(el));
    setTimeout(() => items.forEach(reveal), 4000);
  }

  /* ------------------------------------------------------------------
     Counters — animate up once each stat scrolls into view.
  ------------------------------------------------------------------- */
  function initCounters() {
    const cio = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        const end = +e.target.dataset.count;
        if (reduceMotion) { e.target.textContent = end; return; }
        const t0 = performance.now(), dur = 1200;
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          e.target.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach((el) => cio.observe(el));
  }

  /* ------------------------------------------------------------------
     Mobile menu.
  ------------------------------------------------------------------- */
  function initMobileMenu() {
    const btn = document.querySelector('[data-burger]');
    const nav = document.querySelector('[data-navlinks]');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      nav.setAttribute('data-open', open ? '1' : '0');
      const bars = btn.querySelectorAll('[data-bar]');
      if (bars[0]) bars[0].style.transform = open ? 'translateY(6px) rotate(45deg)' : 'none';
      if (bars[1]) bars[1].style.opacity = open ? '0' : '1';
      if (bars[2]) bars[2].style.transform = open ? 'translateY(-6px) rotate(-45deg)' : 'none';
    });
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      if (nav.getAttribute('data-open') === '1') btn.click();
    }));
  }

  /* ------------------------------------------------------------------
     Projects — render from PROJECTS, filter, and open the detail modal.
  ------------------------------------------------------------------- */
  /* The cards themselves are pre-rendered as static HTML directly in
     index.html (see the `data-projects-grid` block) so their content is
     crawlable by engines that don't execute JavaScript — most AI/answer-
     engine bots included. This function only wires up filtering and the
     detail modal against that existing markup; it never (re)builds the
     cards. Adding a project means: 1) add it to PROJECTS below (for the
     modal's full detail) and 2) add a matching <article data-card> block
     in index.html (for the visible summary) — keep both in sync. */
  function initProjects() {
    const grid = document.querySelector('[data-projects-grid]');
    const empty = document.querySelector('[data-no-projects]');
    const filterHost = document.querySelector('[data-project-filters]');
    if (!grid || !filterHost) return;

    filterHost.innerHTML = CATS.map((c, i) => `
      <label class="seg-opt" style="padding:11px 14px;font-size:13px">
        <input type="radio" name="filtre-projets" value="${esc(c)}" ${i === 0 ? 'checked' : ''}>${esc(c)}
      </label>`).join('');

    const openModal = (id) => {
      const p = PROJECTS.find((x) => x.id === id);
      if (p) showModal(p);
    };

    grid.addEventListener('click', (e) => {
      const card = e.target.closest('[data-card]');
      if (card) openModal(card.dataset.id);
    });
    grid.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('[data-card]');
      if (card) { e.preventDefault(); openModal(card.dataset.id); }
    });

    const applyFilter = (cat) => {
      let visible = 0;
      grid.querySelectorAll('[data-card]').forEach((card) => {
        const show = cat === 'Tous' || card.dataset.cat === cat;
        card.style.display = show ? '' : 'none';
        if (show) visible += 1;
      });
      if (empty) empty.style.display = visible === 0 ? '' : 'none';
    };
    filterHost.addEventListener('change', (e) => {
      if (e.target.name === 'filtre-projets') applyFilter(e.target.value);
    });
    applyFilter('Tous');
  }

  /* ------------------------------------------------------------------
     Project detail modal.
  ------------------------------------------------------------------- */
  function showModal(p) {
    const backdrop = document.querySelector('[data-modal-backdrop]');
    if (!backdrop) return;
    backdrop.querySelector('[data-m-cat]').textContent = p.cat;
    backdrop.querySelector('[data-m-status]').textContent = p.status;
    backdrop.querySelector('[data-m-title]').textContent = p.title;
    backdrop.querySelector('[data-m-context]').textContent = p.context;
    backdrop.querySelector('[data-m-outcome]').textContent = p.outcome;
    backdrop.querySelector('[data-m-decisions]').innerHTML = p.decisions.map((d) => `<li>${esc(d)}</li>`).join('');
    backdrop.querySelector('[data-m-tech]').innerHTML = p.tech.map((t) => `<li class="tag tag-outline">${esc(t)}</li>`).join('');
    const link = backdrop.querySelector('[data-m-link]');
    if (p.link) { link.href = p.link; link.style.display = ''; } else { link.style.display = 'none'; }
    backdrop.hidden = false;
    backdrop.querySelector('.dialog').focus();
    document.addEventListener('keydown', onModalEscape);
  }
  function hideModal() {
    const backdrop = document.querySelector('[data-modal-backdrop]');
    if (!backdrop) return;
    backdrop.hidden = true;
    document.removeEventListener('keydown', onModalEscape);
  }
  function onModalEscape(e) { if (e.key === 'Escape') hideModal(); }

  function initModal() {
    const backdrop = document.querySelector('[data-modal-backdrop]');
    if (!backdrop) return;
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) hideModal(); });
    backdrop.querySelectorAll('[data-modal-close]').forEach((btn) => btn.addEventListener('click', hideModal));
  }

  /* ------------------------------------------------------------------
     3D material selector — segmented control feeding <three-d-stage>.
  ------------------------------------------------------------------- */
  function kit(THREE, name) {
    const g = new THREE.Group();
    g.name = name;
    const mat = (n, color, opts = {}) => {
      const m = new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.3, ...opts });
      m.name = n;
      return m;
    };
    const add = (geo, material, n, x, y, z, rot) => {
      const m = new THREE.Mesh(geo, material);
      m.name = n;
      m.position.set(x, y, z);
      if (rot) m.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
      m.castShadow = true; m.receiveShadow = true;
      g.add(m);
      return m;
    };
    return { g, mat, add };
  }

  function buildGsm(THREE) {
    const { g, mat, add } = kit(THREE, 'PasserelleGSM');
    const shell = mat('Chassis', '#d7d3d3', { roughness: 0.42, metalness: 0.35 });
    const face = mat('Facade', '#2d2b2b', { roughness: 0.7, metalness: 0.15 });
    const ink = mat('Ink', '#201e1d', { roughness: 0.8, metalness: 0.05 });
    const led = mat('Led', '#ec3013', { roughness: 0.35, metalness: 0, emissive: new THREE.Color('#ec3013'), emissiveIntensity: 0.85 });
    const ledOff = mat('LedEteinte', '#7d7979', { roughness: 0.5 });
    const metal = mat('Metal', '#9b9797', { roughness: 0.35, metalness: 0.4 });

    const W = 0.44, H = 0.045, D = 0.30;

    add(new THREE.BoxGeometry(W, H, D), shell, 'Boitier', 0, H / 2, 0);
    add(new THREE.BoxGeometry(W * 0.995, H * 0.9, 0.006), face, 'Facade', 0, H / 2, D / 2);
    add(new THREE.BoxGeometry(W * 0.995, H * 0.9, 0.006), face, 'PanneauArriere', 0, H / 2, -D / 2);
    [-1, 1].forEach((s) => add(new THREE.BoxGeometry(0.03, H * 0.85, 0.012), metal, s < 0 ? 'OreilleG' : 'OreilleD', s * (W / 2 + 0.014), H / 2, D / 2 - 0.02));
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz], i) => add(new THREE.CylinderGeometry(0.008, 0.008, 0.004, 16), ink, 'Pied' + (i + 1), sx * (W / 2 - 0.03), 0.002, sz * (D / 2 - 0.03)));

    for (let i = 0; i < 8; i++) {
      const x = -W / 2 + 0.035 + i * ((W - 0.07) / 7);
      add(new THREE.CylinderGeometry(0.006, 0.007, 0.014, 16), metal, 'SocleAntenne' + (i + 1), x, H + 0.007, -D / 2 + 0.02);
      add(new THREE.CylinderGeometry(0.0045, 0.0045, 0.105, 16), ink, 'Antenne' + (i + 1), x, H + 0.066, -D / 2 + 0.02);
      add(new THREE.SphereGeometry(0.0045, 14, 10), ink, 'BoutAntenne' + (i + 1), x, H + 0.119, -D / 2 + 0.02);
    }
    for (let i = 0; i < 8; i++) {
      const x = -W / 2 + 0.045 + i * ((W - 0.12) / 7);
      add(new THREE.BoxGeometry(0.026, 0.011, 0.004), ink, 'LecteurSIM' + (i + 1), x, H / 2 - 0.005, D / 2 + 0.004);
      add(new THREE.CylinderGeometry(0.0022, 0.0022, 0.003, 12), i < 5 ? led : ledOff, 'LedCanal' + (i + 1), x, H / 2 + 0.012, D / 2 + 0.004, [Math.PI / 2, 0, 0]);
    }
    add(new THREE.BoxGeometry(0.021, 0.016, 0.005), ink, 'PortEthernet', W / 2 - 0.03, H / 2, D / 2 + 0.004);
    add(new THREE.CylinderGeometry(0.005, 0.005, 0.005, 16), metal, 'PriseAlim', W / 2 - 0.062, H / 2, D / 2 + 0.004, [Math.PI / 2, 0, 0]);
    for (let i = 0; i < 14; i++) add(new THREE.BoxGeometry(0.004, 0.002, 0.11), ink, 'Aeration' + (i + 1), -0.09 + i * 0.014, H - 0.001, 0.03);

    return g;
  }

  function buildRack(THREE) {
    const { g, mat, add } = kit(THREE, 'BaieServeur');
    const frame = mat('Montant', '#7d7979', { roughness: 0.4, metalness: 0.4 });
    const panel = mat('Panneau', '#d7d3d3', { roughness: 0.5, metalness: 0.3 });
    const face = mat('Facade', '#2d2b2b', { roughness: 0.7, metalness: 0.15 });
    const ink = mat('Ink', '#201e1d', { roughness: 0.8, metalness: 0.05 });
    const led = mat('Led', '#ec3013', { roughness: 0.35, metalness: 0, emissive: new THREE.Color('#ec3013'), emissiveIntensity: 0.9 });

    const W = 0.6, H = 1.2, D = 0.8, F = 0.33;
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz], i) =>
      add(new THREE.BoxGeometry(0.03, H, 0.03), frame, 'Montant' + (i + 1), sx * (W / 2 - 0.015), H / 2, sz * (D / 2 - 0.015)));
    add(new THREE.BoxGeometry(W, 0.02, D), panel, 'Socle', 0, 0.01, 0);
    add(new THREE.BoxGeometry(W, 0.02, D), panel, 'Toit', 0, H - 0.01, 0);
    add(new THREE.BoxGeometry(0.015, H * 0.98, D * 0.96), panel, 'FlancGauche', -W / 2 + 0.008, H / 2, 0);
    add(new THREE.BoxGeometry(0.015, H * 0.98, D * 0.96), panel, 'FlancDroit', W / 2 - 0.008, H / 2, 0);
    add(new THREE.BoxGeometry(W * 0.96, H * 0.98, 0.015), panel, 'PanneauArriere', 0, H / 2, -D / 2 + 0.008);

    for (let i = 0; i < 7; i++) {
      const y = 0.12 + i * 0.15;
      add(new THREE.BoxGeometry(W * 0.88, 0.11, D * 0.66), face, 'Serveur' + (i + 1), 0, y, 0);
      add(new THREE.BoxGeometry(W * 0.9, 0.115, 0.008), ink, 'FacadeServeur' + (i + 1), 0, y, F);
      for (let j = 0; j < 3; j++)
        add(new THREE.CylinderGeometry(0.005, 0.005, 0.004, 12), j === 0 ? led : frame, 'Led' + (i + 1) + '-' + (j + 1), -W * 0.4 + j * 0.028, y + 0.03, F + 0.004, [Math.PI / 2, 0, 0]);
      for (let j = 0; j < 9; j++)
        add(new THREE.BoxGeometry(0.01, 0.055, 0.004), frame, 'Aeration' + (i + 1) + '-' + (j + 1), -0.06 + j * 0.02, y, F + 0.004);
      add(new THREE.BoxGeometry(0.09, 0.02, 0.004), frame, 'Etiquette' + (i + 1), W * 0.32, y - 0.03, F + 0.004);
    }
    add(new THREE.BoxGeometry(W * 0.9, 0.06, 0.01), frame, 'Ventilation', 0, H - 0.06, F);
    return g;
  }

  function buildPhone(THREE) {
    const { g, mat, add } = kit(THREE, 'TelephoneIP');
    const body = mat('Coque', '#d7d3d3', { roughness: 0.5, metalness: 0.25 });
    const dark = mat('Touche', '#2d2b2b', { roughness: 0.7, metalness: 0.1 });
    const ink = mat('Ink', '#201e1d', { roughness: 0.8, metalness: 0.05 });
    const glass = mat('Ecran', '#7d7979', { roughness: 0.22, metalness: 0.2 });
    const led = mat('Led', '#ec3013', { roughness: 0.35, metalness: 0, emissive: new THREE.Color('#ec3013'), emissiveIntensity: 0.9 });

    add(new THREE.BoxGeometry(0.24, 0.03, 0.20), body, 'Base', 0, 0.015, 0);
    add(new THREE.BoxGeometry(0.235, 0.05, 0.075), body, 'DosseretEcran', 0, 0.05, -0.062, [-0.32, 0, 0]);
    add(new THREE.BoxGeometry(0.13, 0.004, 0.05), glass, 'Ecran', 0.04, 0.077, -0.06, [-0.32, 0, 0]);
    add(new THREE.CylinderGeometry(0.005, 0.005, 0.004, 14), led, 'TemoinAppel', -0.09, 0.076, -0.048, [Math.PI / 2, 0, 0]);

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        add(new THREE.BoxGeometry(0.022, 0.008, 0.014), dark, 'Touche' + (r * 3 + c + 1), 0.035 + (c - 1) * 0.028, 0.034, -0.005 + r * 0.021);
      }
    }
    for (let i = 0; i < 4; i++) add(new THREE.BoxGeometry(0.016, 0.007, 0.01), dark, 'Fonction' + (i + 1), -0.075, 0.034, -0.02 + i * 0.022);

    add(new THREE.BoxGeometry(0.045, 0.012, 0.19), ink, 'Support', -0.094, 0.036, 0);
    add(new THREE.BoxGeometry(0.038, 0.026, 0.185), ink, 'Combine', -0.094, 0.055, 0);
    add(new THREE.BoxGeometry(0.05, 0.032, 0.05), ink, 'Ecouteur', -0.094, 0.062, -0.078);
    add(new THREE.BoxGeometry(0.05, 0.032, 0.05), ink, 'Micro', -0.094, 0.062, 0.078);
    add(new THREE.BoxGeometry(0.03, 0.006, 0.016), dark, 'PortReseau', 0.06, 0.008, 0.102);
    return g;
  }

  function initMaterialStage() {
    const host = document.querySelector('[data-stage-host]');
    const filterHost = document.querySelector('[data-model-filters]');
    const loading = document.querySelector('[data-3d-loading]');
    if (!host || !filterHost) return;

    filterHost.innerHTML = MODELS.map((m, i) => `
      <label class="seg-opt" style="padding:12px 16px;font-size:13px">
        <input type="radio" name="modele-3d" value="${m.id}" ${i === 0 ? 'checked' : ''}>${esc(m.label)}
      </label>`).join('');

    let stage = null, THREE = null, currentModel = 'gsm';

    const applyModel = (kindId) => {
      if (!stage || !THREE) return;
      const g = kindId === 'rack' ? buildRack(THREE) : kindId === 'phone' ? buildPhone(THREE) : buildGsm(THREE);
      stage.setAttribute('name', kindId === 'rack' ? 'baie-serveur' : kindId === 'phone' ? 'telephone-ip' : 'passerelle-gsm');
      stage.setObject(g);
    };

    filterHost.addEventListener('change', (e) => {
      if (e.target.name !== 'modele-3d') return;
      currentModel = e.target.value;
      applyModel(currentModel);
    });

    const buildStageElement = async () => {
      if (loading) loading.style.display = 'flex';
      const el = document.createElement('three-d-stage');
      el.setAttribute('name', 'passerelle-gsm');
      el.setAttribute('background', '#f3f2f2');
      el.setAttribute('autorotate', '');
      el.style.display = 'block';
      el.style.width = '100%';
      el.style.height = '100%';
      host.appendChild(el);

      const ready = await new Promise((resolve) => {
        const t = setInterval(() => { if (el.ready) { clearInterval(t); resolve(el.ready); } }, 60);
        setTimeout(() => { clearInterval(t); resolve(null); }, 15000);
      });
      if (!ready) { if (loading) loading.style.display = 'none'; return; }
      const res = await ready;
      stage = el;
      THREE = res.THREE;
      applyModel(currentModel);
      if (loading) loading.style.display = 'none';
    };

    const sio = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return;
      sio.disconnect();
      buildStageElement();
    }, { rootMargin: '320px' });
    sio.observe(host);
  }

  /* ------------------------------------------------------------------
     Contact form.
  ------------------------------------------------------------------- */
  function initContactForm() {
    const form = document.querySelector('[data-contact-form]');
    const status = document.querySelector('[data-mail-status]');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      if (status) status.textContent = 'Envoi en cours…';
      try {
        const r = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' }
        });
        const json = await r.json();
        if (!r.ok || !json.success) throw new Error(json.message || 'http ' + r.status);
        if (status) status.textContent = 'Message envoyé. Réponse sous 24 h.';
        form.reset();
      } catch (err) {
        const sujet = encodeURIComponent(data.get('subject') || 'Contact depuis le portfolio');
        const corps = encodeURIComponent((data.get('message') || '') + '\n\n— ' + (data.get('name') || '') + ' (' + (data.get('email') || '') + ')');
        location.href = 'mailto:' + EMAIL + '?subject=' + sujet + '&body=' + corps;
        if (status) status.textContent = 'Envoi direct indisponible : votre logiciel de messagerie a été ouvert.';
      }
    });
  }

  /* ------------------------------------------------------------------
     Boot.
  ------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    splitHeroLines();
    initScrollReveal();
    initCounters();
    initMobileMenu();
    initProjects();
    initModal();
    initMaterialStage();
    initContactForm();
  });
})();
