"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions/auth";

export default function MotDePasseOubliePage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, null);

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display font-bold text-ink text-lg">
          DataLendo
        </Link>
        <h1 className="font-display font-bold text-2xl text-ink mt-6">
          Mot de passe oublié
        </h1>
        <p className="text-ink-soft text-sm mt-2">
          Indique ton email, on t&apos;envoie un lien pour en choisir un nouveau.
        </p>

        {state?.success ? (
          <p className="text-sm text-success bg-success-soft rounded-lg px-3 py-2.5 mt-8">
            {state.success}
          </p>
        ) : (
          <form action={formAction} className="mt-8 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink-soft">Email</span>
              <input
                name="email"
                type="email"
                required
                className="border border-line-strong rounded-lg px-3 py-2 text-sm text-ink bg-surface outline-none focus:border-accent"
              />
            </label>

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
              {pending ? "Envoi…" : "Envoyer le lien"}
            </button>
          </form>
        )}

        <p className="text-sm text-ink-faint mt-6">
          <Link href="/connexion" className="text-accent-ink font-medium">
            ← Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
