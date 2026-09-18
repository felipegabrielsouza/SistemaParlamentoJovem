import { prisma } from '@/lib/prisma'
import Link from 'next/link'
export const dynamic = 'force-dynamic'

export default async function PropositurasCadastradas() {
  const proposituras = await prisma.proposal.findMany({
    where: { status: 'PROTOCOLADA' },
    include: { parliamentarian: true, session: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Proposituras Protocoladas (Cadastradas)</h1>

      {proposituras.length === 0 ? (
        <p className="text-gray-500">Nenhuma propositura protocolada até o momento.</p>
      ) : (
        <div className="space-y-4">
          {proposituras.map((p) => (
            <div key={p.id} className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-1">
                <div className="flex items-center gap-2">
                  {/* Tipo da Propositura */}
                  <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-bold rounded uppercase">
                    {p.type}
                  </span>
                  
                  {/* Ambos os números (Propositura e Protocolo) */}
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                    {p.protocolNumber || 'Protocolo pendente'}
                  </span>
                </div>

                {p.session && (
                  <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    Sessão #{p.session.number} - {p.session.title}
                  </span>
                )}
              </div>

              {/* Ementa Oficial / Resumo */}
              <h3 className="font-bold text-gray-800 text-base">
                {p.officialEmenta || p.summary}
              </h3>

              {/* Autor */}
              <p className="text-sm text-gray-600">
                Autor(a): <span className="font-semibold text-gray-700">{p.parliamentarian.name}</span>
              </p>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-xs text-gray-500">
                <span>Protocolado em: {new Date(p.createdAt).toLocaleDateString('pt-BR')}</span>
                {p.pdfUrl && (
                  <a 
                    href={p.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded font-medium hover:bg-indigo-700"
                  >
                    Baixar PDF Oficial
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}