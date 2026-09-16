import { prisma } from '@/lib/db'
import { formalizeProposalAction } from '@/lib/actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function FormalizarProposta({ params }: { params: { id: string } }) {
  const proposal = await prisma.proposal.findUnique({
    where: { id: params.id },
    include: { parliamentarian: true }
  })

  if (!proposal) redirect('/admin/proposituras/recebidas')

  const sessoes = await prisma.session.findMany({ where: { status: 'Aberta' }, orderBy: { date: 'asc' } })
  const formalize = formalizeProposalAction.bind(null, proposal.id)

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/admin/proposituras/recebidas" className="flex items-center space-x-2 text-gray-500 hover:text-gray-800 mb-6">
        <ArrowLeft size={16} /> <span>Voltar</span>
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Dados da Proposta Original</h2>
            <div className="space-y-4 text-sm">
              <div>
                <span className="block text-gray-500 font-medium text-xs uppercase mb-1">Parlamentar</span>
                <p className="font-semibold text-gray-800 text-base">{proposal.parliamentarian.fullName}</p>
                <p className="text-gray-500">{proposal.parliamentarian.school}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-gray-500 font-medium text-xs uppercase mb-1">Tipo</span>
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md font-semibold">{proposal.type}</span>
                </div>
                <div>
                  <span className="block text-gray-500 font-medium text-xs uppercase mb-1">Enviado em</span>
                  <p className="text-gray-800">{proposal.createdAt.toLocaleString('pt-BR')}</p>
                </div>
              </div>
              <div>
                <span className="block text-gray-500 font-medium text-xs uppercase mb-1">Assunto</span>
                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">{proposal.subject}</p>
              </div>
              <div>
                <span className="block text-gray-500 font-medium text-xs uppercase mb-1">Resumo Completo</span>
                <p className="text-gray-800 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-100">{proposal.summary}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-gray-900 p-6 rounded-xl shadow-md text-white sticky top-6">
            <h2 className="text-lg font-bold mb-4">Cadastrar Propositura</h2>
            <p className="text-gray-400 text-sm mb-6">Formalize esta proposta definindo a Sessão correspondente e gerando o Número Oficial.</p>
            
            <form action={formalize} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Sessão Plenária</label>
                <select name="sessionId" required className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-mococa-500">
                  <option value="">Selecione...</option>
                  {sessoes.map(s => <option key={s.id} value={s.id}>{s.number}ª {s.title} ({s.date.toLocaleDateString('pt-BR')})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Número da Propositura</label>
                <input type="text" name="number" required placeholder="Ex: IND-001/2026" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-mococa-500" />
              </div>
              <button type="submit" className="w-full bg-mococa-600 hover:bg-mococa-700 text-white font-bold py-3 rounded-lg mt-4 transition">
                Formalizar Propositura
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
