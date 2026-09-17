import { getSession } from '@/lib/auth'
import { logoutAction } from '@/lib/actions'
import { Home, PlusCircle, FileText, Library, UserCircle, LogOut } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function ParlamentarLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()
  if (!user || user.role !== 'PARLAMENTARIAN') redirect('/login')

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <aside className="w-full md:w-64 bg-parlamento-900 text-white flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-parlamento-700">
          <h2 className="text-xl font-bold leading-tight">Parlamento Jovem<br/>Mococa</h2>
          <p className="text-xs text-parlamento-100 mt-2 font-medium bg-parlamento-700 inline-block px-2 py-1 rounded">Área do Parlamentar</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/parlamentar" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-parlamento-700 transition">
            <Home size={20} /> <span className="font-medium">Início</span>
          </Link>
          <Link href="/parlamentar/nova-proposta" className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-parlamento-600 hover:bg-parlamento-500 transition shadow-sm">
            <PlusCircle size={20} /> <span className="font-bold">Nova Proposta</span>
          </Link>
          <Link href="/parlamentar/minhas-propostas" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-parlamento-700 transition">
            <FileText size={20} /> <span className="font-medium">Minhas Propostas</span>
          </Link>
          <Link href="/parlamentar/proposituras-sessao" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-parlamento-700 transition">
            <Library size={20} /> <span className="font-medium">Proposituras da Sessão</span>
          </Link>
          <Link href="/parlamentar/perfil" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-parlamento-700 transition">
            <UserCircle size={20} /> <span className="font-medium">Meu Perfil</span>
          </Link>
        </nav>
        <div className="p-4">
          <form action={logoutAction}>
            <button className="flex justify-center items-center space-x-2 w-full px-4 py-3 text-red-100 bg-red-900 hover:bg-red-800 rounded-xl transition font-medium">
              <LogOut size={20} /> <span>Sair</span>
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto w-full">
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
