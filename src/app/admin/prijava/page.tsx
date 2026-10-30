import Image from "next/image";
import { redirect } from "next/navigation";
import { isLoggedIn } from "@/lib/cms/auth";
import { LoginForm } from "./login-form";

export const metadata = { title: "Prijava" };

export default async function LoginPage() {
  if (await isLoggedIn()) redirect("/admin");
  return <div className="cms-login">
    <div className="cms-login-card">
      <Image src="/images/Tina-logo-cisti.png" width={72} height={72} alt="" />
      <h1>Uređivanje stranice</h1>
      <p>Upišite lozinku koju ste dobili od administratora.</p>
      <LoginForm />
    </div>
  </div>;
}
