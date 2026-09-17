import { prisma } from '@/lib/db'
import { FileText, Users, Calendar, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const totalParlamentares = await prisma.parliamentarian.count()
  const totalRecebidas = await prisma.proposal.count({ where: { status: 'PENDENTE' } })
const totalCadastradas = await prisma.proposal.count({ where: { status: 'PROTOCOLADA' } })
  const sessoes = await prisma.session.count()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Administrativo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Jovens Parlamentares</p>
            <p className="text-2xl font-bold text-gray-800">{totalParlamentares}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg"><FileText size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Propostas Aguardando</p>
            <p className="text-2xl font-bold text-gray-800">{totalRecebidas}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg"><CheckCircle size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Proposituras Cadastradas</p>
            <p className="text-2xl font-bold text-gray-800">{totalCadastradas}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Calendar size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Sessões</p>
            <p className="text-2xl font-bold text-gray-800">{sessoes}</p>
          </div>
        </div>
      </div>
    </div>
  )
}