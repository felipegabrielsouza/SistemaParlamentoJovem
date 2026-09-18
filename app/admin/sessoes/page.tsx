import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'
export const dynamic = 'force-dynamic'

export default async function SessoesAdminPage() {
  const sessions = await prisma.session.findMany({
    orderBy: { number: 'desc' },
    include: { _count: { select: { proposals: true } } }
  })

  async function deleteSession(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await prisma.session.delete({ where: { id } })
    redirect('/admin/sessoes')
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Sessões</h1>
        <Link 
          href="/admin/sessoes/nova" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
        >
          + Nova Sessão
        </Link>
      </div>

      {sessions.length === 0 ? (
        <p className="text-gray-500">Nenhuma sessão cadastrada ainda.</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => (
            <div key={s.id} className="border border-gray-200 p-4 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded mb-1">
                  Sessão #{s.number}
                </span>
                <h3 className="font-bold text-gray-800 text-lg">{s.title}</h3>
                <p className="text-sm text-gray-600">
                  Data: {new Date(s.date).toLocaleDateString('pt-BR')} | Propostas vinculadas: {s._count.proposals}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link 
                  href={`/admin/sessoes/${s.id}/editar`}
                  className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-200"
                >
                  Editar
                </Link>

                <form action={deleteSession}>
                  <input type="hidden" name="id" value={s.id} />
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