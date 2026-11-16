"use client";

import { useEffect, useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { PlaygroundCard } from "./card";

export default function VisualPlayground() {
  const bug = useLessonBugs("22-visual");
  const [now, setNow] = useState("");
  const [visitors, setVisitors] = useState(0);

  useEffect(() => {
    const tick = () => {
      setNow(new Date().toLocaleTimeString());
      setVisitors(100 + Math.floor(Math.random() * 900));
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <PlaygroundCard lessonId="22-visual" title="Pricing page">
      <div className={`dashboard-header ${bug(2) ? "shifted" : ""}`} data-testid="dashboard-header">
        <strong>Gym Cloud dashboard</strong>
        <span data-testid="live-stats" style={{ display: "inline-block", minWidth: 330, textAlign: "right" }}>Updated {now} · {visitors} visitors online</span>
      </div>
      <div className={`pricing-card ${bug(1) ? "off-brand" : ""}`} data-testid="pricing-card">
        <p className="eyebrow">Most popular</p>
        <h3>{bug(3) ? "Pro+" : "Pro"}</h3>
        <p className="pricing-amount">$12<span>/month</span></p>
        <ul>
          <li>Unlimited projects</li>
          <li>Trace history for 30 days</li>
          <li>Parallel workers</li>
        </ul>
        <button className="primary-button" type="button">Choose Pro</button>
      </div>
      <div className="spinner-row">
        <span className="spinner" aria-hidden="true" /> Syncing usage data
      </div>
    </PlaygroundCard>
  );
}
