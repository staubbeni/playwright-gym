"use client";

import { useEffect, useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { Panel, PlaygroundCard } from "./card";

type Toast = { text: string; undo?: boolean; id: number };

export default function ToastPlayground() {
  const bug = useLessonBugs("09-toast");
  const [toast, setToast] = useState<Toast | null>(null);
  const [draft, setDraft] = useState(true);
  const sticky = bug(2);

  useEffect(() => {
    if (!toast || sticky) return;
    const timer = window.setTimeout(() => setToast(null), toast.undo ? 4000 : 2000);
    return () => window.clearTimeout(timer);
  }, [toast, sticky]);

  return (
    <PlaygroundCard lessonId="09-toast" title="Preferences">
      <Panel title="Save">
        <button className="primary-button" type="button" onClick={() => !bug(1) && setToast({ text: "Preferences saved.", id: Date.now() })}>
          Save preferences
        </button>
      </Panel>
      <Panel title="Drafts">
        {draft ? <p className="result-panel">Draft: Weekly plan</p> : <p className="muted">No drafts.</p>}
        <button
          className="secondary-button"
          type="button"
          disabled={!draft}
          onClick={() => {
            setDraft(false);
            setToast({ text: "Draft deleted.", undo: true, id: Date.now() });
          }}
        >
          Delete draft
        </button>
      </Panel>
      <div className="toast-region" role="region" aria-label="Notifications">
        {toast && (
          <div className="toast" role="status" key={toast.id}>
            {toast.text}
            {toast.undo && (
              <button
                className="link-button"
                type="button"
                onClick={() => {
                  if (!bug(3)) setDraft(true);
                  setToast({ text: "Draft restored.", id: Date.now() });
                }}
              >
                Undo
              </button>
            )}
          </div>
        )}
      </div>
    </PlaygroundCard>
  );
}
