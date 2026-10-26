"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { Panel, PlaygroundCard } from "./card";

const KEY = "gym-context-note";

function readNote(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export default function ContextsPlayground() {
  const bug = useLessonBugs("26-contexts");
  const leaks = bug(2);
  const [draft, setDraft] = useState("");
  // undefined while loading, null when there is no note.
  const [note, setNote] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const local = readNote();
    if (local !== null || !leaks) {
      setNote(local);
      return;
    }
    fetch("/api/context-note")
      .then((response) => response.json())
      .then((data: { note: string | null }) => setNote(data.note));
  }, [leaks]);

  const save = async () => {
    if (bug(1)) return;
    try {
      window.localStorage.setItem(KEY, draft);
    } catch {
      // Storage can be unavailable; the note still shows for this page view.
    }
    setNote(draft);
    await fetch("/api/context-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: draft })
    });
  };

  return (
    <PlaygroundCard lessonId="26-contexts" title="Notes in this browser" intro="Notes are stored in this browser's localStorage, so another context should never see them.">
      <Panel title="Note">
        <div className="inline-form">
          <label>
            Session note
            <input value={draft} onChange={(event) => setDraft(event.target.value)} />
          </label>
          <button className="primary-button" type="button" onClick={save}>Save note</button>
        </div>
        <p data-testid="saved-note">{note === undefined ? "Loading note..." : note ? `Saved note: ${note}` : "No saved note."}</p>
      </Panel>
      <Panel title="Two users">
        <p className="muted">Practice 3 uses the Gym Shop login: <Link href="/shop/account">/shop/account</Link>.</p>
      </Panel>
    </PlaygroundCard>
  );
}
