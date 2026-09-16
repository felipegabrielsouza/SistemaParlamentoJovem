import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export default async function MinhasPropostas({ searchParams }: { searchParams: { success?: string } }) {
  const user = await getSession()
  const pId = user?.parliamentarian?.id!

  const propostas = await prisma.proposal.findMany({
    where: { parliamentarianId: pId },
    include: { session: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Minhas Propostas</h1>
      <p className="text-gray-500 mb-8">Acompanhe o status das propostas que você enviou.</p>

      {searchParams.success && (
        <div className="bg-green-100 text-green-800 p-4 rounded-xl mb-6 font-medium shadow-sm">
          ✅ Proposta enviada com sucesso!
        </div>
      )}

      <div className="space-y-4">
        {propostas.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-2">
              <div className="flex items-center space-x-3">
                <span className="bg-parlamento-100 text-parlamento-800 px-3 py-1 rounded-lg text-sm font-bold">{p.type}</span>
                <span className={`px-3 py-1 rounded-lg text-sm font-bold ${p.status === 'Cadastrada' ? 'bg-indigo-100 text-indigo-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {p.status}
                </span>
              </div>
              <span className="text-sm text-gray-400 font-medium">{p.createdAt.toLocaleString('pt-BR')}</span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2">{p.subject}</h3>
            <p className="text-gray-600 line-clamp-2">{p.summary}</p>

            {p.status === 'Cadastrada' && (
              <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50 p-4 rounded-xl flex items-center space-x-6 text-sm">
                <div>
                  <span className="block text-gray-500 font-medium mb-1">Nº Oficial</span>
                  <span className="font-bold text-gray-800 bg-white px-2 py-1 border rounded">{p.number}</span>
                </div>
                <div>
                  <span className="block text-gray-500 font-medium mb-1">Sessão</span>
                  <span className="font-bold text-gray-800">{p.session?.number}ª Sessão Plenária</span>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {propostas.length === 0 && (
          <div className="text-center p-12 bg-white rounded-2xl border border-gray-200 text-gray-500">
            Você ainda não enviou nenhuma proposta.
          </div>
        )}
      </div>
    </div>
  )
}
