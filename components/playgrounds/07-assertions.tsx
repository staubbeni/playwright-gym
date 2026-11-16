"use client";

import { useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { Panel, PlaygroundCard } from "./card";

export default function AssertionsPlayground() {
  const bug = useLessonBugs("07-assertions");
  const [notifications, setNotifications] = useState(false);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagMessage, setTagMessage] = useState("");

  return (
    <PlaygroundCard lessonId="07-assertions" title="Profile settings">
      <Panel title="Notifications">
        <label className="checkbox-row">
          <input type="checkbox" checked={notifications} onChange={(event) => !bug(1) && setNotifications(event.target.checked)} />
          Enable notifications
        </label>
        <p data-testid="notification-status">{notifications ? "Notifications enabled." : "Notifications disabled."}</p>
      </Panel>
      <Panel title="Profile">
        <div className="inline-form">
          <label>
            Display name
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <button className="primary-button" type="button" disabled={!bug(2) && !name.trim()} onClick={() => setSaved(name.trim())}>
            Save profile
          </button>
        </div>
        <p data-testid="profile-status">{saved ? `Profile saved for ${saved}.` : "Profile not saved."}</p>
      </Panel>
      <Panel title="Tags">
        <div className="inline-form">
          <label>
            New tag
            <input value={tag} onChange={(event) => setTag(event.target.value)} />
          </label>
          <button
            className="secondary-button"
            type="button"
            onClick={() => {
              const value = tag.trim();
              if (!value) return;
              setTag("");
              if (bug("3.1") && tags.length >= 2) return;
              if (!bug("3.2") && tags.includes(value)) {
                setTagMessage(`"${value}" already exists.`);
                return;
              }
              setTagMessage("");
              setTags([...tags, value]);
            }}
          >
            Add tag
          </button>
        </div>
        <ul aria-label="Tags" className="tag-list">
          {tags.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <p data-testid="tag-count">{bug("3.3") ? Math.max(0, tags.length - 1) : tags.length} tags</p>
        <p data-testid="tag-message" role="status">{tagMessage}</p>
      </Panel>
    </PlaygroundCard>
  );
}
