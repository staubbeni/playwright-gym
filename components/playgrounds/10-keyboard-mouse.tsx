"use client";

import { useEffect, useRef, useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { Panel, PlaygroundCard } from "./card";

const commands = ["Catalog", "Cart", "Account"];

export default function KeyboardMousePlayground() {
  const bug = useLessonBugs("10-keyboard-mouse");
  const shortcutBroken = bug(1);
  const escapeKeepsTooltip = bug("2.3");
  const [shortcutsReady, setShortcutsReady] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [command, setCommand] = useState("");
  const [result, setResult] = useState("No command run yet.");
  const [tooltip, setTooltip] = useState(false);
  const columns = ["To do", "In review", "Done"];
  const [moveCard, setMoveCard] = useState("Write tests");
  const [moveTarget, setMoveTarget] = useState("In review");
  const [board, setBoard] = useState<Record<string, string[]>>({ "To do": ["Write tests", "Review PR"], "In review": [], Done: ["Set up CI"] });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && !shortcutBroken) {
        event.preventDefault();
        setPaletteOpen(true);
      }
      if (event.key === "Escape") {
        setPaletteOpen(false);
        if (!escapeKeepsTooltip) setTooltip(false);
      }
    };
    window.addEventListener("keydown", onKey);
    setShortcutsReady(true);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcutBroken, escapeKeepsTooltip]);

  useEffect(() => {
    if (paletteOpen) inputRef.current?.focus();
  }, [paletteOpen]);

  const move = (card: string, target: string) => {
    const source = columns.find((name) => board[name].includes(card));
    if (!source || source === target) return;
    if (bug("3.1") && target === "Done") return;
    // Cards only move forward, unless 3.3 lets them travel back.
    if (!bug("3.3") && columns.indexOf(target) < columns.indexOf(source)) return;
    setBoard({
      ...board,
      [source]: bug("3.2") ? board[source] : board[source].filter((item) => item !== card),
      [target]: [...board[target], card]
    });
  };

  const drop = (target: string) => (event: React.DragEvent) => {
    event.preventDefault();
    move(event.dataTransfer.getData("text/plain"), target);
  };

  return (
    <PlaygroundCard lessonId="10-keyboard-mouse" title="Power-user dashboard" intro="Press Ctrl+K (Cmd+K on macOS) to open the command palette.">
      <Panel title="Board">
        <div className="kanban">
          {columns.map((name) => (
            <div className="kanban-column" key={name} onDragOver={(event) => event.preventDefault()} onDrop={drop(name)}>
              <h4>{name}</h4>
              <ul aria-label={name} style={{ minHeight: 48 }}>
                {board[name].map((item) => (
                  <li key={item} draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", item)} className="kanban-card">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <form
          className="inline-form"
          onSubmit={(event) => {
            event.preventDefault();
            move(moveCard, moveTarget);
          }}
        >
          <label>
            Card
            <select value={moveCard} onChange={(event) => setMoveCard(event.target.value)}>
              {columns.flatMap((name) => board[name]).map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            Move to
            <select value={moveTarget} onChange={(event) => setMoveTarget(event.target.value)}>
              {columns.map((column) => <option key={column}>{column}</option>)}
            </select>
          </label>
          <button className="secondary-button" type="submit">Move card</button>
        </form>
      </Panel>
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
              onMouseEnter={() => !bug("2.1") && setTooltip(true)}
              onMouseLeave={() => !bug("2.2") && setTooltip(false)}
              onFocus={() => !bug("2.1") && setTooltip(true)}
              onBlur={() => setTooltip(false)}
            >
              ⓘ
            </button>
            {tooltip && <span role="tooltip" className="tooltip">Includes unlimited projects.</span>}
          </span>
        </div>
      </Panel>
    </PlaygroundCard>
  );
}
