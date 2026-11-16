"use client";

import { useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { Panel, PlaygroundCard } from "./card";

export default function SelectorsPlayground() {
  const bug = useLessonBugs("03-selectors");
  const [clicks, setClicks] = useState(0);
  const [done, setDone] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState("Nothing saved yet.");

  return (
    <PlaygroundCard lessonId="03-selectors" title="Toolbar" intro="The button id changes on every click. Find things the way a user would.">
      <Panel title="Actions">
        <div className="button-row">
          <button
            className="primary-button"
            id={`action-${clicks}-${bug.any ? "broken" : "ready"}`}
            type="button"
            onClick={() => {
              setClicks(clicks + 1);
              if (!bug(1)) setDone(true);
            }}
          >
            Complete action
          </button>
          <button className="secondary-button" type="button">Cancel</button>
          <button className="icon-button" type="button" aria-label="Open settings" onClick={() => !bug("2.1") && setSettingsOpen(true)}>
            ⚙
          </button>
        </div>
        <p className="result-panel" role="status">{done ? "Action completed successfully." : "Waiting for an action..."}</p>
        {settingsOpen && (
          <section className="result-panel" aria-label="Settings panel">
            Settings panel is open.
          </section>
        )}
      </Panel>
      <Panel title="Search">
        <input placeholder="Search lessons" value={query} onChange={(event) => setQuery(event.target.value)} />
        <p data-testid="search-echo">Showing results for: {bug("2.2") ? "" : query}</p>
      </Panel>
      <Panel title="Document">
        <div className="button-row">
          <button className="primary-button" type="button" onClick={() => setSaved(bug("3.1") ? "Saved as draft." : "Document saved.")}>
            Save
          </button>
          <button className="secondary-button" type="button" onClick={() => !bug("3.2") && setSaved("Saved as draft.")}>
            Save as draft
          </button>
        </div>
        <p className="result-panel" data-testid="save-result">{saved}</p>
      </Panel>
    </PlaygroundCard>
  );
}
