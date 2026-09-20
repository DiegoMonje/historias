"use client";

import { useActionState } from "react";
import { DatabaseZap } from "lucide-react";
import { importNativeStoriesAction } from "@/app/admin/actions";
import { initialActionState } from "@/lib/action-state";

export function ImportStoriesButton() {
  const [state, formAction, pending] = useActionState(
    importNativeStoriesAction,
    initialActionState,
  );

  return (
    <form action={formAction} className="import-stories">
      <button className="button button--admin" type="submit" disabled={pending}>
        <DatabaseZap size={17} />
        {pending ? "Importando…" : "Importar las seis historias"}
      </button>
      {state.message ? (
        <p className={`form-notice form-notice--${state.status}`} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
