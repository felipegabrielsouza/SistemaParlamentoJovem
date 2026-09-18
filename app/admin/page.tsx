import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Users, Calendar, FileText, CheckCircle } from 'lucide-react'

export default async function AdminDashboard() {
  const totalParlamentares = await prisma.parliamentarian.count()
  const totalSessoes = await prisma.session.count()
  const propostasPendentes = await prisma.proposal.count({ where: { status: 'PENDENTE' } })
  const propostasProtocoladas = await prisma.proposal.count({ where: { status: 'PROTOCOLADA' } })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Painel do Administrador</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><Users size={28} /></div>
            <div>
              <p className="text-gray-500 text-sm">Parlamentares</p>
              <h3 className="text-2xl font-bold text-gray-800">{totalParlamentares}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-xl"><Calendar size={28} /></div>
            <div>
              <p className="text-gray-500 text-sm">Sessões</p>
              <h3 className="text-2xl font-bold text-gray-800">{totalSessoes}</h3>
            </div>
          </div>
        </div>

        <Link href="/admin/proposituras/recebidas" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-parlamento-500 transition group">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-100 transition"><FileText size={28} /></div>
            <div>
              <p className="text-gray-500 text-sm">Propostas Pendentes</p>
              <h3 className="text-2xl font-bold text-gray-800">{propostasPendentes}</h3>
            </div>
          </div>
        </Link>

        <Link href="/admin/proposituras/cadastradas" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-parlamento-500 transition group">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-100 transition"><CheckCircle size={28} /></div>
            <div>
              <p className="text-gray-500 text-sm">Protocoladas</p>
              <h3 className="text-2xl font-bold text-gray-800">{propostasProtocoladas}</h3>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}