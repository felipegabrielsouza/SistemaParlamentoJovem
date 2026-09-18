import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export default async function MeuPerfilPage() {
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

  if (!user) redirect('/login')

  async function updateProfile(formData: FormData) {
    'use server'
    if (!user) return

    const username = formData.get('username') as string
    const password = formData.get('password') as string

    const dataToUpdate: any = { username }
    if (password && password.trim() !== '') {
      dataToUpdate.password = await bcrypt.hash(password, 10)
    }

    await prisma.user.update({
      where: { id: user.id },
      data: dataToUpdate
    })

    redirect('/parlamentar/perfil')
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Meu Perfil</h1>

      <div className="mb-6 p-4 bg-gray-50 rounded-md space-y-1">
        <p className="text-sm text-gray-700"><strong>Nome:</strong> {user.parliamentarian?.name}</p>
        <p className="text-sm text-gray-700"><strong>Escola:</strong> {user.parliamentarian?.school}</p>
      </div>

      <form action={updateProfile} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome de Usuário</label>
          <input 
            type="text" 
            name="username" 
            defaultValue={user.username} 
            required 
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nova Senha (opcional)</label>
          <input 
            type="password" 
            name="password" 
            placeholder="Digite nova senha se desejar alterar" 
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-medium"
        >
          Atualizar Dados
        </button>
      </form>
    </div>
  )
}