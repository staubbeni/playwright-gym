"use client";

import { useEffect, useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { Panel, PlaygroundCard } from "./card";

export default function ConfigCiPlayground() {
  const bug = useLessonBugs("27-config-ci");
  const offByOne = bug(1);
  const [viewport, setViewport] = useState("");
  const [status, setStatus] = useState("Unknown");
  const [name, setName] = useState("");
  const [members, setMembers] = useState<string[]>([]);

  useEffect(() => {
    const update = () => setViewport(`${window.innerWidth - (offByOne ? 1 : 0)} × ${window.innerHeight}`);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [offByOne]);

  useEffect(() => {
    fetch("/api/members").then((response) => response.json()).then((data: { members: string[] }) => setMembers(data.members));
  }, []);

  const refresh = async () => {
    setStatus("Checking...");
    const data = (await (await fetch("/api/status")).json()) as { status: string };
    setStatus(data.status);
  };

  const addMember = async () => {
    const response = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    setMembers(((await response.json()) as { members: string[] }).members ?? members);
    setName("");
  };

  return (
    <PlaygroundCard lessonId="27-config-ci" title="Environment & team">
      <Panel title="Environment">
        <p data-testid="viewport">Viewport: {viewport}</p>
      </Panel>
      <Panel title="Service status">
        <button className="secondary-button" type="button" onClick={refresh}>Refresh status</button>
        <p role="status" data-testid="service-status">{status}</p>
      </Panel>
      <Panel title="Team members (shared by everyone)">
        <div className="inline-form">
          <label>
            Member name
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <button className="primary-button" type="button" onClick={addMember}>Add member</button>
        </div>
        <ul aria-label="Members">
          {members.map((member, index) => <li key={`${member}-${index}`}>{bug("3.2") ? member.slice(0, 16) : member}</li>)}
        </ul>
      </Panel>
    </PlaygroundCard>
  );
}
