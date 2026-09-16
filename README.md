# Parlamento Jovem Mococa - Sistema 2.0

Sistema completo para gestão de propostas e parlamentares do Parlamento Jovem de Mococa.

## Tecnologias
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- JWT Auth (`jose`)

## Instalação Local

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure o banco de dados:
   - Crie um banco PostgreSQL
   - Copie o `.env.example` para `.env` e preencha a `DATABASE_URL`

3. Rode as migrações do Prisma:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Crie o Administrador padrão:
   ```bash
   npm run seed
   ```
   **Credenciais padrão:**
   - Usuário: `admin`
   - Senha: `admin123`

5. Inicie o servidor:
   ```bash
   npm run dev
   ```

## Deploy na Vercel
- Conecte o repositório no Vercel
- Adicione as variáveis de ambiente (`DATABASE_URL`, `JWT_SECRET`) nas configurações da Vercel
- O comando de build já está configurado no `package.json` (`prisma generate && next build`)
