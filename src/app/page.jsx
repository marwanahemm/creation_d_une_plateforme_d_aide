import './landing.css'
import Link from 'next/link'
import LandingNav from '@/components/LandingNav'
import HeroSearch from '@/components/HeroSearch'
import supabase from '@/lib/supabaseClient'

export const revalidate = 60

export const metadata = {
  title: "Plateforme d'aide administrative — Guides pas à pas · Site non officiel",
  description: "Guides pas à pas pour vos démarches administratives en ligne : Ameli, CAF, France Travail. Gratuit, sans inscription, sans collecte de données.",
}

/* ── Icônes (SVG inline, sans dépendance) ── */
const ico = {
  sante: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  famille: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>,
  emploi: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  fisc: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  secu: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>,
}

// catégorie → { classe couleur, icône }
const CAT = {
  'Santé':     { cls: 'c-sante',   ic: ico.sante },
  'Famille':   { cls: 'c-famille', ic: ico.famille },
  'Emploi':    { cls: 'c-emploi',  ic: ico.emploi },
  'Fiscalité': { cls: 'c-fisc',    ic: ico.fisc },
  'Sécurité':  { cls: 'c-secu',    ic: ico.secu },
}
const CAT_DEFAUT = { cls: 'c-sante', ic: ico.fisc }

// Couleurs de la barre supérieure des cartes de guides
const BARRE = {
  'Santé': '#000091', 'Famille': '#6f42c1', 'Emploi': '#ff6f5c',
  'Fiscalité': '#18753c', 'Sécurité': '#d97706',
}

function organisme(lien) {
  if (!lien) return null
  try { return new URL(lien).hostname.replace(/^www\./, '').split('.')[0] }
  catch { return null }
}

export default async function AccueilPage() {
  const { data } = await supabase
    .from('tutoriels')
    .select('id, titre, categorie, duree, description, lien, etapes')
    .order('id')

  const tutoriels = data ?? []
  const nbGuides = tutoriels.length
  const nbOrganismes = new Set(tutoriels.map(t => organisme(t.lien)).filter(Boolean)).size

  const compte = tutoriels.reduce((a, t) => { if (t.categorie) a[t.categorie] = (a[t.categorie] || 0) + 1; return a }, {})
  const categories = Object.keys(compte).sort()
  const guidesEnAvant = tutoriels.slice(0, 6)

  return (
    <div className="landing">
      <LandingNav />

      {/* ════ HERO ════ */}
      <header className="hero">
        <div className="hero-inner wrap">
          <span className="hero-tag">
            <span className="hero-tag-dot" />
            Gratuit · Sans inscription · Sans collecte de données
          </span>
          <h1>Vos démarches en ligne,<br /><em>enfin simples.</em></h1>
          <p className="hero-p">
            Des guides pas à pas pour Ameli, la CAF, France Travail et d&apos;autres.
            On vous accompagne de la préparation des documents jusqu&apos;au site officiel.
          </p>
          <HeroSearch />
          <p className="hero-hint">
            Pas sûr par où commencer ? <Link href="/tutoriels">Voir tous les guides</Link>
          </p>
        </div>
      </header>

      {/* ════ STATS ════ */}
      <section className="stats">
        <div className="stats-inner">
          <div className="stat">
            <div className="stat-num">{nbGuides}</div>
            <div className="stat-label">Guide{nbGuides > 1 ? 's' : ''} disponible{nbGuides > 1 ? 's' : ''}</div>
          </div>
          <div className="stat">
            <div className="stat-num">{nbOrganismes || nbGuides}</div>
            <div className="stat-label">Organismes couverts</div>
          </div>
          <div className="stat">
            <div className="stat-num">0 €</div>
            <div className="stat-label">Coût pour vous</div>
          </div>
          <div className="stat">
            <div className="stat-num">0</div>
            <div className="stat-label">Donnée collectée</div>
          </div>
        </div>
      </section>

      {/* ════ CATÉGORIES ════ */}
      {categories.length > 0 && (
        <section className="section" id="categories">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Par thème</span>
              <h2>Quel domaine vous <em>concerne&nbsp;?</em></h2>
              <p className="section-lead">Choisissez une catégorie pour trouver votre guide plus vite.</p>
            </div>
            <ul className="cat-grid">
              {categories.map(cat => {
                const c = CAT[cat] ?? CAT_DEFAUT
                return (
                  <li key={cat}>
                    <Link href="/tutoriels" className={`cat-card ${c.cls}`}>
                      <span className="cat-icon">{c.ic}</span>
                      <span className="cat-nom">{cat}</span>
                      <span className="cat-compte">{compte[cat]} guide{compte[cat] > 1 ? 's' : ''}</span>
                      <span className="cat-go">Découvrir →</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      )}

      {/* ════ GUIDES EN AVANT ════ */}
      <section className="section" id="guides" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Les guides</span>
            <h2>Commencez <em>maintenant.</em></h2>
            <p className="section-lead">Chaque guide est court, illustré et basé sur la procédure officielle.</p>
          </div>
          <ul className="guides-grid">
            {guidesEnAvant.map(t => {
              const c = CAT[t.categorie] ?? CAT_DEFAUT
              const nbEtapes = Array.isArray(t.etapes) ? t.etapes.length : 0
              return (
                <li key={t.id}>
                  <Link href={`/tutoriels/${t.id}`} className="guide-card">
                    <span className="guide-top" style={{ background: BARRE[t.categorie] ?? '#000091' }} />
                    <div className="guide-body">
                      <div className="guide-head">
                        <span className={`guide-icon ${c.cls}`}>
                          {c.ic}
                        </span>
                        <span className="guide-cat">{t.categorie}</span>
                      </div>
                      <h3>{t.titre}</h3>
                      <p>{t.description}</p>
                      <div className="guide-meta">
                        {t.duree && <span className="guide-badge">⏱ {t.duree}</span>}
                        {nbEtapes > 0 && <span className="guide-badge">📋 {nbEtapes} étape{nbEtapes > 1 ? 's' : ''}</span>}
                      </div>
                      <span className="guide-go">Commencer →</span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="section-cta">
            <Link href="/tutoriels" className="btn-ghost">Voir tous les guides →</Link>
          </div>
        </div>
      </section>

      {/* ════ COMMENT ÇA MARCHE ════ */}
      <section className="steps-band">
        <div className="section wrap" id="comment">
          <div className="section-head">
            <span className="eyebrow">Fonctionnement</span>
            <h2>De zéro au site officiel, <em>en 4 étapes.</em></h2>
          </div>
          <ol className="steps">
            <li className="step"><div className="step-num">1</div><h3>Choisissez un guide</h3><p>Parcourez les guides et sélectionnez la démarche qui vous concerne.</p></li>
            <li className="step"><div className="step-num">2</div><h3>Préparez vos documents</h3><p>Chaque guide commence par la liste des informations à avoir sous la main.</p></li>
            <li className="step"><div className="step-num">3</div><h3>Suivez les étapes</h3><p>Avancez pas à pas et cochez chaque action au fur et à mesure.</p></li>
            <li className="step"><div className="step-num">4</div><h3>Accédez au site officiel</h3><p>Un lien direct vous amène sur la plateforme officielle pour finaliser.</p></li>
          </ol>
        </div>
      </section>

      {/* ════ CONFIANCE ════ */}
      <section className="section" id="confiance">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Pourquoi nous faire confiance</span>
            <h2>Pensée pour <em>tous les citoyens.</em></h2>
            <p className="section-lead">Que vous soyez à l&apos;aise ou non avec le numérique, cette plateforme est faite pour vous.</p>
          </div>
          <ul className="trust-grid">
            <li className="trust-card">
              <span className="trust-icon c-sante"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg></span>
              <h3>Contenu vérifié</h3>
              <p>Chaque guide suit les procédures officielles des organismes : Ameli, CAF, France Travail.</p>
            </li>
            <li className="trust-card">
              <span className="trust-icon c-fisc"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg></span>
              <h3>100 % gratuit</h3>
              <p>Aucun abonnement, aucune inscription, aucune donnée personnelle collectée.</p>
            </li>
            <li className="trust-card">
              <span className="trust-icon c-famille"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></span>
              <h3>Accessible à tous</h3>
              <p>Simple même pour les personnes peu à l&apos;aise avec le numérique. Lisible sur tous les écrans.</p>
            </li>
            <li className="trust-card">
              <span className="trust-icon c-emploi"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span>
              <h3>Liens officiels uniquement</h3>
              <p>Chaque guide renvoie vers les sites gouvernementaux officiels, jamais ailleurs.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* ════ CTA FINAL ════ */}
      <section className="final">
        <div className="final-inner">
          <h2>Prêt à faire votre démarche&nbsp;?</h2>
          <p>Choisissez votre guide et avancez à votre rythme. C&apos;est gratuit.</p>
          <Link href="/tutoriels" className="btn-white">Choisir mon guide →</Link>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="foot">
        <div className="foot-inner">
          <div className="foot-logo">
            <span className="nav-logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </span>
            <span className="nav-logo-text">
              Plateforme d&apos;aide administrative
              <small>Guides pas à pas, gratuits</small>
            </span>
          </div>
          <nav className="foot-links">
            <Link href="/tutoriels">Tous les guides</Link>
            <a href="https://www.service-public.fr" target="_blank" rel="noreferrer">Service-Public.fr</a>
            <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">CNIL</a>
          </nav>
        </div>
        <div className="foot-bottom">
          <span className="foot-mention">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#18753c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
            Site non officiel — aucune affiliation avec les organismes mentionnés.
          </span>
          <span className="foot-copy">© {new Date().getFullYear()} — Projet Titre Professionnel</span>
        </div>
      </footer>
    </div>
  )
}