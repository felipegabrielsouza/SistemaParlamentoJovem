import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SessoesList({ searchParams }: { searchParams: { success?: string } }) {
  const sessoes = await prisma.session.findMany({ orderBy: { date: 'desc' } })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sessões Plenárias</h1>
        <Link href="/admin/sessoes/nova" className="bg-mococa-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-mococa-700 flex items-center space-x-2">
          <Plus size={18} /> <span>Nova Sessão</span>
        </Link>
      </div>

      {searchParams.success && <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 border border-green-200">Sessão criada com sucesso!</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessoes.map(s => (
          <div key={s.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-gray-800">{s.number}ª {s.title}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${s.status === 'Aberta' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {s.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-2">{s.date.toLocaleDateString('pt-BR')}</p>
            <p className="text-gray-500 text-sm">{s.description || 'Sem descrição'}</p>
          </div>
        ))}
        {sessoes.length === 0 && <p className="text-gray-500">Nenhuma sessão criada.</p>}
      </div>
    </div>
  )
}