const fs = require('fs');
const path = require('path');
function w(f, c) {
  const d = path.dirname(f);
  if (!fs.existsSync(d)) fs.mkdirSync(d, {recursive: true});
  fs.writeFileSync(f, c, 'utf8');
  console.log('OK: ' + f);
}

// === app/globals.css ===
w('app/globals.css',
`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --bg: #060e20;
  --surface: #060e20;
  --surface-container: #0f1930;
  --surface-container-high: #141f38;
  --surface-container-highest: #192540;
  --surface-container-low: #091328;
  --surface-bright: #1f2b49;
  --surface-variant: #192540;
  --primary: #cc97ff;
  --primary-dim: #9c48ea;
  --primary-container: #c284ff;
  --secondary: #34b5fa;
  --secondary-dim: #17a8ec;
  --tertiary: #c890ff;
  --on-bg: #dee5ff;
  --on-surface: #dee5ff;
  --on-surface-variant: #a3aac4;
  --outline: #6d758c;
  --outline-variant: #40485d;
  --error: #ff6e84;
  --success: #10b981;
  --warning: #f59e0b;
  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--on-bg);
  font-family: var(--font-body);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: -0.02em;
}

a { color: var(--primary); text-decoration: none; transition: color 0.2s; }
a:hover { color: var(--primary-container); }

/* === BUTTONS === */
.btn-primary {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, var(--primary), var(--primary-dim));
  color: #000; font-family: var(--font-display); font-weight: 600; font-size: 0.875rem;
  border: none; border-radius: var(--radius-md); cursor: pointer;
  transition: all 0.3s ease; box-shadow: 0 0 20px rgba(156, 72, 234, 0.2);
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 30px rgba(156, 72, 234, 0.4);
}

.btn-secondary {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: transparent;
  color: var(--primary); font-family: var(--font-display); font-weight: 600; font-size: 0.875rem;
  border: 1px solid rgba(204, 151, 255, 0.3); border-radius: var(--radius-md); cursor: pointer;
  transition: all 0.3s ease;
}
.btn-secondary:hover {
  background: rgba(204, 151, 255, 0.08);
  border-color: var(--primary);
}

/* === CHIPS & BADGES === */
.stack-chip {
  display: inline-flex; align-items: center; gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border: 1px solid rgba(109, 117, 140, 0.15);
  border-radius: var(--radius-md);
  font-family: var(--font-display); font-size: 0.75rem; color: var(--on-surface-variant);
  transition: all 0.2s;
}
.stack-chip::before {
  content: ''; width: 4px; height: 4px; border-radius: 50%;
  background: var(--secondary);
}
.stack-chip--sm { padding: 0.125rem 0.5rem; font-size: 0.65rem; }

.skill-badge {
  display: inline-flex; align-items: center; gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-md);
  font-family: var(--font-display); font-size: 0.8rem; font-weight: 500;
}
.skill-badge--verified {
  background: rgba(168, 85, 247, 0.15); color: var(--tertiary);
  box-shadow: 0 0 8px rgba(200, 144, 255, 0.15);
}
.skill-badge--unverified {
  background: rgba(109, 117, 140, 0.1); color: var(--outline);
}

.engagement-badge {
  display: inline-block; padding: 0.2rem 0.6rem;
  border: 1px solid; border-radius: var(--radius-sm);
  font-family: var(--font-display); font-size: 0.7rem; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.05em;
}

.neuron-req {
  display: inline-flex; align-items: center;
  padding: 0.2rem 0.5rem;
  background: rgba(156, 72, 234, 0.12); color: var(--primary);
  border-radius: var(--radius-sm);
  font-family: var(--font-display); font-size: 0.7rem; font-weight: 600;
}

.category-badge {
  position: absolute; top: 0.75rem; right: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-display); font-size: 0.65rem; font-weight: 700;
  color: #fff; text-transform: uppercase; letter-spacing: 0.05em;
}

.availability-dot {
  position: absolute; bottom: 2px; right: 2px;
  width: 12px; height: 12px;
  background: var(--success); border: 2px solid var(--surface-container);
  border-radius: 50%;
}

/* === NEURON SCORE RING === */
.neuron-ring-wrapper { position: relative; display: inline-block; }
.neuron-tooltip {
  position: absolute; bottom: calc(100% + 12px); left: 50%; transform: translateX(-50%);
  background: var(--surface-container-high);
  padding: 0.75rem 1rem; border-radius: var(--radius-lg);
  min-width: 200px; box-shadow: 0 24px 48px rgba(0,0,0,0.5), 0 0 12px rgba(204,151,255,0.08);
  opacity: 0; pointer-events: none; transition: opacity 0.3s;
  z-index: 50;
}
.neuron-ring-wrapper:hover .neuron-tooltip { opacity: 1; pointer-events: auto; }
.tooltip-row {
  display: flex; justify-content: space-between; padding: 0.25rem 0;
  font-size: 0.75rem; color: var(--on-surface-variant);
}
.tooltip-row span:last-child { color: var(--on-surface); font-weight: 600; font-family: var(--font-display); }

/* === ENGINEER CARD === */
.engineer-card {
  background: var(--surface-container);
  border-radius: var(--radius-lg); padding: 1.25rem;
  transition: all 0.3s ease;
}
.engineer-card:hover {
  background: var(--surface-container-high);
  box-shadow: 0 24px 48px rgba(0,0,0,0.3), 0 0 12px rgba(204,151,255,0.05);
}
.engineer-card__header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
.engineer-card__avatar {
  position: relative; width: 48px; height: 48px; border-radius: 50%; overflow: hidden;
  flex-shrink: 0;
}
.engineer-card__avatar img { width: 100%; height: 100%; object-fit: cover; }
.engineer-card__avatar-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, var(--primary-dim), var(--primary));
  color: #000; font-family: var(--font-display); font-weight: 700; font-size: 1.2rem;
}
.engineer-card__info { flex: 1; }
.engineer-card__info h3 { font-size: 1rem; color: var(--on-surface); }
.engineer-card__username { font-size: 0.8rem; color: var(--on-surface-variant); }
.engineer-card__stack { display: flex; flex-wrap: wrap; gap: 0.375rem; }

/* === JOB CARD === */
.job-card {
  background: var(--surface-container);
  border-radius: var(--radius-lg); padding: 1.5rem;
  display: flex; flex-direction: column; gap: 0.75rem;
  transition: all 0.3s ease;
}
.job-card:hover {
  background: var(--surface-container-high);
  box-shadow: 0 24px 48px rgba(0,0,0,0.3), 0 0 12px rgba(204,151,255,0.05);
  transform: translateY(-2px);
}
.job-card__top { display: flex; align-items: center; gap: 0.5rem; }
.job-card__title { font-size: 1.1rem; color: var(--on-surface); }
.job-card__company { font-size: 0.85rem; color: var(--on-surface-variant); }
.job-card__budget { font-size: 1rem; color: var(--secondary); font-weight: 600; font-family: var(--font-display); }
.job-card__skills { display: flex; flex-wrap: wrap; gap: 0.375rem; }

/* === BOUNTY CARD === */
.bounty-card {
  background: var(--surface-container);
  border-radius: var(--radius-lg); padding: 1.5rem;
  display: flex; flex-direction: column; gap: 0.75rem;
  transition: all 0.3s ease;
  border-left: 3px solid var(--warning);
}
.bounty-card:hover {
  background: var(--surface-container-high);
  box-shadow: 0 24px 48px rgba(0,0,0,0.3);
  transform: translateY(-2px);
}
.bounty-card__reward {
  font-size: 1.5rem; font-weight: 700; color: var(--warning);
  font-family: var(--font-display);
}
.bounty-card__title { font-size: 1rem; color: var(--on-surface); }
.bounty-card__desc { font-size: 0.85rem; color: var(--on-surface-variant); line-height: 1.5; }
.bounty-card__deadline {
  display: inline-flex; align-items: center; gap: 0.25rem;
  font-size: 0.75rem; color: var(--error);
  font-family: var(--font-display); font-weight: 500;
}
.bounty-card__skills { display: flex; flex-wrap: wrap; gap: 0.375rem; }

/* === PRODUCT CARD === */
.product-card {
  background: var(--surface-container);
  border-radius: var(--radius-lg); overflow: hidden;
  transition: all 0.3s ease;
}
.product-card:hover {
  background: var(--surface-container-high);
  box-shadow: 0 24px 48px rgba(0,0,0,0.3), 0 0 12px rgba(204,151,255,0.05);
  transform: translateY(-3px);
}
.product-card__thumb {
  position: relative; width: 100%; aspect-ratio: 16/9;
  background: var(--surface-container-low); overflow: hidden;
}
.product-card__thumb img { width: 100%; height: 100%; object-fit: cover; }
.product-card__thumb-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-size: 1rem; color: var(--outline);
  text-transform: uppercase; letter-spacing: 0.1em;
}
.product-card__body { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
.product-card__body h3 { font-size: 1rem; color: var(--on-surface); }
.product-card__body p { font-size: 0.8rem; color: var(--on-surface-variant); line-height: 1.4; }
.product-card__meta { display: flex; justify-content: space-between; align-items: center; }
.product-card__stars { color: var(--warning); font-size: 0.85rem; }
.product-card__price { color: var(--secondary); font-weight: 700; font-family: var(--font-display); }
.product-card__stack {
  display: flex; flex-wrap: wrap; gap: 0.25rem;
  opacity: 0; transition: opacity 0.3s;
}
.product-card__actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
.product-card__actions .btn-primary,
.product-card__actions .btn-secondary { flex: 1; font-size: 0.8rem; padding: 0.5rem; }

/* === NAV === */
.nav {
  position: sticky; top: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 2rem;
  background: rgba(6, 14, 32, 0.8); backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(64, 72, 93, 0.15);
}
.nav__logo {
  font-family: var(--font-display); font-weight: 700; font-size: 1.25rem;
  background: linear-gradient(to right, var(--primary), var(--secondary));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.nav__links { display: flex; gap: 1.5rem; align-items: center; }
.nav__link {
  font-size: 0.875rem; color: var(--on-surface-variant);
  transition: color 0.2s; font-weight: 500;
}
.nav__link:hover, .nav__link--active { color: var(--on-surface); }

/* === PAGE LAYOUTS === */
.page-container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
.page-header { margin-bottom: 2rem; }
.page-header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
.page-header p { color: var(--on-surface-variant); font-size: 1rem; }

.grid-3 {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}
.grid-2 {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.25rem;
}

.sidebar-layout {
  display: grid; grid-template-columns: 260px 1fr; gap: 2rem;
}

/* === FILTERS SIDEBAR === */
.filters {
  background: var(--surface-container);
  border-radius: var(--radius-lg); padding: 1.25rem;
  height: fit-content; position: sticky; top: 5rem;
}
.filters h3 {
  font-size: 0.85rem; color: var(--on-surface-variant);
  text-transform: uppercase; letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
}
.filter-group { margin-bottom: 1.5rem; }
.filter-option {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.375rem 0; font-size: 0.85rem; color: var(--on-surface-variant); cursor: pointer;
}
.filter-option:hover { color: var(--on-surface); }
.filter-option input[type="checkbox"] { accent-color: var(--primary); }

/* === HERO === */
.hero {
  text-align: center; padding: 5rem 2rem 3rem;
  position: relative; overflow: hidden;
}
.hero::before {
  content: ''; position: absolute; top: -50%; left: 50%; transform: translateX(-50%);
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(156,72,234,0.12) 0%, transparent 70%);
  pointer-events: none;
}
.hero h1 {
  font-size: 3.5rem; line-height: 1.1; margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--on-surface) 0%, var(--primary) 50%, var(--secondary) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.hero p {
  font-size: 1.125rem; color: var(--on-surface-variant);
  max-width: 600px; margin: 0 auto 2rem;
}
.hero__actions { display: flex; gap: 1rem; justify-content: center; }

/* === STAT CARDS === */
.stat-bar {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem;
  margin-bottom: 2rem; padding: 0 2rem;
}
.stat-card {
  background: var(--surface-container);
  border-radius: var(--radius-lg); padding: 1.5rem; text-align: center;
}
.stat-card__number {
  font-family: var(--font-display); font-size: 2rem; font-weight: 700;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.stat-card__label { font-size: 0.8rem; color: var(--on-surface-variant); margin-top: 0.25rem; }

/* === PROFILE PAGE === */
.profile-hero {
  display: flex; gap: 2rem; align-items: flex-start;
  margin-bottom: 3rem; flex-wrap: wrap;
}
.profile-hero__left { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.profile-avatar {
  width: 120px; height: 120px; border-radius: 50%; overflow: hidden;
  border: 3px solid var(--primary-dim);
}
.profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
.profile-hero__right { flex: 1; min-width: 300px; }
.profile-hero__right h1 { font-size: 1.75rem; margin-bottom: 0.25rem; }
.profile-bio { color: var(--on-surface-variant); margin: 0.75rem 0; }
.profile-philosophy {
  font-style: italic; color: var(--on-surface-variant); font-size: 0.9rem;
  padding-left: 1rem; border-left: 2px solid var(--primary-dim);
  margin: 1rem 0;
}
.profile-links { display: flex; gap: 1rem; margin-top: 0.75rem; }
.profile-links a {
  font-size: 0.85rem; color: var(--secondary);
  display: flex; align-items: center; gap: 0.25rem;
}

.section-title {
  font-size: 1.25rem; margin-bottom: 1.25rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(64, 72, 93, 0.15);
}

.project-case-study {
  background: var(--surface-container);
  border-radius: var(--radius-lg); padding: 1.5rem;
  margin-bottom: 1.25rem;
}
.project-case-study h3 { font-size: 1.1rem; margin-bottom: 0.75rem; }
.case-study-section { margin-bottom: 0.75rem; }
.case-study-section h4 {
  font-size: 0.75rem; color: var(--primary); text-transform: uppercase;
  letter-spacing: 0.08em; margin-bottom: 0.25rem;
}
.case-study-section p { font-size: 0.875rem; color: var(--on-surface-variant); }

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .sidebar-layout { grid-template-columns: 1fr; }
  .filters { position: static; }
  .hero h1 { font-size: 2rem; }
  .stat-bar { grid-template-columns: repeat(2, 1fr); }
  .nav { padding: 0.75rem 1rem; }
  .page-container { padding: 1rem; }
  .profile-hero { flex-direction: column; align-items: center; text-align: center; }
  .grid-3, .grid-2 { grid-template-columns: 1fr; }
}

/* === FORM STYLES === */
.form-group { margin-bottom: 1.25rem; }
.form-label {
  display: block; margin-bottom: 0.375rem;
  font-size: 0.8rem; color: var(--on-surface-variant);
  font-family: var(--font-display); text-transform: uppercase;
  letter-spacing: 0.06em;
}
.form-input, .form-textarea, .form-select {
  width: 100%; padding: 0.75rem 1rem;
  background: var(--surface-container-low);
  border: 1px solid rgba(64, 72, 93, 0.15);
  border-radius: var(--radius-md);
  color: var(--on-surface); font-family: var(--font-body); font-size: 0.9rem;
  transition: border-color 0.2s;
  outline: none;
}
.form-input:focus, .form-textarea:focus, .form-select:focus {
  border-color: var(--primary-dim);
  box-shadow: 0 0 0 3px rgba(156, 72, 234, 0.1);
}
.form-textarea { min-height: 120px; resize: vertical; }

/* skeleton loader */
.skeleton {
  background: linear-gradient(90deg, var(--surface-container) 25%, var(--surface-container-high) 50%, var(--surface-container) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
`);

console.log('globals.css done!');
