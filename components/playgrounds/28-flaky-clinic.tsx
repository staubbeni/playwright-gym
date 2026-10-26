"use client";

import { useEffect, useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { Panel, PlaygroundCard } from "./card";

const activities = ["Login", "Purchase", "Logout"];

// Delays and order are random on purpose: that's what makes naive tests flaky.
export default function FlakyClinicPlayground() {
  const bug = useLessonBugs("28-flaky-clinic");
  const dropPurchase = bug(2);
  const [score, setScore] = useState("Score: --");
  const [feed, setFeed] = useState<string[]>([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const shuffled = [...activities].sort(() => Math.random() - 0.5);
    setFeed(dropPurchase ? shuffled.filter((item) => item !== "Purchase") : shuffled);
  }, [dropPurchase]);

  return (
    <PlaygroundCard lessonId="28-flaky-clinic" title="Flaky app" intro="Every widget here has random timing or ordering.">
      <Panel title="Score">
        <button
          className="primary-button"
          type="button"
          onClick={() => {
            setScore("Score: --");
            window.setTimeout(() => setScore(bug(1) ? "Score: 0" : "Score: 42"), Math.random() * 600);
          }}
        >
          Fetch score
        </button>
        <p data-testid="score">{score}</p>
      </Panel>
      <Panel title="Recent activity">
        <ul aria-label="Recent activity">
          {feed.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </Panel>
      <Panel title="Sync">
        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            if (bug(3)) return;
            setToast("Synced.");
            window.setTimeout(() => setToast(""), 600 + Math.random() * 600);
          }}
        >
          Sync now
        </button>
        <div className="toast-region" role="region" aria-label="Notifications">
          {toast && <div className="toast" role="status">{toast}</div>}
        </div>
      </Panel>
    </PlaygroundCard>
  );
}
