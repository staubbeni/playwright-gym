"use client";

import { useEffect, useRef, useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { Panel, PlaygroundCard } from "./card";

type Toast = { id: number; text: string; undo?: boolean; countdown?: number };

export default function ToastPlayground() {
  const bug = useLessonBugs("09-toast");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [draft, setDraft] = useState(true);
  const nextId = useRef(0);

  const push = (toast: Omit<Toast, "id">, lifetime: number) => {
    const id = (nextId.current += 1);
    setToasts((current) => [...current, { ...toast, id }]);
    // 1.2: the confirmation toast never closes
    if (!(bug("1.2") && toast.text === "Preferences saved.")) {
      window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), lifetime);
    }
    return id;
  };

  // The undo toast counts down once a second.
  useEffect(() => {
    if (!toasts.some((toast) => toast.countdown !== undefined)) return;
    const timer = window.setInterval(() => {
      setToasts((current) => current.map((toast) => (toast.countdown === undefined ? toast : { ...toast, countdown: Math.max(0, toast.countdown - 1) })));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [toasts]);

  const sendEmails = () => {
    const count = bug("2.1") ? 2 : 3;
    const numbers = Array.from({ length: count }, (_, index) => index + 1);
    (bug("2.2") ? [...numbers].reverse() : numbers).forEach((number, index) => {
      window.setTimeout(() => push({ text: `Email ${number} sent.` }, 3000), index * 300);
    });
  };

  return (
    <PlaygroundCard lessonId="09-toast" title="Preferences">
      <Panel title="Save">
        <button className="primary-button" type="button" onClick={() => !bug("1.1") && push({ text: "Preferences saved." }, 2000)}>
          Save preferences
        </button>
      </Panel>
      <Panel title="Outbox">
        <button className="secondary-button" type="button" onClick={sendEmails}>Send 3 emails</button>
      </Panel>
      <Panel title="Drafts">
        {draft ? <p className="result-panel">Draft: Weekly plan</p> : <p className="muted">No drafts.</p>}
        <button
          className="secondary-button"
          type="button"
          disabled={!draft}
          onClick={() => {
            setDraft(false);
            push({ text: "Draft deleted.", undo: true, countdown: 4 }, 4000);
          }}
        >
          Delete draft
        </button>
      </Panel>
      <div className="toast-region" role="region" aria-label="Notifications">
        {toasts.map((toast) => (
          <div className="toast" role="status" key={toast.id}>
            {toast.text}
            {toast.countdown !== undefined && <span> Undo in {toast.countdown}s</span>}
            {toast.undo && (
              <button
                className="link-button"
                type="button"
                onClick={() => {
                  if (!bug("3.1")) setDraft(true);
                  setToasts((current) => current.filter((item) => item.id !== toast.id));
                  if (!bug("3.2")) push({ text: "Draft restored." }, 2000);
                }}
              >
                Undo
              </button>
            )}
          </div>
        ))}
      </div>
    </PlaygroundCard>
  );
}
