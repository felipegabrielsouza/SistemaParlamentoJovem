'use server'

import { prisma } from '@/lib/prisma'
import { createToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    redirect('/login?error=Preencha todos os campos.')
  }

  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) {
    redirect('/login?error=Usuario invalido.')
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    redirect('/login?error=Senha incorreta.')
  }

  const token = await createToken({ userId: user.id, role: user.role })
  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 86400,
    path: '/'
  })

  if (user.role === 'ADMIN') redirect('/admin')
  redirect('/parlamentar')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('token')
  redirect('/login')
}

export async function createParliamentarianAction(formData: FormData) {
  const name = (formData.get('fullName') || formData.get('name')) as string
  const school = formData.get('school') as string
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!name || !school || !username || !password) {
    redirect('/admin/parlamentares/novo?error=Preencha todos os campos obrigatorios.')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: 'PARLIAMENTARIAN',
        parliamentarian: {
          create: {
            name,
            school
          }
        }
      }
    })
  } catch (error) {
    redirect('/admin/parlamentares/novo?error=Erro ao cadastrar. O nome de usuario ja pode estar em uso.')
  }

  redirect('/admin/parlamentares?success=true')
}

export async function createSessionAction(formData: FormData) {
  const title = formData.get('title') as string
  const number = parseInt(formData.get('number') as string)
  const dateStr = formData.get('date') as string
  const description = formData.get('description') as string

  await prisma.session.create({
    data: {
      title,
      number,
      date: new Date(dateStr),
      description
    }
  })
  redirect('/admin/sessoes?success=true')
}

export async function createProposalAction(parliamentarianId: string, formData: FormData) {
  const type = formData.get('type') as string
  const title = formData.get('title') as string
  const summary = formData.get('summary') as string
  const content = formData.get('content') as string

  if (!type || !title || !summary || !content) {
    redirect('/parlamentar/nova-proposta?error=Todos os campos sao obrigatorios.')
  }

  try {
    await prisma.proposal.create({
      data: {
        parliamentarianId,
        type: type as any,
        title,
        summary,
        content,
        status: 'PENDENTE'
      }
    })
  } catch (error) {
    console.error('Erro ao criar proposta:', error)
    redirect('/parlamentar/nova-proposta?error=Erro ao salvar a proposta no banco de dados.')
  }
  
  redirect('/parlamentar/minhas-propostas?success=true')
}

export async function formalizeProposalAction(proposalId: string, formData: FormData) {
  const sessionId = formData.get('sessionId') as string
  const protocolNumber = formData.get('number') as string

  if (!sessionId || !protocolNumber) {
    redirect(`/admin/proposituras/recebidas/${proposalId}?error=Sessao e Numero sao obrigatorios.`)
  }

  try {
    await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        sessionId,
        protocolNumber,
        status: 'PROTOCOLADA'
      }
    })
  } catch (error) {
    redirect(`/admin/proposituras/recebidas/${proposalId}?error=Erro ao formalizar a propositura.`)
  }

  redirect('/admin/proposituras/cadastradas?success=true')
}