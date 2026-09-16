import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function PropostasRecebidas() {
  const propostas = await prisma.proposal.findMany({
    where: { status: 'Recebida' },
    include: { parliamentarian: true },
    orderBy: { createdAt: 'asc' }
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Propostas Recebidas</h1>
      <p className="text-gray-500 mb-6">Propostas enviadas pelos jovens parlamentares aguardando formalização.</p>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="p-4 font-medium">Data/Hora</th>
              <th className="p-4 font-medium">Parlamentar</th>
              <th className="p-4 font-medium">Tipo</th>
              <th className="p-4 font-medium">Assunto</th>
              <th className="p-4 font-medium">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {propostas.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-4 text-gray-600 whitespace-nowrap">{p.createdAt.toLocaleString('pt-BR')}</td>
                <td className="p-4 font-medium text-gray-800">{p.parliamentarian.fullName}</td>
                <td className="p-4">
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md text-xs font-semibold">{p.type}</span>
                </td>
                <td className="p-4 text-gray-600">{p.subject}</td>
                <td className="p-4">
                  <Link href={`/admin/proposituras/recebidas/${p.id}`} className="text-mococa-600 hover:text-mococa-800 font-medium">
                    Analisar & Formalizar &rarr;
                  </Link>
                </td>
              </tr>
            ))}
            {propostas.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Nenhuma proposta na caixa de entrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
