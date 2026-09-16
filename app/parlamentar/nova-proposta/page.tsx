import { getSession } from '@/lib/auth'
import { createProposalAction } from '@/lib/actions'
import { Info } from 'lucide-react'

export default async function NovaProposta() {
  const user = await getSession()
  const pId = user?.parliamentarian?.id!
  const action = createProposalAction.bind(null, pId)

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Nova Proposta</h1>
      <p className="text-gray-500 mb-8">Envie sua Indicação, Moção ou Requerimento. O sistema registrará automaticamente a data e a sua autoria.</p>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl mb-6 flex items-start space-x-3 text-sm">
        <Info className="shrink-0 mt-0.5" size={18} />
        <p>A Sessão e o Número Oficial serão definidos posteriormente pela Mesa Diretora (Administração).</p>
      </div>

      <form action={action} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">1. Tipo da Proposta</label>
          <select name="type" required className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-parlamento-500 focus:bg-white transition text-gray-800 font-medium">
            <option value="">Selecione o tipo...</option>
            <option value="Indicação">Indicação</option>
            <option value="Moção">Moção</option>
            <option value="Requerimento">Requerimento</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">2. Assunto (Título curto)</label>
          <input type="text" name="subject" required placeholder="Ex: Melhorias na iluminação pública da rua X" className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-parlamento-500 focus:bg-white transition text-gray-800" />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">3. Resumo da Proposta (Justificativa)</label>
          <textarea name="summary" required rows={6} placeholder="Descreva o que você está solicitando e por quê..." className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-parlamento-500 focus:bg-white transition text-gray-800"></textarea>
        </div>

        <button type="submit" className="w-full bg-parlamento-600 hover:bg-parlamento-700 text-white font-bold py-4 rounded-xl shadow-md transition text-lg">
          ENVIAR PROPOSTA
        </button>
      </form>
    </div>
  )
}
