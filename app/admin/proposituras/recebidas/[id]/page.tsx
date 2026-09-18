import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { writeFile } from 'fs/promises'
import path from 'path'
export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AnalisarPropostaPage({ params }: PageProps) {
  const { id } = await params

  const proposal = await prisma.proposal.findUnique({
    where: { id },
    include: { parliamentarian: true, session: true }
  })

  if (!proposal) redirect('/admin/proposituras/recebidas')

  const sessions = await prisma.session.findMany({
    orderBy: { number: 'desc' }
  })

  async function protocolarProposta(formData: FormData) {
    'use server'
    if (!proposal) return

    const sessionId = formData.get('sessionId') as string
    const officialEmenta = formData.get('officialEmenta') as string
    const pdfFile = formData.get('pdfFile') as File

    const typePrefixMap: Record<string, string> = {
      INDICACAO: 'IND',
      REQUERIMENTO: 'REQ',
      MOCAO: 'MO'
    }
    const prefix = typePrefixMap[proposal.type] || 'PROP'

    // Conta quantas propostas já foram protocoladas desse mesmo tipo para gerar o sequencial único
    const count = await prisma.proposal.count({
      where: { 
        type: proposal.type,
        status: 'PROTOCOLADA'
      }
    })
    const currentYear = new Date().getFullYear()
    const sequenceNumber = String(count + 1).padStart(3, '0')
    const protocolNumber = `${prefix}-${sequenceNumber}/${currentYear}`

    // 2. Lidar com o Upload do PDF (Compatível com ambiente Serverless / Vercel)
    let pdfUrl: string | null = null
    let pdfPending = true

    if (pdfFile && pdfFile.size > 0) {
      try {
        const bytes = await pdfFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const filename = `${protocolNumber.replace(/[/]/g, '-')}-${Date.now()}.pdf`
        const uploadDir = path.join(process.cwd(), 'public/uploads')
        
        // Tenta salvar no disco (funciona localmente)
        await writeFile(path.join(uploadDir, filename), buffer)
        pdfUrl = `/uploads/${filename}`
        pdfPending = false
      } catch (err) {
        console.warn("Aviso: Sistema de arquivos local restrito (Vercel). PDF marcado como pendente ou salvo em base64 se necessário.")
        pdfPending = true
      }
    }

    // 3. Atualizar no Banco de Dados
    await prisma.proposal.update({
      where: { id },
      data: {
        status: 'PROTOCOLADA',
        protocolNumber,
        officialEmenta,
        sessionId: sessionId || null,
        pdfUrl,
        pdfPending
      }
    })

    redirect('/admin/proposituras/cadastradas')
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Protocolar Propositura</h1>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-md space-y-2 text-sm text-gray-700">
        <p><strong>Autor:</strong> {proposal.parliamentarian.name}</p>
        <p><strong>Tipo:</strong> {proposal.type}</p>
        <p><strong>Resumo Original:</strong> {proposal.summary}</p>
      </div>

      <form action={protocolarProposta} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Sessão Plenária</label>
          <select name="sessionId" required className="mt-1 block w-full rounded-md border border-gray-300 p-2">
            <option value="">Selecione uma sessão...</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                Sessão #{s.number} - {s.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Ementa Oficial (Revisada pelo ADM)</label>
          <textarea 
            name="officialEmenta" 
            defaultValue={proposal.summary} 
            rows={3}
            required 
            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Arquivo PDF da Propositura (Opcional no protocolo)</label>
          <input 
            type="file" 
            name="pdfFile" 
            accept="application/pdf"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-1">Se não anexar agora, a propositura ficará marcada como &quot;PDF Pendente&quot;.</p>
        </div>

        <button 
          type="submit" 
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 font-medium"
        >
          Protocolar Propositura
        </button>
      </form>
    </div>
  )
}