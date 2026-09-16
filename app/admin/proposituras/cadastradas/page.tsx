import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function PropositurasCadastradas({ searchParams }: { searchParams: { success?: string } }) {
  const proposituras = await prisma.proposal.findMany({
    where: { status: 'Cadastrada' },
    include: { parliamentarian: true, session: true },
    orderBy: { formalizedAt: 'desc' }
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Proposituras Cadastradas</h1>
      <p className="text-gray-500 mb-6">Propostas que já foram analisadas, numeradas e vinculadas a uma sessão.</p>

      {searchParams.success && <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 border border-green-200">Propositura cadastrada com sucesso!</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="p-4 font-medium">Nº</th>
              <th className="p-4 font-medium">Sessão</th>
              <th className="p-4 font-medium">Tipo</th>
              <th className="p-4 font-medium">Assunto</th>
              <th className="p-4 font-medium">Autor</th>
              <th className="p-4 font-medium">Data Cadastro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {proposituras.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-900">{p.number}</td>
                <td className="p-4 text-gray-600">{p.session?.number}ª Sessão</td>
                <td className="p-4">
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md text-xs font-semibold">{p.type}</span>
                </td>
                <td className="p-4 text-gray-800 max-w-xs truncate" title={p.subject}>{p.subject}</td>
                <td className="p-4 text-gray-600">{p.parliamentarian.fullName}</td>
                <td className="p-4 text-gray-600 whitespace-nowrap">{p.formalizedAt?.toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
            {proposituras.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-gray-500">Nenhuma propositura cadastrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}