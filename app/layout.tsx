import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WeFund Dashboard SI',
  description: 'Dashboard de suivi pour la plateforme WeFund',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
