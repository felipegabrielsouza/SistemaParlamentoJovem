import { createParliamentarianAction } from '@/lib/actions'

export default function NovoParlamentar({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cadastrar Jovem Parlamentar</h1>
      
      {searchParams.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200 text-sm font-medium">
          {searchParams.error}
        </div>
      )}

      <form action={createParliamentarianAction} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input type="text" name="fullName" required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-mococa-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Escola / Instituição</label>
              <input type="text" name="school" required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-mococa-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Turma</label>
              <input type="text" name="className" required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-mococa-500 outline-none" />
            </div>
          </div>
          <hr className="my-2 border-gray-100" />
          <h3 className="font-semibold text-gray-800">Dados de Acesso</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input type="email" name="email" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-mococa-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome de Usuário</label>
              <input type="text" name="username" required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-mococa-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha Inicial</label>
              <input type="password" name="password" required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-mococa-500 outline-none" />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button type="submit" className="bg-mococa-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-mococa-700 transition">
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  )
}