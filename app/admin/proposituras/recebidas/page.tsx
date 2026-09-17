async function deleteProposal(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  await prisma.proposal.delete({ where: { id } })
  redirect('/admin/proposituras/recebidas')
}

// Dentro do seu loop de propostas recebidas, insira:
<form action={deleteProposal}>
  <input type="hidden" name="id" value={proposal.id} />
  <button 
    type="submit" 
    className="bg-red-50 text-red-600 px-3 py-1.5 rounded text-xs font-medium hover:bg-red-100"
    onClick={(e) => { if(!confirm('Deseja realmente excluir esta proposta recebida?')) e.preventDefault(); }}
  >
    Excluir Proposta
  </button>
</form>