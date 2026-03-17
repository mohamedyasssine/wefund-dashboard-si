import Header from './Header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      {/* Lien d'évitement : permet aux utilisateurs clavier / lecteurs d'écran
          de sauter directement au contenu principal (RGAA 12.7, WCAG 2.4.1). */}
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>

      <Header />

      <main id="main-content" role="main" tabIndex={-1}>
        {children}
      </main>
    </div>
  )
}
