import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditarParlamentarPage({ params }: PageProps) {
  const { id } = await params

  const parliamentarian = await prisma.parliamentarian.findUnique({
    where: { id },
    include: { user: true }
  })

  if (!parliamentarian) redirect('/admin/parlamentares')

  async function updateParliamentarian(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const school = formData.get('school') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    const dataToUpdate: any = {
      name,
      school,
      user: {
        update: {
          username
        }
      }
    }

    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10)
      dataToUpdate.user.update.password = hashedPassword
    }

    await prisma.parliamentarian.update({
      where: { id },
      data: dataToUpdate
    })

    redirect('/admin/parlamentares')
  }

  async function deleteParliamentarian() {
    'use server'
    await prisma.user.delete({
      where: { id: parliamentarian.userId }
    })
    redirect('/admin/parlamentares')
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Editar Parlamentar</h1>
      
      <form action={updateParliamentarian} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
          <input 
            type="text" 
            name="name" 
            defaultValue={parliamentarian.name} 
            required 
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Escola</label>
          <input 
            type="text" 
            name="school" 
            defaultValue={parliamentarian.school} 
            required 
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nome de Usuário (Username)</label>
          <input 
            type="text" 
            name="username" 
            defaultValue={parliamentarian.user.username} 
            required 
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nova Senha (deixe em branco para não alterar)</label>
          <input 
            type="password" 
            name="password" 
            placeholder="••••••••" 
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
          >
            Salvar Alterações
          </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
        <span className="text-sm text-red-600">Excluir este parlamentar e seu acesso permanentemente</span>
        <form action={deleteParliamentarian}>
          <button 
            type="submit" 
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
          >
            Excluir Usuário
          </button>
        </form>
      </div>
    </div>
  )
}