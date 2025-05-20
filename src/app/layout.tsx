import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Configuração de metadados com favicon da Carbone Company
// Estamos usando tanto o favicon remoto da URL da Carbone quanto um local como fallback
// Em caso de problemas com o favicon remoto, o navegador usará o local
export const metadata: Metadata = {
  title: 'Central de Formulários - Carbone Company',
  description: 'Sistema de formulários personalizados para a Carbone Company',
  keywords: ['marketing digital', 'agência de marketing', 'publicidade', 'branding', 'mídias sociais'],
  authors: [{ name: 'Carbone Company' }],
  creator: 'Carbone Company',
  publisher: 'Carbone Company',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: 'https://carbonecompany.com.br/wp-content/uploads/2025/02/android-chrome-512x512-2.png' },
      { url: '/favicon.ico' }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        {/* Fallback para o ícone caso a URL externa não funcione */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link 
          rel="icon" 
          href="https://carbonecompany.com.br/wp-content/uploads/2025/02/android-chrome-512x512-2.png" 
        />
      </head>
      <body className={`${inter.className} antialiased bg-[#0F1117]`}>
        {children}
      </body>
    </html>
  )
} 