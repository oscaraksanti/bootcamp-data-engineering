"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp } from "@/lib/actions/auth";

export default function InscriptionPage() {
  const [state, formAction, pending] = useActionState(signUp, null);

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display font-bold text-ink text-lg">
          DataLendo
        </Link>
        <h1 className="font-display font-bold text-2xl text-ink mt-6">
          Commence le Module 01 gratuitement
        </h1>
        <p className="text-ink-soft text-sm mt-2">
          Aucune carte bancaire nécessaire pour le premier module.
        </p>

        <form action={formAction} className="mt-8 flex flex-col gap-4">
          <Field label="Nom complet" name="fullName" type="text" required />
          <Field label="Email" name="email" type="email" required />
          <Field label="Mot de passe" name="password" type="password" required />
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
            {pending ? "Création du compte…" : "Créer mon compte"}
          </button>
        </form>

        <p className="text-sm text-ink-faint mt-6">
          Déjà inscrit·e ?{" "}
          <Link href="/connexion" className="text-accent-ink font-medium">
            Connecte-toi
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  required,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-ink-soft">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="border border-line-strong rounded-lg px-3 py-2 text-sm text-ink bg-surface outline-none focus:border-accent"
      />
    </label>
  );
}
