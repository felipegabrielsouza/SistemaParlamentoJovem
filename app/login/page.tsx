import { loginAction } from '@/lib/actions'
import { Landmark } from 'lucide-react'

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-mococa-600 p-4 rounded-full text-white mb-4 shadow-md">
            <Landmark size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 text-center">Parlamento Jovem<br/>Mococa</h1>
        </div>

        {searchParams.error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm font-medium">
            {searchParams.error}
          </div>
        )}

        <form action={loginAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
            <input type="text" name="username" required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-mococa-500 focus:border-mococa-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input type="password" name="password" required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-mococa-500 focus:border-mococa-500 outline-none" />
          </div>
          <button type="submit" className="w-full bg-mococa-600 hover:bg-mococa-700 text-white font-semibold py-2 px-4 rounded-lg transition">
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  )
}
