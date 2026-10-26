"use client";

import { useEffect, useRef, useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { PlaygroundCard } from "./card";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "user-settings": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { "stale-initials"?: string };
    }
  }
}

function defineElements() {
  if (customElements.get("user-settings")) return;

  class AvatarBadge extends HTMLElement {
    static observedAttributes = ["name"];
    connectedCallback() {
      if (!this.shadowRoot) {
        this.attachShadow({ mode: "open" }).innerHTML =
          `<style>span{display:inline-grid;place-items:center;width:40px;height:40px;border-radius:50%;background:#8b7cff;color:#fff;font:700 14px Arial}</style><span role="img" aria-label="Avatar"></span>`;
      }
      this.render();
    }
    attributeChangedCallback() {
      this.render();
    }
    render() {
      const target = this.shadowRoot?.querySelector("span");
      if (!target) return;
      const initials = (this.getAttribute("name") ?? "")
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part[0].toUpperCase())
        .join("");
      target.textContent = initials;
      target.setAttribute("aria-label", "Avatar");
      target.setAttribute("title", initials);
    }
  }

  class UserSettings extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({ mode: "open" });
      root.innerHTML = `
        <style>
          form { display: grid; gap: 10px; font-family: Arial, sans-serif; }
          label { color: #c9d3e2; font-size: 13px; display: grid; gap: 4px; }
          input, select { background: #0b101a; border: 1px solid #26354d; border-radius: 8px; color: #e8eef8; padding: 10px; }
          button { background: #8b7cff; border: 0; border-radius: 8px; color: white; cursor: pointer; font-weight: 700; padding: 10px; }
          .row { display: flex; gap: 12px; align-items: center; }
        </style>
        <form>
          <div class="row"><avatar-badge name="Ada"></avatar-badge><strong>Profile</strong></div>
          <label>Display name <input name="display-name" value="Ada" /></label>
          <label>Theme
            <select name="theme"><option value="light">Light</option><option value="dark">Dark</option></select>
          </label>
          <button type="submit">Save settings</button>
        </form>`;
      root.querySelector("form")?.addEventListener("submit", (event) => {
        event.preventDefault();
        const name = (root.querySelector("input") as HTMLInputElement).value;
        const theme = (root.querySelector("select") as HTMLSelectElement).value;
        if (!this.hasAttribute("stale-initials")) root.querySelector("avatar-badge")?.setAttribute("name", name);
        this.dispatchEvent(new CustomEvent("settings-saved", { detail: { name, theme } }));
      });
    }
  }

  customElements.define("avatar-badge", AvatarBadge);
  customElements.define("user-settings", UserSettings);
}

export default function ShadowDomPlayground() {
  const bug = useLessonBugs("13-shadow-dom");
  const nameBroken = bug(1);
  const themeBroken = bug(2);
  const [savedName, setSavedName] = useState("Ada");
  const [savedTheme, setSavedTheme] = useState("light");
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    defineElements();
    const host = ref.current;
    const onSave = (event: Event) => {
      const { name, theme } = (event as CustomEvent<{ name: string; theme: string }>).detail;
      if (!nameBroken) setSavedName(name);
      if (!themeBroken) setSavedTheme(theme);
    };
    host?.addEventListener("settings-saved", onSave);
    return () => host?.removeEventListener("settings-saved", onSave);
  }, [nameBroken, themeBroken]);

  return (
    <PlaygroundCard lessonId="13-shadow-dom" title="User settings component" intro="The form below is a web component. Its inputs and the avatar live in shadow roots.">
      <user-settings ref={ref} {...(bug(3) ? { "stale-initials": "" } : {})} />
      <p className="result-panel" data-testid="saved-name">Saved name: {savedName}</p>
      <p className="result-panel" data-testid="saved-theme">Saved theme: {savedTheme}</p>
    </PlaygroundCard>
  );
}
