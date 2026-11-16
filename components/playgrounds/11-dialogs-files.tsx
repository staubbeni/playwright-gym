"use client";

import { useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { Panel, PlaygroundCard } from "./card";

const csv = "id,name,score\n1,Ada,98\n2,Grace,95\n";
const shortCsv = "id,name,score\n1,Ada,98\n";

export default function DialogsFilesPlayground() {
  const bug = useLessonBugs("11-dialogs-files");
  const [accountStatus, setAccountStatus] = useState("Account active.");
  const [upload, setUpload] = useState("No file selected.");
  const [imported, setImported] = useState("Nothing imported.");

  const exportCsv = () => {
    const url = URL.createObjectURL(new Blob([bug("3.2") ? shortCsv : csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = bug("3.1") ? "export.txt" : "report.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <PlaygroundCard lessonId="11-dialogs-files" title="Account tools">
      <Panel title="Danger zone">
        <button
          className="danger-button"
          type="button"
          onClick={() => {
            const accepted = window.confirm("Delete your account? This cannot be undone.");
            setAccountStatus(accepted && !bug(1) ? "Account deleted." : "Deletion cancelled.");
          }}
        >
          Delete account
        </button>
        <p data-testid="account-status">{accountStatus}</p>
      </Panel>
      <Panel title="Avatar">
        <label>
          Upload avatar
          <input
            type="file"
            
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file || bug("2.1")) return setUpload("No file selected.");
              if (!bug("2.2") && !file.type.startsWith("image/")) return setUpload("Only image files are allowed.");
              setUpload(`Uploaded ${file.name} (${file.size + (bug("2.3") ? 1 : 0)} bytes)`);
            }}
          />
        </label>
        <p data-testid="upload-status">{upload}</p>
      </Panel>
      <Panel title="Reports">
        <button className="secondary-button" type="button" onClick={exportCsv}>Export CSV</button>
        <label>
          Import CSV
          <input
            type="file"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const lines = (await file.text()).split("\n").filter(Boolean);
              setImported(`Imported ${lines.length - (bug("3.3") ? 0 : 1)} rows.`);
            }}
          />
        </label>
        <p data-testid="import-status">{imported}</p>
      </Panel>
    </PlaygroundCard>
  );
}
