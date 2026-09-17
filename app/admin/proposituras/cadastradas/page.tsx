import { prisma } from '@/lib/prisma'
import Link from 'next/link'

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
            <div key={p.id} className="border border-gray-200 p-4 rounded-md shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded mr-2">
                    {p.protocolNumber}
                  </span>
                  <span className="text-xs font-medium text-gray-500">{p.type}</span>
                </div>
                {p.session && (
                  <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    Sessão #{p.session.number} - {p.session.title}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-gray-800 text-lg mb-1">{p.officialEmenta || p.summary}</h3>
              <p className="text-sm text-gray-600 mb-3">Autor: {p.parliamentarian.name}</p>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-xs text-gray-500">
                <span>Criada em: {new Date(p.createdAt).toLocaleDateString('pt-BR')}</span>
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