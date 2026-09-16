// Será interceptado pelo middleware e redirecionado, 
// mas caso carregue, redireciona para login
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}
