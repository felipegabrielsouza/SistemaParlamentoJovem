import { prisma } from '@/lib/db'

export default async function PropositurasSessao() {
  const proposituras = await prisma.proposal.findMany({
    where: { status: 'Cadastrada' },
    include: { parliamentarian: true, session: true },
    orderBy: { formalizedAt: 'desc' }
  })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Proposituras da Sessão</h1>
      <p className="text-gray-500 mb-8">Consulta de todas as propostas formalizadas na Câmara.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {proposituras.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
            <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-3">
              <span className="bg-gray-800 text-white px-3 py-1 rounded-lg font-bold text-sm">{p.number}</span>
              <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{p.type}</span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-2">{p.subject}</h3>
            <p className="text-gray-600 text-sm flex-1 mb-4">{p.summary}</p>
            
            <div className="mt-auto pt-4 border-t border-gray-100 text-sm">
              <p><span className="text-gray-500">Autor:</span> <strong className="text-gray-800">{p.parliamentarian.fullName}</strong></p>
              <p><span className="text-gray-500">Sessão:</span> <strong className="text-gray-800">{p.session?.number}ª Sessão Plenária</strong></p>
            </div>
          </div>
        ))}

        {proposituras.length === 0 && (
          <div className="col-span-full text-center p-12 bg-white rounded-2xl border border-gray-200 text-gray-500">
            Nenhuma propositura cadastrada ainda.
          </div>
        )}
      </div>
    </div>
  )
}
