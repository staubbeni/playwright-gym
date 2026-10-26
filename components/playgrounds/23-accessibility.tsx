"use client";

import { useEffect, useRef, useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { Panel, PlaygroundCard } from "./card";

export default function AccessibilityPlayground() {
  const bug = useLessonBugs("23-accessibility");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const focusBroken = bug(2);

  useEffect(() => {
    if (dialogOpen && !focusBroken) emailRef.current?.focus();
  }, [dialogOpen, focusBroken]);

  return (
    <PlaygroundCard lessonId="23-accessibility" title="Community site">
      <nav aria-label="Main" className="a11y-nav">
        <a href="#home">Home</a>
        <a href="#shop">Shop</a>
        {bug(1) ? (
          <a href="#account" className="icon-link">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="5" r="3" fill="currentColor" /><rect x="3" y="9" width="10" height="6" rx="3" fill="currentColor" /></svg>
          </a>
        ) : (
          <a href="#account">Account</a>
        )}
      </nav>
      <Panel title="Newsletter">
        <button className="secondary-button" type="button" onClick={() => setDialogOpen(true)}>Subscribe to newsletter</button>
        {dialogOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="newsletter-title"
            className="result-panel"
            onKeyDown={(event) => event.key === "Escape" && setDialogOpen(false)}
          >
            <h4 id="newsletter-title">Newsletter</h4>
            <label>
              Email
              <input ref={emailRef} type="email" />
            </label>
            <button className="secondary-button" type="button" onClick={() => setDialogOpen(false)}>Close</button>
          </div>
        )}
      </Panel>
      <Panel title="Contact us">
        <form
          className="form-stack"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            setError(contactEmail.trim() ? "" : "Contact email is required.");
          }}
        >
          <label htmlFor="contact-email">Contact email</label>
          <input
            id="contact-email"
            value={contactEmail}
            onChange={(event) => setContactEmail(event.target.value)}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error && !bug(3) ? "contact-email-error" : undefined}
          />
          {error && <p id="contact-email-error" className="error-text">{error}</p>}
          <button className="primary-button" type="submit">Send message</button>
        </form>
      </Panel>
    </PlaygroundCard>
  );
}
