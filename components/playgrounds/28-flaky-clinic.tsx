"use client";

import { useEffect, useRef, useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { Panel, PlaygroundCard } from "./card";

const activities = ["Login", "Purchase", "Logout"];
const exercises = ["Squat", "Deadlift", "Bench press", "Overhead press", "Barbell row"];

// Delays and order are random on purpose: that's what makes naive tests flaky.
export default function FlakyClinicPlayground() {
  const bug = useLessonBugs("28-flaky-clinic");
  const dropPurchase = bug(2);
  const [score, setScore] = useState("Score: --");
  const [feed, setFeed] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const [total, setTotal] = useState(0);
  const [counted, setCounted] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [searched, setSearched] = useState(false);
  const latest = useRef(0);

  const countUp = () => {
    const target = bug("4.1") ? 119 : 120;
    const duration = 300 + Math.random() * 600;
    const start = performance.now();
    setCounted("");
    const tick = () => {
      const progress = Math.min((performance.now() - start) / duration, 1);
      setTotal(Math.round(target * progress));
      if (progress < 1) requestAnimationFrame(tick);
      else if (!bug("4.2")) setCounted("Counting finished.");
    };
    requestAnimationFrame(tick);
  };

  // Responses arrive after a random delay, so a slow old request can land last.
  const search = (value: string) => {
    setQuery(value);
    const id = ++latest.current;
    const delay = bug("5.1") ? Math.max(700 - value.length * 120, 50) : 100 + Math.random() * 500;
    window.setTimeout(() => {
      if (id !== latest.current && !bug("5.1")) return;
      const found = value ? exercises.filter((name) => name.toLowerCase().includes(value.toLowerCase())) : [];
      setResults(found);
      setSearched(value !== "");
    }, delay);
  };

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
      <Panel title="Totals">
        <button className="secondary-button" type="button" onClick={countUp}>Count up</button>
        <p data-testid="total">Total: {total}</p>
        <p className="muted" data-testid="count-status">{counted}</p>
      </Panel>
      <Panel title="Exercise search">
        <label>
          Find exercise
          <input value={query} onChange={(event) => search(event.target.value)} />
        </label>
        <ul aria-label="Results">
          {results.map((name) => <li key={name}>{name}</li>)}
        </ul>
        {searched && results.length === 0 && !bug("5.2") && <p className="muted">No exercises found.</p>}
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
