"use client";

import { useEffect, useRef, useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { Panel, PlaygroundCard } from "./card";

const commands = ["Catalog", "Cart", "Account"];

export default function KeyboardMousePlayground() {
  const bug = useLessonBugs("10-keyboard-mouse");
  const shortcutBroken = bug(1);
  const [shortcutsReady, setShortcutsReady] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [command, setCommand] = useState("");
  const [result, setResult] = useState("No command run yet.");
  const [tooltip, setTooltip] = useState(false);
  const [todo, setTodo] = useState(["Write tests", "Review PR"]);
  const [done, setDone] = useState(["Set up CI"]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && !shortcutBroken) {
        event.preventDefault();
        setPaletteOpen(true);
      }
      if (event.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    setShortcutsReady(true);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcutBroken]);

  useEffect(() => {
    if (paletteOpen) inputRef.current?.focus();
  }, [paletteOpen]);

  const drop = (event: React.DragEvent) => {
    event.preventDefault();
    const card = event.dataTransfer.getData("text/plain");
    if (bug(3) || !todo.includes(card)) return;
    setTodo(todo.filter((item) => item !== card));
    setDone([...done, card]);
  };

  return (
    <PlaygroundCard lessonId="10-keyboard-mouse" title="Power-user dashboard" intro="Press Ctrl+K (Cmd+K on macOS) to open the command palette.">
      <Panel title="Command palette">
        <p className="muted small">{shortcutsReady ? "Keyboard shortcuts ready" : "Loading shortcuts..."}</p>
        {paletteOpen && (
          <div role="dialog" aria-label="Command palette" className="result-panel">
            <label>
              Command
              <input
                ref={inputRef}
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return;
                  const match = commands.find((item) => item.toLowerCase().startsWith(command.trim().toLowerCase()));
                  setResult(match ? `Opened: ${match}` : "Unknown command.");
                  setPaletteOpen(false);
                  setCommand("");
                }}
              />
            </label>
            <p className="muted small">Try: {commands.join(", ")}</p>
          </div>
        )}
        <p data-testid="command-result">{result}</p>
      </Panel>
      <Panel title="Plans">
        <div className="plan-row">
          <strong>Pro plan</strong>
          <span className="tooltip-anchor">
            <button
              className="icon-button"
              type="button"
              aria-label="About the Pro plan"
              onMouseEnter={() => !bug(2) && setTooltip(true)}
              onMouseLeave={() => setTooltip(false)}
              onFocus={() => !bug(2) && setTooltip(true)}
              onBlur={() => setTooltip(false)}
            >
              ⓘ
            </button>
            {tooltip && <span role="tooltip" className="tooltip">Includes unlimited projects.</span>}
          </span>
        </div>
      </Panel>
      <Panel title="Board">
        <div className="kanban">
          {[["To do", todo], ["Done", done]].map(([name, items]) => (
            <div className="kanban-column" key={name as string} onDragOver={(event) => event.preventDefault()} onDrop={name === "Done" ? drop : undefined}>
              <h4>{name as string}</h4>
              <ul aria-label={name as string}>
                {(items as string[]).map((item) => (
                  <li key={item} draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", item)} className="kanban-card">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Panel>
    </PlaygroundCard>
  );
}
