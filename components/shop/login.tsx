"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function Login() {
  const router = useRouter();
  const next = useSearchParams().get("next") ?? "/shop/account";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/shop/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
      setError(((await response.json()) as { error: string }).error);
      return;
    }
    router.push(next.startsWith("/") && !next.startsWith("//") ? next : "/shop/account");
    router.refresh();
  };

  return (
    <section aria-labelledby="login-heading" className="narrow-card">
      <h1 id="login-heading">Sign in</h1>
      <form className="form-stack" onSubmit={submit}>
        <label htmlFor="login-username">Username</label>
        <input id="login-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} />
        <label htmlFor="login-password">Password</label>
        <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <button className="primary-button" type="submit">Sign in</button>
        {error && <p className="error-text" role="alert">{error}</p>}
        <p className="muted small">Demo credentials: student / playwright</p>
      </form>
    </section>
  );
}
