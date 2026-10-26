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
          <button className="icon-button" type="button" aria-label="Open settings" onClick={() => !bug(2) && setSettingsOpen(true)}>
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
        <p data-testid="search-echo">Showing results for: {bug(3) ? "" : query}</p>
      </Panel>
    </PlaygroundCard>
  );
}
