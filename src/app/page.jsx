import './landing.css'
import Link from 'next/link'
import LandingNav from '@/components/LandingNav'
import supabase from '@/lib/supabaseClient'

// Régénère la page périodiquement (ISR) pour refléter les ajouts depuis l'admin
// sans dépendre d'un redéploiement.
export const revalidate = 60

// Icône SVG par catégorie (réutilisées de l'ancienne landing).
const ICONES = {
  Santé: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  ),
  Famille: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
  ),
  Emploi: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
  ),
  Fiscalité: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
  ),
  Sécurité: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
  ),
}

// Classe couleur (définie dans landing.css) par catégorie.
const COULEUR_CLASSE = {
  Santé: 'icon-red',
  Famille: 'icon-amber',
  Emploi: 'icon-indigo',
  Fiscalité: 'icon-green',
  Sécurité: 'icon-blue',
}

const ICONE_DEFAUT = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>
)

// Déduit le nom d'organisme depuis l'URL officielle (ex: ameli.fr → Ameli).
function organismeDepuisLien(lien) {
  if (!lien) return null
  try {
    const hote = new URL(lien).hostname.replace(/^www\./, '')
    return hote.split('.')[0]
  } catch {
    return null
  }
}

export const metadata = {
  title: 'Démarches administratives — Guides pas à pas · Site non officiel',
  description: "Guides pas à pas pour vos démarches administratives en ligne : Ameli, CAF, France Travail. Gratuit, sans inscription.",
}

export default async function AccueilPage() {
  const { data } = await supabase
    .from('tutoriels')
    .select('id, titre, categorie, duree, description, lien')
    .order('id')

  const tutoriels = data ?? []

  // Statistiques calculées en direct depuis la base.
  const nbGuides = tutoriels.length
  const nbOrganismes = new Set(
    tutoriels.map(t => organismeDepuisLien(t.lien)).filter(Boolean)
  ).size

  // On met en avant les premiers guides sur l'accueil.
  const guidesEnAvant = tutoriels.slice(0, 6)

  return (
    <>
      <LandingNav />

      <main>

        <section className="hero">
          <article className="hero-inner">
            <header>
              <p className="hero-tag">
                <span className="hero-tag-dot" />
                Gratuit · Sans inscription · Accessible
              </p>
              <h1>Vos démarches<br />administratives,<br /><em>site non officiel.</em></h1>
              <p className="hero-p">
                CAF, Ameli, France Travail. Des guides pas à pas pour vous
                accompagner de la préparation des documents jusqu&apos;au site officiel.
              </p>
              <nav className="hero-btns">
                <Link href="/tutoriels" className="btn-primary">Choisir mon guide →</Link>
                <a href="#comment" className="btn-secondary">Comment ça marche</a>
              </nav>
            </header>
          </article>
        </section>

        <aside className="proof">
          <ul className="proof-inner">
            <li className="proof-item">
              <strong className="proof-num">{nbGuides}</strong>
              <span className="proof-label">Guide{nbGuides > 1 ? 's' : ''} disponible{nbGuides > 1 ? 's' : ''}</span>
            </li>
            <li className="proof-item">
              <strong className="proof-num">{nbOrganismes || nbGuides}</strong>
              <span className="proof-label">Organismes couverts</span>
            </li>
            <li className="proof-item">
              <strong className="proof-num">0 €</strong>
              <span className="proof-label">Coût pour l&apos;utilisateur</span>
            </li>
            <li className="proof-item">
              <strong className="proof-num">0</strong>
              <span className="proof-label">Donnée collectée</span>
            </li>
          </ul>
        </aside>

        <section className="section" id="guides">
          <header className="section-inner guides-header">
            <hgroup>
              <span className="section-label">Les guides</span>
              <h2 className="section-h2">Quelle démarche<br /><em>vous concerne ?</em></h2>
            </hgroup>
            <Link href="/tutoriels" className="guides-link">Voir tous les guides →</Link>
          </header>

          <ul className="guides-grid section-inner">
            {guidesEnAvant.map(t => (
              <li key={t.id}>
                <Link href={`/tutoriels/${t.id}`} className="guide-card">
                  <span className={`guide-icon-wrap ${COULEUR_CLASSE[t.categorie] ?? 'icon-indigo'}`}>
                    {ICONES[t.categorie] ?? ICONE_DEFAUT}
                  </span>
                  <span className="guide-cat">{t.categorie}</span>
                  <h3>{t.titre}</h3>
                  <p>{t.description}</p>
                  <footer className="guide-meta">
                    {t.duree && <mark className="guide-badge badge-time">{t.duree}</mark>}
                  </footer>
                  <span className="guide-go">Commencer →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="section" id="comment">
          <header className="section-inner">
            <span className="section-label">Fonctionnement</span>
            <h2 className="section-h2">De zéro au site officiel,<br /><em>en 4 étapes.</em></h2>
            <p className="section-lead">Aucune inscription, aucune donnée collectée. Choisissez et avancez à votre rythme.</p>
          </header>

          <ol className="steps section-inner">
            <li className="step-card">
              <header className="step-header">
                <span className="step-num">1</span>
                <span className="step-icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </span>
              </header>
              <h3>Choisissez un guide</h3>
              <p>Parcourez les guides et sélectionnez la démarche qui vous concerne.</p>
            </li>
            <li className="step-card">
              <header className="step-header">
                <span className="step-num">2</span>
                <span className="step-icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 13h4"/><path d="M10 17h4"/></svg>
                </span>
              </header>
              <h3>Préparez vos documents</h3>
              <p>Chaque guide commence par la liste des informations à avoir sous la main.</p>
            </li>
            <li className="step-card">
              <header className="step-header">
                <span className="step-num">3</span>
                <span className="step-icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </span>
              </header>
              <h3>Suivez les étapes</h3>
              <p>Avancez pas à pas et cochez chaque action au fur et à mesure.</p>
            </li>
            <li className="step-card">
              <header className="step-header">
                <span className="step-num">4</span>
                <span className="step-icon-wrap">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                </span>
              </header>
              <h3>Accédez au site officiel</h3>
              <p>Un lien direct vous amène sur la plateforme officielle pour finaliser.</p>
            </li>
          </ol>
        </section>

        <section className="section" id="confiance">
          <header className="section-inner">
            <span className="section-label">Pourquoi faire confiance à cette plateforme</span>
            <h2 className="section-h2">Une plateforme pensée<br /><em>pour tous les citoyens.</em></h2>
            <p className="section-lead">Que vous soyez à l&apos;aise ou non avec le numérique, cette plateforme est faite pour vous.</p>
          </header>

          <ul className="trust-grid section-inner">
            <li className="trust-card">
              <span className="trust-icon icon-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
              </span>
              <h3>Contenu vérifié</h3>
              <p>Chaque guide est basé sur les procédures officielles des organismes concernés : Ameli, CAF, France Travail.</p>
            </li>
            <li className="trust-card">
              <span className="trust-icon icon-green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
              </span>
              <h3>100 % gratuit</h3>
              <p>Aucun abonnement, aucune inscription, aucune donnée personnelle collectée. Accès libre et immédiat.</p>
            </li>
            <li className="trust-card">
              <span className="trust-icon icon-indigo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              </span>
              <h3>Accessible à tous</h3>
              <p>Conçu pour être simple même pour les personnes peu à l&apos;aise avec le numérique. Lisible sur tous les écrans.</p>
            </li>
            <li className="trust-card">
              <span className="trust-icon icon-amber">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </span>
              <h3>Liens officiels uniquement</h3>
              <p>Chaque guide renvoie vers les sites gouvernementaux officiels.</p>
            </li>
          </ul>
        </section>

      </main>

      <footer className="footer">
        <strong className="footer-logo">
          <span className="footer-bar" />
          Plateforme de démarches administratives
        </strong>
        <nav className="footer-links">
          <a href="https://www.service-public.fr" target="_blank" rel="noreferrer">Service-Public.fr</a>
          <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">CNIL</a>
        </nav>
        <small className="footer-copy">© {new Date().getFullYear()} — Projet Titre Professionnel</small>
      </footer>
    </>
  )
}