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

    // 1. Número de Protocolo Contínuo
    const totalProtocoladas = await prisma.proposal.count({
      where: { status: 'PROTOCOLADA' }
    })
    const numeroProtocolo = totalProtocoladas + 1

    // 2. Número da Propositura por Tipo (ex: IND-1/2026, REQ-2/2026, MO-3/2026)
    const typePrefixMap: Record<string, string> = {
      INDICACAO: 'IND',
      REQUERIMENTO: 'REQ',
      MOCAO: 'MO',
      PROJETO_DE_LEI: 'PL'
    }
    const prefix = typePrefixMap[proposal.type] || 'PROP'

    const countMesmoTipo = await prisma.proposal.count({
      where: { 
        type: proposal.type,
        status: 'PROTOCOLADA'
      }
    })
    const sequencialTipo = countMesmoTipo + 1
    const codigoPropositura = `${prefix}-${sequencialTipo}/${currentYear}`

    // Formatamos o protocolNumber guardando ambos de forma limpa para exibição garantida
    // Exemplo armazenado: "PROT: 69 | COD: MO-4/2026"
    const protocolNumberString = `PROT: ${numeroProtocolo} | ${codigoPropositura}`

    let pdfUrl: string | null = null
    let pdfPending = true

    if (pdfFile && pdfFile.size > 0) {
      try {
        const bytes = await pdfFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const filename = `prot-${numeroProtocolo}-${Date.now()}.pdf`
        const uploadDir = path.join(process.cwd(), 'public/uploads')
        
        await writeFile(path.join(uploadDir, filename), buffer)
        pdfUrl = `/uploads/${filename}`
        pdfPending = false
      } catch (err) {
        console.warn("Aviso: Sistema de arquivos local restrito (Vercel).")
        pdfPending = true
      }
    }

    await prisma.proposal.update({
      where: { id },
      data: {
        status: 'PROTOCOLADA',
        protocolNumber: protocolNumberString,
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
          ℹ️ O sistema gerará automaticamente o número da propositura (ex: <strong>MO-4/2026</strong>) e o número de protocolo contínuo (ex: <strong>Protocolo nº 69</strong>).
        </div>

        <button 
          type="submit" 
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 font-medium"
        >
          Gerar Números e Protocolar
        </button>
      </form>
    </div>
  )
}