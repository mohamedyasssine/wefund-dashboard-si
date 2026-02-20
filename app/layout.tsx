import type { Metadata } from 'next'
import Layout from '@/components/ui/Layout'
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
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
