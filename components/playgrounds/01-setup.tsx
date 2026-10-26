"use client";

import { useEffect, useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { Panel, PlaygroundCard } from "./card";

const checklist = ["Install Node.js", "Install Playwright", "Run the example test", "Open the HTML report"];

export default function SetupPlayground() {
  const bug = useLessonBugs("01-setup");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    document.title = bug(1) ? "Untitled" : "Setup · Playwright Gym";
  });

  return (
    <PlaygroundCard lessonId="01-setup" title="Welcome to Playwright Gym" intro="Your first test target: a title, a button, and a checklist.">
      <Panel title="Get moving">
        <button className="primary-button" type="button" onClick={() => !bug(2) && setStarted(true)}>Start training</button>
        <p className="result-panel" role="status">{started ? "Training started. Good luck!" : ""}</p>
      </Panel>
      <Panel title="Before you begin">
        <ul aria-label="Setup checklist" className="check-list">
          {(bug(3) ? checklist.slice(0, 3) : checklist).map((item) => <li key={item}>{item}</li>)}
        </ul>
      </Panel>
    </PlaygroundCard>
  );
}
