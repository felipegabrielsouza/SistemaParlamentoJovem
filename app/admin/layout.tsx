import { logoutAction } from '@/lib/actions'
import { Users, LayoutDashboard, FileText, Calendar, LogOut, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white">Administração</h2>
          <p className="text-xs text-slate-400 mt-1">Parlamento Jovem</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition">
            <LayoutDashboard size={20} /> <span>Dashboard</span>
          </Link>
          <Link href="/admin/parlamentares" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition">
            <Users size={20} /> <span>Parlamentares</span>
          </Link>
          <Link href="/admin/sessoes" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition">
            <Calendar size={20} /> <span>Sessões</span>
          </Link>
          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Proposituras</div>
          <Link href="/admin/proposituras/recebidas" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition">
            <FileText size={20} /> <span>Recebidas</span>
          </Link>
          <Link href="/admin/proposituras/cadastradas" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition">
            <CheckCircle size={20} /> <span>Cadastradas</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <form action={logoutAction}>
            <button className="flex items-center space-x-3 px-3 py-2 w-full text-left rounded-lg hover:bg-red-500 hover:text-white transition">
              <LogOut size={20} /> <span>Sair</span>
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}
