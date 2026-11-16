"use client";

import { useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { PlaygroundCard } from "./card";

export default function TestAnatomyPlayground() {
  const bug = useLessonBugs("02-test-anatomy");
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState("Demo test not run yet.");

  const run = () => {
    setResult("Running demo test...");
    [1, 2, 3].forEach((next) => window.setTimeout(() => setStage(next), next * 200));
    window.setTimeout(() => setResult(bug("3.1") ? "Demo test failed." : "Demo test passed."), 700);
  };

  const step = (index: number, id: string, title: string, text: string) => (
    <div className={`result-panel stage ${stage >= index ? "done" : ""}`} data-testid={id}>
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );

  return (
    <PlaygroundCard lessonId="02-test-anatomy" title="Arrange, act, assert" intro="The three parts of a focused test, and a demo run that walks through them.">
      {step(1, "arrange-step", "Arrange", "Open the page and prepare the test fixture.")}
      {step(2, "act-step", "Act", bug(2) ? "Perform several unrelated actions." : "Perform one focused user action.")}
      {!bug(1) && step(3, "assert-step", "Assert", "Verify the outcome with a web-first assertion.")}
      <button className="primary-button" type="button" onClick={run}>Run demo test</button>
      <p className="result-panel" role="status" data-testid="demo-result">{result}</p>
      <p className="muted" data-testid="stage-count">Stages completed: {bug("3.2") ? Math.min(stage, 2) : stage} of 3</p>
    </PlaygroundCard>
  );
}
