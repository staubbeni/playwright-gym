"use client";

import { useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { Panel, PlaygroundCard } from "./card";

const csv = "id,name,score\n1,Ada,98\n2,Grace,95\n";

export default function DialogsFilesPlayground() {
  const bug = useLessonBugs("11-dialogs-files");
  const [accountStatus, setAccountStatus] = useState("Account active.");
  const [upload, setUpload] = useState("No file selected.");

  const exportCsv = () => {
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = bug(3) ? "export.txt" : "report.csv";
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
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              setUpload(file && !bug(2) ? `Uploaded ${file.name} (${file.size} bytes)` : "No file selected.");
            }}
          />
        </label>
        <p data-testid="upload-status">{upload}</p>
      </Panel>
      <Panel title="Reports">
        <button className="secondary-button" type="button" onClick={exportCsv}>Export CSV</button>
      </Panel>
    </PlaygroundCard>
  );
}
