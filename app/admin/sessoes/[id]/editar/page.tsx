import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditarSessaoPage({ params }: PageProps) {
  const { id } = await params

  const session = await prisma.session.findUnique({
    where: { id }
  })

  if (!session) redirect('/admin/sessoes')

  async function updateSession(formData: FormData) {
    'use server'
    const number = parseInt(formData.get('number') as string)
    const title = formData.get('title') as string
    const date = new Date(formData.get('date') as string)
    const description = formData.get('description') as string

    await prisma.session.update({
      where: { id },
      data: {
        number,
        title,
        date,
        description
      }
    })

    redirect('/admin/sessoes')
  }

  // Formata a data para o input type="date" (YYYY-MM-DD)
  const formattedDate = session.date ? new Date(session.date).toISOString().split('T')[0] : ''

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Editar Sessão Plenária</h1>

      <form action={updateSession} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Número da Sessão</label>
          <input 
            type="number" 
            name="number" 
            defaultValue={session.number} 
            required 
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input 
            type="text" 
            name="title" 
            defaultValue={session.title} 
            required 
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Data</label>
          <input 
            type="date" 
            name="date" 
            defaultValue={formattedDate} 
            required 
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descrição (Opcional)</label>
          <textarea 
            name="description" 
            defaultValue={session.description || ''} 
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-medium"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  )
}