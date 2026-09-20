"use client";

import { useActionState } from "react";
import { LockKeyhole, LogIn } from "lucide-react";
import { loginAction } from "@/app/acceso/actions";
import { initialActionState } from "@/lib/action-state";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialActionState);

  return (
    <form action={formAction} className="login-form">
      <label className="field">
        <span>Correo del administrador</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label className="field">
        <span>Contraseña</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          minLength={6}
          required
        />
      </label>
      <button className="button button--primary button--wide" type="submit" disabled={pending}>
        {pending ? <LockKeyhole size={17} /> : <LogIn size={17} />}
        {pending ? "Comprobando…" : "Entrar al panel"}
      </button>
      {state.message ? (
        <p className={`form-notice form-notice--${state.status}`} role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
