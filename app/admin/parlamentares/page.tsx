import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ParlamentaresList({ searchParams }: { searchParams: { success?: string } }) {
  const list = await prisma.parliamentarian.findMany({ include: { user: true } })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Jovens Parlamentares</h1>
        <Link href="/admin/parlamentares/novo" className="bg-mococa-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-mococa-700 flex items-center space-x-2">
          <Plus size={18} /> <span>Cadastrar Parlamentar</span>
        </Link>
      </div>

      {searchParams.success && <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 border border-green-200">Parlamentar cadastrado com sucesso!</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="p-4 font-medium">Nome</th>
              <th className="p-4 font-medium">Escola</th>
              <th className="p-4 font-medium">Usuário</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {list.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">{p.name}</td>
                <td className="p-4 text-gray-600">{p.school}</td>
                <td className="p-4 text-gray-600">{p.user.username}</td>
                // Altere o bloco da coluna de status/ativo para algo simples como:
<td className="p-4">
  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
    Ativo
  </span>
</td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Nenhum parlamentar cadastrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}