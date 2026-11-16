"use client";

import { useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { PlaygroundCard } from "./card";

const regions = [
  { region: "North", revenue: "$12,400" },
  { region: "South", revenue: "$9,800" },
  { region: "West", revenue: "$15,100" }
];

export default function DebuggingPlayground() {
  const bug = useLessonBugs("25-debugging");
  const [status, setStatus] = useState("Report not generated.");
  const [rows, setRows] = useState<typeof regions>([]);

  const generate = () => {
    console.log("report:start");
    setStatus("Generating report...");
    if (bug("3.2")) window.setTimeout(() => { throw new Error("Cannot read properties of undefined (reading 'total')"); }, 100);
    window.setTimeout(() => {
      if (bug(1)) return;
      setRows(bug("2.1") ? regions.slice(0, 2) : regions.map((row) => (bug("2.2") && row.region === "West" ? { ...row, revenue: "$0" } : row)));
      if (bug("3.1")) console.error("Failed to render chart: data is undefined");
      setStatus("Report ready.");
      console.log("report:done");
    }, 600);
  };

  return (
    <PlaygroundCard lessonId="25-debugging" title="Sales report">
      <button className="primary-button" type="button" onClick={generate}>Generate report</button>
      <p className="result-panel" role="status">{status}</p>
      <table className="data-table" aria-label="Revenue by region">
        <thead>
          <tr><th scope="col">Region</th><th scope="col">Revenue</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.region}><td>{row.region}</td><td>{row.revenue}</td></tr>
          ))}
        </tbody>
      </table>
    </PlaygroundCard>
  );
}
