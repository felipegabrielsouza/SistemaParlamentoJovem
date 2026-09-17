import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { PlusCircle, FileText, Library } from 'lucide-react'

export default async function ParlamentarDashboard() {
  const user = await getSession()
  const pId = user?.parliamentarian?.id

  const propostasCount = await prisma.proposal.count({ where: { parliamentarianId: pId } })
 const cadastradasCount = await prisma.proposal.count({ where: { status: 'PROTOCOLADA' } })

  return (
    <div>
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Olá, {user?.parliamentarian?.fullName.split(' ')[0]}!</h1>
          <p className="text-gray-500">Bem-vindo(a) ao sistema do Parlamento Jovem de Mococa.</p>
        </div>
        <Link href="/parlamentar/nova-proposta" className="mt-6 md:mt-0 bg-parlamento-600 hover:bg-parlamento-700 text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 shadow-md transition">
          <PlusCircle size={22} /> <span>Nova Proposta</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/parlamentar/minhas-propostas" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-parlamento-500 hover:shadow-md transition group">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-parlamento-50 text-parlamento-600 rounded-xl group-hover:bg-parlamento-100 transition"><FileText size={32} /></div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Minhas Propostas</h3>
              <p className="text-gray-500">{propostasCount} propostas enviadas</p>
            </div>
          </div>
        </Link>

        <Link href="/parlamentar/proposituras-sessao" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-parlamento-500 hover:shadow-md transition group">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-100 transition"><Library size={32} /></div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Proposituras da Sessão</h3>
              <p className="text-gray-500">{cadastradasCount} proposituras oficiais</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
