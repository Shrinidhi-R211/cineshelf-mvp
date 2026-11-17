import { useState } from "react";

function AuthDialog({ mode, onClose, onSwitch, onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isRegister = mode === "register";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await onSubmit({ name, email, password });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="dialog-scrim" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="icon-button dialog-close" type="button" onClick={onClose} aria-label="Close">×</button>
        <span className="dialog-kicker">CINESHELF ACCOUNT</span>
        <h2 id="auth-title">{isRegister ? "Create your account" : "Welcome back"}</h2>
        <p>{isRegister ? "Save the movies you want to watch next." : "Sign in to open your personal list."}</p>
        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <label>
              Name
              <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required maxLength={60} />
            </label>
          )}
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={isRegister ? "new-password" : "current-password"} minLength={isRegister ? 8 : undefined} required />
          </label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <button className="button button-primary auth-submit" type="submit" disabled={busy}>
            {busy ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
          </button>
        </form>
        <div className="auth-switch">
          {isRegister ? "Already have an account?" : "New to CineShelf?"}
          <button type="button" onClick={() => onSwitch(isRegister ? "login" : "register")}>
            {isRegister ? "Sign in" : "Create an account"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default AuthDialog;
