import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken'
import Link from 'next/link'

export default async function MinhasPropostasPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) redirect('/login')

  let decoded: any
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!)
  } catch (e) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: { parliamentarian: true }
  })

  if (!user || !user.parliamentarian) redirect('/login')

  const proposals = await prisma.proposal.findMany({
    where: { parliamentarianId: user.parliamentarian.id },
    include: { session: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Minhas Propostas</h1>
        <Link 
          href="/parlamentar/nova-proposta" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
        >
          + Nova Proposta
        </Link>
      </div>

      {proposals.length === 0 ? (
        <p className="text-gray-500">Você ainda não enviou nenhuma proposta.</p>
      ) : (
        <div className="space-y-4">
          {proposals.map((p) => (
            <div key={p.id} className="border border-gray-200 p-4 rounded-md shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                    p.status === 'PROTOCOLADA' ? 'bg-green-100 text-green-800' :
                    p.status === 'REJEITADA' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {p.status}
                  </span>
                  {p.protocolNumber && (
                    <span className="ml-2 font-mono text-xs font-bold text-gray-700">
                      {p.protocolNumber}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <h3 className="font-semibold text-gray-800 text-lg mb-1">{p.officialEmenta || p.summary}</h3>
              <p className="text-sm text-gray-600 mb-3">Tipo: {p.type}</p>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  {p.session ? `Sessão: #${p.session.number} - ${p.session.title}` : 'Aguardando designação de sessão'}
                </span>

                {p.pdfUrl ? (
                  <a 
                    href={p.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-indigo-700"
                  >
                    Baixar PDF Oficial
                  </a>
                ) : (
                  <span className="text-xs text-amber-600 italic">
                    {p.pdfPending ? 'PDF Pendente de Anexo' : 'Aguardando PDF'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}