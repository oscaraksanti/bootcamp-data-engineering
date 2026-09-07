"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { updatePassword } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";

type SessionState = "checking" | "ready" | "invalid";

export default function ReinitialiserMotDePassePage() {
  const [sessionState, setSessionState] = useState<SessionState>("checking");
  const [state, formAction, pending] = useActionState(updatePassword, null);

  useEffect(() => {
    // Le lien envoyé par email redirige ici avec les jetons dans le
    // fragment d'URL (#access_token=...&refresh_token=...) — jamais envoyé
    // au serveur, donc c'est le client qui doit établir la session.
    async function establishSession() {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");

      if (!accessToken || !refreshToken) {
        setSessionState("invalid");
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      window.history.replaceState(null, "", window.location.pathname);
      setSessionState(error ? "invalid" : "ready");
    }

    establishSession();
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display font-bold text-ink text-lg">
          DataLendo
        </Link>
        <h1 className="font-display font-bold text-2xl text-ink mt-6">
          Choisis un nouveau mot de passe
        </h1>

        {sessionState === "checking" && (
          <p className="text-sm text-ink-faint mt-8">Vérification du lien…</p>
        )}

        {sessionState === "invalid" && (
          <div className="mt-8">
            <p className="text-sm text-danger bg-danger-soft rounded-lg px-3 py-2.5">
              Ce lien a expiré ou n&apos;est plus valide.
            </p>
            <Link href="/mot-de-passe-oublie" className="text-sm text-accent-ink font-medium mt-4 inline-block">
              Redemander un email de réinitialisation
            </Link>
          </div>
        )}

        {sessionState === "ready" && (
          <form action={formAction} className="mt-8 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink-soft">Nouveau mot de passe</span>
              <input
                name="password"
                type="password"
                required
                className="border border-line-strong rounded-lg px-3 py-2 text-sm text-ink bg-surface outline-none focus:border-accent"
              />
            </label>
            <p className="text-xs text-ink-faint -mt-2">Au moins 8 caractères.</p>

            {state?.error && (
              <p className="text-sm text-danger bg-danger-soft rounded-lg px-3 py-2">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-2 bg-accent hover:bg-accent-strong disabled:opacity-60 text-white font-semibold text-sm rounded-lg py-2.5 transition-colors"
            >
              {pending ? "Enregistrement…" : "Enregistrer le nouveau mot de passe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
