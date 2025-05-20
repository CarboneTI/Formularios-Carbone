import SACForm from '@/components/SACForm'

export const metadata = {
  title: 'Formulário SAC | Central de Formulários',
  description: 'Formulário para solicitações SAC da Carbone Company',
}

export default function FormularioSAC() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 p-6">
      <SACForm />
    </main>
  )
} 