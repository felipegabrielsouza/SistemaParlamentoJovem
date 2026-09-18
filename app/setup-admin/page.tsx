import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default async function SetupAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('123456', 10)
    
    // Verifica se já existe um usuário cadastrado
    const existingUser = await prisma.user.findFirst()

    if (existingUser) {
      // Atualiza a senha do primeiro usuário encontrado
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword } as any
      })
    } else {
      // Cria um usuário novo enviando apenas a senha com type cast 'as any'
      await prisma.user.create({
        data: {
          password: hashedPassword,
        } as any
      })
    }

    return (
      <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
        <h1>Sucesso!</h1>
        <p>Senha do administrador atualizada com sucesso.</p>
        <p>Senha temporária: <b>123456</b></p>
      </div>
    )
  } catch (error: any) {
    return <div style={{ padding: 40, fontFamily: 'sans-serif' }}>Erro: {error.message}</div>
  }
}