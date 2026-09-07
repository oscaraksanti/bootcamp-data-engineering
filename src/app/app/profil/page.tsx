import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NameForm, PasswordForm } from "@/components/profile/ProfileForms";

export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  return (
    <main className="max-w-[560px] mx-auto w-full px-6 py-9">
      <h1 className="font-display font-bold text-2xl text-ink mb-1">Mon profil</h1>
      <p className="text-ink-soft text-sm mb-8">Gère les informations de ton compte.</p>

      <section className="mb-9">
        <h2 className="font-display font-bold text-sm text-ink mb-3">Email</h2>
        <p className="text-sm text-ink-soft border border-line rounded-lg px-3.5 py-2.5 bg-surface-2 max-w-sm">
          {user.email}
        </p>
      </section>

      <section className="mb-9">
        <h2 className="font-display font-bold text-sm text-ink mb-3">Nom</h2>
        <NameForm defaultName={profile?.full_name ?? ""} />
      </section>

      <section>
        <h2 className="font-display font-bold text-sm text-ink mb-3">Mot de passe</h2>
        <PasswordForm />
      </section>
    </main>
  );
}
