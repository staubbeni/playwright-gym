"use client";

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
  const [user, setUser] = useState("");
  const [userDraft, setUserDraft] = useState("");
  const [mate, setMate] = useState("");
  const [roster, setRoster] = useState<string[]>([]);
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

  useEffect(() => {
    const cookie = document.cookie.split("; ").find((entry) => entry.startsWith("gym-user="));
    if (cookie) setUser(decodeURIComponent(cookie.slice(9)));
    else if (bug("3.2")) {
      fetch("/api/context-note").then((r) => r.json()).then((data: { user: string | null }) => setUser(data.user ?? ""));
    }
    fetch("/api/members").then((r) => r.json()).then((data: { members: string[] }) => setRoster(data.members));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async () => {
    document.cookie = `gym-user=${encodeURIComponent(userDraft)}; path=/`;
    setUser(userDraft);
    await fetch("/api/context-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: userDraft })
    });
  };

  const addMate = async () => {
    const name = mate.trim();
    if (!name) return;
    setMate("");
    if (bug("3.1")) {
      setRoster((list) => [...list, name]);
      return;
    }
    const response = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    setRoster(((await response.json()) as { members: string[] }).members);
  };

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
      <Panel title="Team roster (shared by everyone)">
        <p data-testid="whoami">{user ? `Signed in as ${user}` : "Not signed in"}</p>
        <div className="inline-form">
          <label>
            Your name
            <input value={userDraft} onChange={(event) => setUserDraft(event.target.value)} />
          </label>
          <button className="secondary-button" type="button" onClick={signIn}>Sign in</button>
        </div>
        <div className="inline-form">
          <label>
            Teammate
            <input value={mate} onChange={(event) => setMate(event.target.value)} />
          </label>
          <button className="primary-button" type="button" onClick={addMate}>Add teammate</button>
        </div>
        <ul aria-label="Roster">
          {roster.map((member, index) => <li key={`${member}-${index}`}>{member}</li>)}
        </ul>
      </Panel>
    </PlaygroundCard>
  );
}
