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
    const currentYear = new Date().getFullYear()

    // 1. GERAÇÃO AUTOMÁTICA DO NÚMERO DE PROTOCOLO (Contínuo geral)
    // Conta quantas propostas já foram protocoladas no total para definir o próximo número de protocolo
    const totalProtocoladas = await prisma.proposal.count({
      where: { status: 'PROTOCOLADA' }
    })
    const protocolNumber = String(totalProtocoladas + 1) // Ex: "58"

    // 2. GERAÇÃO AUTOMÁTICA DO NÚMERO DA PROPOSITURA (Sequencial por tipo no ano)
    // Conta quantas propostas do MESMO TIPO já foram protocoladas
    const countMesmoTipo = await prisma.proposal.count({
      where: { 
        type: proposal.type,
        status: 'PROTOCOLADA'
      }
    })
    const sequencialTipo = countMesmoTipo + 1
    const proposalNumber = `${sequencialTipo}/${currentYear}` // Ex: "14/2026"

    // 3. Lidar com o Upload do PDF
    let pdfUrl: string | null = null
    let pdfPending = true

    if (pdfFile && pdfFile.size > 0) {
      try {
        const bytes = await pdfFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const filename = `prot-${protocolNumber}-${Date.now()}.pdf`
        const uploadDir = path.join(process.cwd(), 'public/uploads')
        
        await writeFile(path.join(uploadDir, filename), buffer)
        pdfUrl = `/uploads/${filename}`
        pdfPending = false
      } catch (err) {
        console.warn("Aviso: Sistema de arquivos local restrito (Vercel).")
        pdfPending = true
      }
    }

    // 4. Atualizar no Banco de Dados
    // Salvando o protocolo no campo protocolNumber e o número da propositura se houver coluna correspondente, 
    // ou formatando ambos de acordo com a estrutura do seu schema.
    await prisma.proposal.update({
      where: { id },
      data: {
        status: 'PROTOCOLADA',
        protocolNumber: protocolNumber, // Número do Protocolo (ex: "58")
        // Se a sua coluna principal guarda o formato final, você pode concatenar ou salvar separado:
        // Exemplo: se protocolNumber guarda o protocolo e o officialEmenta ou outro campo guarda a numeração:
        officialEmenta: `[Propositura nº ${proposalNumber}] - ${officialEmenta}`,
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
          <select name="sessionId" required className="mt-1 block w-full rounded-md border border-gray-300 p-2 bg-white">
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
          <label className="block text-sm font-medium text-gray-700">Arquivo PDF da Propositura (Opcional)</label>
          <input 
            type="file" 
            name="pdfFile" 
            accept="application/pdf"
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="p-4 bg-blue-50 text-blue-800 rounded-md text-sm">
          ℹ️ O sistema gerará automaticamente o <strong>Número de Protocolo contínuo</strong> e o <strong>Número Sequencial da Propositura</strong> para este tipo no ano atual.
        </div>

        <button 
          type="submit" 
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 font-medium"
        >
          Gerar Protocolo e Oficializar Propositura
        </button>
      </form>
    </div>
  )
}