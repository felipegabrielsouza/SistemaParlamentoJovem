'use server'

import { prisma } from '@/lib/db'
import { createToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) return { error: 'Preencha todos os campos.' }

  const user = await prisma.user.findUnique({ where: { username } })
  if (!user || !user.active) return { error: 'Usuário inválido ou inativo.' }

  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) return { error: 'Senha incorreta.' }

  const token = await createToken({ userId: user.id, role: user.role })
  cookies().set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 86400, path: '/' })

  if (user.role === 'ADMIN') redirect('/admin')
  redirect('/parlamentar')
}

export async function logoutAction() {
  cookies().delete('token')
  redirect('/login')
}

export async function createParliamentarianAction(formData: FormData) {
  const fullName = formData.get('fullName') as string
  const school = formData.get('school') as string
  const className = formData.get('className') as string
  const email = formData.get('email') as string
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  const passwordHash = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
      data: {
        username,
        email: email || null,
        passwordHash,
        role: 'PARLAMENTAR',
        parliamentarian: {
          create: {
            fullName,
            school,
            className
          }
        }
      }
    })
  } catch (error) {
    // Redireciona de volta para a tela de cadastro passando o erro via URL
    redirect('/admin/parlamentares/novo?error=Erro ao cadastrar. O nome de usuario ou e-mail ja pode estar em uso.')
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
  const subject = formData.get('subject') as string
  const summary = formData.get('summary') as string

  if (!type || !subject || !summary) return { error: 'Todos os campos são obrigatórios.' }

  await prisma.proposal.create({
    data: {
      parliamentarianId,
      type,
      subject,
      summary,
      status: 'Recebida'
    }
  })
  
  redirect('/parlamentar/minhas-propostas?success=true')
}
export async function formalizeProposalAction(proposalId: string, formData: FormData) {
  const sessionId = formData.get('sessionId') as string
  const number = formData.get('number') as string

  if (!sessionId || !number) {
    redirect(`/admin/proposituras/recebidas/${proposalId}?error=Sessao e Numero sao obrigatorios.`)
  }

  try {
    await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        sessionId,
        number,
        status: 'Cadastrada',
        formalizedAt: new Date()
      }
    })
  } catch (error) {
    redirect(`/admin/proposituras/recebidas/${proposalId}?error=Erro ao formalizar. O numero da propositura pode ja estar em uso.`)
  }

  redirect('/admin/proposituras/cadastradas?success=true')
}