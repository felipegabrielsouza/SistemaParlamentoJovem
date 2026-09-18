import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function PropostasRecebidasPage() {
  const proposals = await prisma.proposal.findMany({
    where: { status: 'PENDENTE' },
    include: { parliamentarian: true },
    orderBy: { createdAt: 'desc' }
  })

  async function deleteProposal(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await prisma.proposal.delete({ where: { id } })
    redirect('/admin/proposituras/recebidas')
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Propostas Recebidas (Aguardando Protocolo)</h1>

      {proposals.length === 0 ? (
        <p className="text-gray-500">Nenhuma proposta recebida pendente no momento.</p>
      ) : (
        <div className="space-y-4">
          {proposals.map((p) => (
            <div key={p.id} className="border border-gray-200 p-4 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded mb-1">
                  {p.type}
                </span>
                <h3 className="font-bold text-gray-800 text-lg">{p.summary}</h3>
                <p className="text-sm text-gray-600">Autor: {p.parliamentarian.name}</p>
              </div>

              <div className="flex items-center gap-2">
                <Link 
                  href={`/admin/proposituras/recebidas/${p.id}`}
                  className="bg-green-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-green-700"
                >
                  Protocolar
                </Link>

                <form action={deleteProposal}>
                  <input type="hidden" name="id" value={p.id} />
                  <button 
                    type="submit" 
                    className="bg-red-50 text-red-600 px-3 py-1.5 rounded text-xs font-medium hover:bg-red-100"
                  >
                    Excluir
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}