import { createSessionAction } from '@/lib/actions'

export default function NovaSessao() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Criar Nova Sessão</h1>
      <form action={createSessionAction} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input type="text" name="title" defaultValue="Sessão Ordinária" required className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-mococa-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
            <input type="number" name="number" required className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-mococa-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora</label>
          <input type="datetime-local" name="date" required className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-mococa-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea name="description" rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-mococa-500"></textarea>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="bg-mococa-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-mococa-700 transition">Criar Sessão</button>
        </div>
      </form>
    </div>
  )
}
