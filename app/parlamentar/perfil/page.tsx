import { getSession } from '@/lib/auth'
import { UserCircle } from 'lucide-react'

export default async function Perfil() {
  const user = await getSession()
  const p = user?.parliamentarian

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Meu Perfil</h1>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-100">
          <div className="w-20 h-20 bg-parlamento-100 text-parlamento-600 rounded-full flex items-center justify-center">
            <UserCircle size={48} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{p?.fullName}</h2>
            <p className="text-parlamento-600 font-medium">Jovem Parlamentar</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Escola / Instituição</label>
              <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">{p?.school}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Turma</label>
              <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">{p?.className}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Usuário do Sistema</label>
            <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">{user?.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">E-mail</label>
            <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">{user?.email || 'Não informado'}</p>
          </div>
        </div>
        
        <p className="text-xs text-gray-400 mt-8 text-center">Para alterações de dados cadastrais, procure a administração da Câmara Municipal.</p>
      </div>
    </div>
  )
}
