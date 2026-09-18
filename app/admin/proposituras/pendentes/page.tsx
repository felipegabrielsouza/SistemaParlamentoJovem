import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { writeFile } from 'fs/promises'
import path from 'path'
import { redirect } from 'next/navigation'
export const dynamic = 'force-dynamic'

export default async function PropostasPendentesPage() {
  const proposals = await prisma.proposal.findMany({
    where: { pdfPending: true, status: 'PROTOCOLADA' },
    include: { parliamentarian: true, session: true },
    orderBy: { createdAt: 'desc' }
  })

  async function uploadPendingPdf(formData: FormData) {
    'use server'
    const proposalId = formData.get('proposalId') as string
    const pdfFile = formData.get('pdfFile') as File

    if (pdfFile && pdfFile.size > 0) {
      const proposal = await prisma.proposal.findUnique({ where: { id: proposalId } })
      if (!proposal) return

      const bytes = await pdfFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filename = `${proposal.protocolNumber?.replace(/[/]/g, '-')}-${Date.now()}.pdf`
      const uploadDir = path.join(process.cwd(), 'public/uploads')
      
      await writeFile(path.join(uploadDir, filename), buffer)

      await prisma.proposal.update({
        where: { id: proposalId },
        data: {
          pdfUrl: `/uploads/${filename}`,
          pdfPending: false
        }
      })
    }

    redirect('/admin/proposituras/pendentes')
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Propostas com PDF Pendente</h1>

      {proposals.length === 0 ? (
        <p className="text-gray-500">Não há propostas com PDF pendente no momento. 🎉</p>
      ) : (
        <div className="space-y-4">
          {proposals.map((p) => (
            <div key={p.id} className="border border-yellow-300 bg-yellow-50 p-4 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="inline-block px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-semibold rounded mb-1">
                  {p.protocolNumber}
                </span>
                <h3 className="font-bold text-gray-800">{p.officialEmenta || p.summary}</h3>
                <p className="text-sm text-gray-600">Autor: {p.parliamentarian.name} | Sessão: #{p.session?.number}</p>
              </div>

              <form action={uploadPendingPdf} className="flex items-center gap-2">
                <input type="hidden" name="proposalId" value={p.id} />
                <input 
                  type="file" 
                  name="pdfFile" 
                  accept="application/pdf" 
                  required 
                  className="text-xs text-gray-500 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-600 file:text-white"
                />
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700"
                >
                  Enviar PDF
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}