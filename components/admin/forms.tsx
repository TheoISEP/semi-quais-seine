"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActionState } from "@/lib/actions/admin";

export const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-navy-dark focus:ring-2 focus:ring-navy-dark/20 disabled:bg-slate-50";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-1", className)}>
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

export function SubmitButton({
  children,
  className,
  variant = "primary",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-60",
        variant === "primary"
          ? "bg-navy-dark text-white hover:bg-navy-medium"
          : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
        className,
      )}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function ActionMessage({ state }: { state: ActionState }) {
  if (!state) return null;
  return (
    <p
      role="status"
      className={cn(
        "rounded-lg px-3 py-2 text-sm",
        state.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700",
      )}
    >
      {state.ok ? (state.message ?? "Enregistré.") : state.error}
    </p>
  );
}

/** Formulaire branché sur une server action (prev, formData) => ActionState. */
export function ActionForm({
  action,
  children,
  className,
  resetOnSuccess = false,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (resetOnSuccess && state?.ok) ref.current?.reset();
  }, [state, resetOnSuccess]);
  return (
    <form ref={ref} action={formAction} className={cn("space-y-3", className)}>
      {children}
      <ActionMessage state={state} />
    </form>
  );
}

/**
 * Bouton d'action avec confirmation en deux clics (pas de boîte de dialogue
 * native, pour rester pilotable au clavier et par les automatisations).
 */
export function ConfirmButton({
  action,
  children,
  confirmLabel = "Confirmer ?",
  className,
  variant = "danger",
}: {
  action: () => Promise<ActionState>;
  children: React.ReactNode;
  confirmLabel?: string;
  className?: string;
  variant?: "danger" | "primary" | "secondary";
}) {
  const [armed, setArmed] = useState(false);
  const [state, setState] = useState<ActionState>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(t);
  }, [armed]);

  function handleClick() {
    if (!armed) {
      setArmed(true);
      return;
    }
    setArmed(false);
    startTransition(async () => {
      const result = await action();
      setState(result);
      if (result?.ok) setTimeout(() => setState(null), 4000);
    });
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-60",
          armed
            ? "bg-amber-500 text-white hover:bg-amber-600"
            : variant === "danger"
              ? "border border-red-200 bg-white text-red-700 hover:bg-red-50"
              : variant === "primary"
                ? "bg-navy-dark text-white hover:bg-navy-medium"
                : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
          className,
        )}
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {armed ? confirmLabel : children}
      </button>
      {state && !state.ok && <span className="text-xs text-red-700">{state.error}</span>}
      {state?.ok && state.message && <span className="text-xs text-emerald-700">{state.message}</span>}
    </span>
  );
}
