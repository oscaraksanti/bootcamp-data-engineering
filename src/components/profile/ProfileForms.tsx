"use client";

import { useActionState } from "react";
import { updateFullName, changePassword } from "@/lib/actions/profile";

export function NameForm({ defaultName }: { defaultName: string }) {
  const [state, formAction, pending] = useActionState(updateFullName, null);

  return (
    <form action={formAction} className="flex flex-col gap-3 max-w-sm">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-ink-soft">Nom complet</span>
        <input
          name="fullName"
          defaultValue={defaultName}
          required
          className="border border-line-strong rounded-lg px-3 py-2 text-sm text-ink bg-surface outline-none focus:border-accent"
        />
      </label>

      {state?.error && (
        <p className="text-sm text-danger bg-danger-soft rounded-lg px-3 py-2">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-success bg-success-soft rounded-lg px-3 py-2">{state.success}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start bg-accent hover:bg-accent-strong disabled:opacity-60 text-white font-semibold text-sm rounded-lg px-4 py-2 transition-colors"
      >
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, null);

  return (
    <form action={formAction} className="flex flex-col gap-3 max-w-sm" key={state?.success ? "reset" : "form"}>
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
        <p className="text-sm text-danger bg-danger-soft rounded-lg px-3 py-2">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-sm text-success bg-success-soft rounded-lg px-3 py-2">{state.success}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start bg-accent hover:bg-accent-strong disabled:opacity-60 text-white font-semibold text-sm rounded-lg px-4 py-2 transition-colors"
      >
        {pending ? "Changement…" : "Changer le mot de passe"}
      </button>
    </form>
  );
}
