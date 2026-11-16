"use client";

import { useEffect, useRef, useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { Panel, PlaygroundCard } from "./card";

export default function AccessibilityPlayground() {
  const bug = useLessonBugs("23-accessibility");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [errors, setErrors] = useState({ email: "", message: "" });
  const emailRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const focusStays = bug("2.1");
  const focusLost = bug("2.2");

  useEffect(() => {
    if (dialogOpen && !focusStays) emailRef.current?.focus();
  }, [dialogOpen, focusStays]);

  const closeDialog = (viaEscape: boolean) => {
    setDialogOpen(false);
    if (!(viaEscape && focusLost)) triggerRef.current?.focus();
  };

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
        <button ref={triggerRef} className="secondary-button" type="button" onClick={() => setDialogOpen(true)}>Subscribe to newsletter</button>
        {dialogOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="newsletter-title"
            className="result-panel"
            onKeyDown={(event) => event.key === "Escape" && closeDialog(true)}
          >
            <h4 id="newsletter-title">Newsletter</h4>
            <label>
              Email
              <input ref={emailRef} type="email" />
            </label>
            <button className="secondary-button" type="button" onClick={() => closeDialog(false)}>Close</button>
          </div>
        )}
      </Panel>
      <Panel title="Contact us">
        <form
          className="form-stack"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            setErrors({
              email: contactEmail.trim() ? "" : "Contact email is required.",
              message: contactMessage.trim().length >= 10 ? "" : "Message must be at least 10 characters."
            });
          }}
        >
          <label htmlFor="contact-email">Contact email</label>
          <input
            id="contact-email"
            value={contactEmail}
            onChange={(event) => setContactEmail(event.target.value)}
            aria-invalid={errors.email && !bug("3.1") ? "true" : "false"}
            aria-describedby={errors.email && !bug("3.2") ? "contact-email-error" : undefined}
          />
          {errors.email && <p id="contact-email-error" className="error-text" role={bug("3.3") ? undefined : "alert"}>{errors.email}</p>}
          <label htmlFor="contact-message">Your message</label>
          <textarea
            id="contact-message"
            value={contactMessage}
            onChange={(event) => setContactMessage(event.target.value)}
            aria-invalid={errors.message && !bug("3.1") ? "true" : "false"}
            aria-describedby={errors.message && !bug("3.2") ? "contact-message-error" : undefined}
          />
          {errors.message && <p id="contact-message-error" className="error-text" role={bug("3.3") ? undefined : "alert"}>{errors.message}</p>}
          <button className="primary-button" type="submit">Send message</button>
        </form>
      </Panel>
    </PlaygroundCard>
  );
}
