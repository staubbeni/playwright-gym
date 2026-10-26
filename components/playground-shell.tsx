"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { curriculumOrder, lessons } from "@/lib/lessons";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "user-settings": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

function SelectorsPlayground({ bug }: { bug: boolean }) {
  const [clicked, setClicked] = useState(false);

  return (
    <section className="playground-card" aria-labelledby="selectors-playground">
      <div className="card-heading">
        <div>
          <p className="eyebrow">Interactive DOM</p>
          <h2 id="selectors-playground">Button state</h2>
        </div>
        <span className="status-pill">{bug ? "Bug mode" : "Normal mode"}</span>
      </div>
      <p className="muted">
        The button id changes on every render. Use a stable, user-facing
        locator and assert the visible result.
      </p>
      <button
        className="primary-button"
        data-testid="selectors-action"
        id={`action-${bug ? "broken" : "ready"}`}
        onClick={() => {
          if (!bug) setClicked(true);
        }}
      >
        Complete action
      </button>
      <div className="result-panel" role="status" aria-live="polite">
        {clicked ? "Action completed successfully." : "Waiting for an action..."}
      </div>
    </section>
  );
}

function FormsPlayground({ bug }: { bug: boolean }) {
  const [email, setEmail] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="playground-card" aria-labelledby="forms-playground">
      <div className="card-heading">
        <div>
          <p className="eyebrow">Interactive DOM</p>
          <h2 id="forms-playground">Registration form</h2>
        </div>
        <span className="status-pill">{bug ? "Bug mode" : "Normal mode"}</span>
      </div>
      <form
        className="form-stack"
        onSubmit={(event) => {
          event.preventDefault();
          if (!bug && email.includes("@") && accepted) setSubmitted(true);
        }}
      >
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
        <label className="checkbox-row">
          <input
            type="checkbox"
            name="terms"
            checked={accepted}
            onChange={(event) => setAccepted(event.target.checked)}
          />
          I accept the terms
        </label>
        <button className="primary-button" type="submit">
          Create account
        </button>
      </form>
      <div className="result-panel" role="status" aria-live="polite">
        {submitted
          ? "Account created successfully."
          : "Complete the form to continue."}
      </div>
    </section>
  );
}

function LoadingPlayground({ bug }: { bug: boolean }) {
  const [loading, setLoading] = useState(false);

  return (
    <section className="playground-card" aria-labelledby="loading-playground">
      <div className="card-heading">
        <div>
          <p className="eyebrow">Interactive DOM</p>
          <h2 id="loading-playground">Async report</h2>
        </div>
        <span className="status-pill">{bug ? "Bug mode" : "Normal mode"}</span>
      </div>
      <p className="muted">
        The report takes a moment to load. The bugged version never completes.
      </p>
      <button
        className="primary-button"
        onClick={() => {
          setLoading(true);
          if (!bug) {
            window.setTimeout(() => setLoading(false), 800);
          }
        }}
      >
        Load report
      </button>
      <div className="result-panel" role="status" aria-live="polite">
        {loading ? (
          <span data-testid="report-result" role="status">Loading report...</span>
        ) : (
            <span data-testid="report-result">Report ready</span>
        )}
      </div>
    </section>
  );
}

function ToastPlayground({ bug }: { bug: boolean }) {
  const [saved, setSaved] = useState(false);

  return (
    <section className="playground-card" aria-labelledby="toast-playground">
      <div className="card-heading">
        <div>
          <p className="eyebrow">Interactive DOM</p>
          <h2 id="toast-playground">Preferences</h2>
        </div>
        <span className="status-pill">{bug ? "Bug mode" : "Normal mode"}</span>
      </div>
      <p className="muted">
        Save the preferences and observe the temporary confirmation message.
      </p>
      <button
        className="primary-button"
        onClick={() => {
          if (!bug) {
            setSaved(true);
            window.setTimeout(() => setSaved(false), 1800);
          }
        }}
      >
        Save preferences
      </button>
      {saved ? (
        <div className="toast" data-testid="preferences-toast" role="alert">
          Preferences saved.
        </div>
      ) : (
        <div className="result-panel">No notification yet.</div>
      )}
    </section>
  );
}

function NetworkPlayground({ bug }: { bug: boolean }) {
  const [profile, setProfile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <section className="playground-card" aria-labelledby="network-playground">
      <div className="card-heading">
        <div>
          <p className="eyebrow">Interactive DOM</p>
          <h2 id="network-playground">Profile API</h2>
        </div>
        <span className="status-pill">{bug ? "Bug mode" : "Normal mode"}</span>
      </div>
      <p className="muted">
        The profile request is ready for your test to intercept and control.
      </p>
      <button
        className="primary-button"
        onClick={async () => {
          setLoading(true);
          const response = await fetch("/api/profile");
          const data = (await response.json()) as { name: string };
          if (!bug) setProfile(data.name);
          setLoading(false);
        }}
      >
        Load profile
      </button>
      <div className="result-panel" aria-live="polite">
        {loading ? (
          "Loading profile..."
        ) : profile ? (
          <span data-testid="profile-name">{profile}</span>
        ) : (
          "No profile loaded."
        )}
      </div>
    </section>
  );
}

function ShadowPlayground({ bug }: { bug: boolean }) {
  const [savedName, setSavedName] = useState("No name saved.");
  const componentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!customElements.get("user-settings")) {
      class UserSettings extends HTMLElement {
        connectedCallback() {
          const root = this.attachShadow({ mode: "open" });
          root.innerHTML = `
            <style>
              form { display: grid; gap: 10px; font-family: Arial, sans-serif; }
              label { color: #c9d3e2; font-size: 13px; }
              input { background: #0b101a; border: 1px solid #26354d; border-radius: 8px; color: #e8eef8; padding: 10px; }
              button { background: #8b7cff; border: 0; border-radius: 8px; color: white; cursor: pointer; font-weight: 700; padding: 10px; }
            </style>
            <form>
              <label for="display-name">Display name</label>
              <input id="display-name" value="Ada" />
              <button type="submit">Save name</button>
            </form>
          `;
          root.querySelector("form")?.addEventListener("submit", (event) => {
            event.preventDefault();
            const input = root.querySelector("input");
            this.dispatchEvent(
              new CustomEvent("name-saved", { detail: input?.value ?? "" })
            );
          });
        }
      }
      customElements.define("user-settings", UserSettings);
    }
    const host = componentRef.current;
    const handleSave = (event: Event) => {
      if (!bug) setSavedName(String((event as CustomEvent<string>).detail));
    };
    host?.addEventListener("name-saved", handleSave);
    return () => host?.removeEventListener("name-saved", handleSave);
  }, [bug]);

  return (
    <section className="playground-card" aria-labelledby="shadow-playground">
      <div className="card-heading">
        <div>
          <p className="eyebrow">Interactive DOM</p>
          <h2 id="shadow-playground">User settings component</h2>
        </div>
        <span className="status-pill">{bug ? "Bug mode" : "Normal mode"}</span>
      </div>
      <p className="muted">
        This form is rendered inside an open shadow DOM custom element.
      </p>
      <user-settings ref={componentRef} />
      <div className="result-panel" data-testid="saved-name" role="status">
        {savedName}
      </div>
    </section>
  );
}

function IframePlayground({ bug }: { bug: boolean }) {
  return (
    <section className="playground-card" aria-labelledby="iframe-playground">
      <div className="card-heading"><div><p className="eyebrow">Interactive DOM</p><h2 id="iframe-playground">Embedded payment form</h2></div><span className="status-pill">{bug ? "Bug mode" : "Normal mode"}</span></div>
      <p className="muted">This form lives in a local iframe with its own document.</p>
      <iframe
        id="payment-frame"
        title="Payment form"
        className="demo-frame"
        srcDoc={`<!doctype html><html><body style="background:#121a29;color:#e8eef8;font-family:Arial;padding:16px"><form id="payment"><label for="card">Card number</label><input id="card" aria-label="Card number" style="display:block;margin:8px 0;padding:8px"><button type="submit">Pay now</button><div id="result" role="status" aria-live="polite" style="margin-top:12px">Ready for payment.</div></form><script>document.querySelector("form").addEventListener("submit",e=>{e.preventDefault();if(${!bug})document.querySelector("#result").textContent="Payment confirmed."})</script></body></html>`}
      />
    </section>
  );
}

function AuthPlayground({ bug }: { bug: boolean }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("student");
  const [password, setPassword] = useState("playwright");
  return (
    <section className="playground-card" aria-labelledby="auth-playground">
      <div className="card-heading"><div><p className="eyebrow">Interactive DOM</p><h2 id="auth-playground">Protected dashboard</h2></div><span className="status-pill">{bug ? "Bug mode" : "Normal mode"}</span></div>
      {!loggedIn ? (
        <form className="form-stack" onSubmit={(event) => { event.preventDefault(); if (!bug && username === "student" && password === "playwright") setLoggedIn(true); }}>
          <label htmlFor="username">Username</label><input id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
          <label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <button className="primary-button" type="submit">Sign in</button>
          <div className="result-panel" role="alert">Demo credentials: student / playwright</div>
        </form>
      ) : (
        <div className="result-panel" data-testid="dashboard"><h2>Dashboard</h2><p>Welcome back, student.</p></div>
      )}
    </section>
  );
}

function FoundationsPlayground({ lessonId, bug }: { lessonId: string; bug: boolean }) {
  const [active, setActive] = useState(false);
  const href = bug ? `/lessons/${lessonId}?bug=true` : "/lessons/10-navigation";
  return (
    <section className="playground-card" aria-labelledby="foundations-playground">
      <div className="card-heading"><div><p className="eyebrow">Interactive DOM</p><h2 id="foundations-playground">Practice area</h2></div><span className="status-pill">{bug ? "Bug mode" : "Normal mode"}</span></div>
      <p className="muted">Use the accessible controls and assert the user-visible result.</p>
      {lessonId === "10-navigation" ? (
        <Link className="primary-button" href={href}>Go to navigation lesson</Link>
      ) : lessonId === "12-assertions" ? (
        <label className="checkbox-row"><input type="checkbox" checked={active} onChange={(event) => !bug && setActive(event.target.checked)} /> Enable notifications</label>
      ) : (
        <button className="primary-button" onClick={() => !bug && setActive(true)}>{lessonId === "11-locator-strategy" ? "Reveal message" : "Complete action"}</button>
      )}
      <div className="result-panel" data-testid="foundation-result" role="status">
        {lessonId === "11-locator-strategy" ? (active ? "Message revealed." : "Message hidden.") :
          lessonId === "12-assertions" ? (active ? "Notifications enabled." : "Notifications disabled.") :
          active ? "Action completed successfully." : "Waiting for an action..."}
      </div>
    </section>
  );
}

function AdvancedPlayground({ lessonId, bug }: { lessonId: string; bug: boolean }) {
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    if (lessonId === "14-contexts") {
      setSaved(window.localStorage.getItem("gym-context-value") === "saved");
    }
  }, [lessonId]);

  const openPopup = () => {
    if (bug) return;
    const popup = window.open("", "_blank", "width=500,height=400");
    if (popup) {
      popup.document.write("<title>Popup confirmation</title><h1>Popup confirmation</h1><p>Payment window ready.</p>");
      popup.document.close();
    }
  };

  return (
    <section className="playground-card" aria-labelledby="advanced-playground">
      <div className="card-heading"><div><p className="eyebrow">Interactive DOM</p><h2 id="advanced-playground">Practice area</h2></div><span className="status-pill">{bug ? "Bug mode" : "Normal mode"}</span></div>
      <p className="muted">Use the lesson objective to choose the right Playwright tool.</p>
      {lessonId === "13-debugging" && (
        <>
          <button className="primary-button" onClick={() => !bug && setTimeout(() => setReady(true), 500)}>Run report</button>
          <div className="result-panel" role="status">{ready ? "Report ready." : "Report not ready."}</div>
        </>
      )}
      {lessonId === "14-contexts" && (
        <>
          <button className="primary-button" onClick={() => { if (!bug) { window.localStorage.setItem("gym-context-value", "saved"); setSaved(true); } }}>Save session value</button>
          <div className="result-panel" data-testid="context-result" role="status">{saved ? "Session value saved." : "No session value."}</div>
        </>
      )}
      {lessonId === "15-popups" && (
        <>
          <button className="primary-button" onClick={openPopup}>Open payment window</button>
          <div className="result-panel" role="status">Ready to open a new page.</div>
        </>
      )}
      {lessonId === "16-api-testing" && (
        <>
          <button className="primary-button" onClick={async () => { if (bug) return; const response = await fetch("/api/profile"); setApiMessage(response.ok ? "API request succeeded." : "API request failed."); }}>Check API health</button>
          <div className="result-panel" data-testid="api-result" role="status">{apiMessage || "No API request yet."}</div>
        </>
      )}
    </section>
  );
}

export function PlaygroundShell({ lessonId }: { lessonId: string }) {
  const bug = useSearchParams().get("bug") === "true";
  const lesson = lessons.find((item) => item.id === lessonId) ?? lessons[0];
  const orderedLessons = curriculumOrder
    .map((id) => lessons.find((item) => item.id === id))
    .filter((item): item is (typeof lessons)[number] => Boolean(item));
  const nextLesson = lesson.nextLessonId
    ? lessons.find((item) => item.id === lesson.nextLessonId)
    : undefined;
  const [showInstructions, setShowInstructions] = useState(true);
  const [drawerWidth, setDrawerWidth] = useState(430);
  const resizing = useRef(false);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!resizing.current) return;
      const minWidth = 320;
      const maxWidth = Math.min(720, window.innerWidth * 0.6);
      setDrawerWidth(
        Math.min(maxWidth, Math.max(minWidth, window.innerWidth - event.clientX))
      );
    };
    const stopResize = () => {
      resizing.current = false;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResize);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResize);
    };
  }, []);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">PG</span>
          <div>
            <strong>Playwright Gym</strong>
            <span>Learn by testing</span>
          </div>
        </div>
        <nav aria-label="Lessons">
          <p className="nav-label">Lessons</p>
          {Array.from(new Set(orderedLessons.map((item) => item.module))).map((module) => {
            const moduleLessons = orderedLessons.filter((item) => item.module === module);
            return (
              <div className="lesson-module" key={module}>
                <p className="module-label">{moduleLessons[0].moduleTitle}</p>
                {moduleLessons.map((item) => (
                  <Link
                    className={`lesson-link ${item.id === lesson.id ? "selected" : ""}`}
                    href={`/lessons/${item.id}${bug ? "?bug=true" : ""}`}
                    key={item.id}
                  >
                    <span className="lesson-number">{item.number}</span>
                    <span>
                      <strong>{item.title}</strong>
                      <small>{item.shortDescription}</small>
                    </span>
                  </Link>
                ))}
              </div>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <span className="pulse" />
          Playground ready
        </div>
      </aside>

      <section
        className="content"
        style={
          showInstructions
            ? { paddingRight: `calc(${drawerWidth}px + 3rem)` }
            : undefined
        }
      >
        <header className="page-header">
          <div>
            <p className="eyebrow">Lesson {lesson.number}</p>
            <h1>{lesson.title}</h1>
            <p className="subtitle">{lesson.description}</p>
          </div>
          <div className="header-actions">
            <Link
              className="bug-toggle"
              href={`/lessons/${lesson.id}${bug ? "" : "?bug=true"}`}
            >
              {bug ? "Open normal app" : "Open bug mode"}
            </Link>
            <button className="instructions-toggle" onClick={() => setShowInstructions((visible) => !visible)} type="button" aria-expanded={showInstructions} aria-controls="lesson-instructions">
              {showInstructions ? "Hide instructions" : "Show instructions"}
            </button>
          </div>
        </header>

        <section className="mission-banner" aria-labelledby="mission-heading">
          <p className="eyebrow" id="mission-heading">Your mission</p>
          <p>{lesson.mission}</p>
        </section>
        <div className="workspace">
          <div className="playground-column">
            {lesson.id === "01-selectors" && <SelectorsPlayground bug={bug} />}
            {lesson.id === "02-forms" && <FormsPlayground bug={bug} />}
            {lesson.id === "03-auto-waiting" && <LoadingPlayground bug={bug} />}
            {lesson.id === "04-toast" && <ToastPlayground bug={bug} />}
            {lesson.id === "05-network-mocking" && <NetworkPlayground bug={bug} />}
            {lesson.id === "06-shadow-dom" && <ShadowPlayground bug={bug} />}
            {lesson.id === "07-iframe" && <IframePlayground bug={bug} />}
            {lesson.id === "08-auth-storage" && <AuthPlayground bug={bug} />}
            {["09-test-anatomy", "10-navigation", "11-locator-strategy", "12-assertions"].includes(lesson.id) && <FoundationsPlayground lessonId={lesson.id} bug={bug} />}
            {["13-debugging", "14-contexts", "15-popups", "16-api-testing"].includes(lesson.id) && <AdvancedPlayground lessonId={lesson.id} bug={bug} />}
          </div>
          <aside
            className={`instructions-drawer ${showInstructions ? "open" : ""}`}
            id="lesson-instructions"
            aria-hidden={!showInstructions}
            style={{ width: `${drawerWidth}px` }}
          >
            <button
              className="drawer-resize-handle"
              onPointerDown={() => {
                resizing.current = true;
              }}
              type="button"
              aria-label="Resize lesson instructions"
            />
            <div className="drawer-header">
              <p className="eyebrow">Lesson guide</p>
            </div>
            <article className="instructions">
            <div className="instruction-section">
              <p className="eyebrow">What you&apos;ll learn</p>
              <ul className="goal-list">
                {lesson.learningGoals.map((goal) => <li key={goal}>{goal}</li>)}
              </ul>
            </div>
            {lesson.concepts && <div className="instruction-section"><p className="eyebrow">Key concepts</p><ul className="goal-list">{lesson.concepts.map((concept) => <li key={concept}>{concept}</li>)}</ul></div>}
            <div className="instruction-section">
              <p className="eyebrow">Short theory</p>
              <p>{lesson.theory}</p>
              <div className="example-grid">
                <div>
                  <span className="example-label good">Prefer</span>
                  <code>{lesson.goodExample}</code>
                </div>
                <div>
                  <span className="example-label avoid">Avoid</span>
                  <code>{lesson.badExample}</code>
                </div>
              </div>
            </div>
            {lesson.prerequisites && <div className="instruction-section"><p className="eyebrow">Before you start</p><ul className="goal-list">{lesson.prerequisites.map((item) => <li key={item}>{item}</li>)}</ul></div>}
            {lesson.guidedSteps && <div className="instruction-section"><p className="eyebrow">Guided steps</p><ol className="hint-list">{lesson.guidedSteps.map((item) => <li key={item}>{item}</li>)}</ol></div>}
            <div className="instruction-section">
              <p className="eyebrow">Hints</p>
              <ol className="hint-list">
                {lesson.hints.map((hint) => <li key={hint}>{hint}</li>)}
              </ol>
            </div>
            <div className="instruction-section expected">
              <p className="eyebrow">Expected assertion</p>
              <code>{lesson.expectedAssertion}</code>
            </div>
            <div className="instruction-section">
              {lesson.checkpoints && <><p className="eyebrow">Checkpoints</p><ul className="criteria-list">{lesson.checkpoints.map((item) => <li key={item}>{item}</li>)}</ul></>}
            </div>
            <div className="instruction-section">
              <p className="eyebrow">Success criteria</p>
              <ul className="criteria-list">
                {lesson.successCriteria.map((criterion) => (
                  <li key={criterion}>{criterion}</li>
                ))}
              </ul>
            </div>
            {lesson.resources && <div className="instruction-section"><p className="eyebrow">Read in the docs</p><ul className="resource-list">{lesson.resources.map((resource) => <li key={resource.url}><a href={resource.url} target="_blank" rel="noreferrer">{resource.label}</a></li>)}</ul></div>}
            {nextLesson && <div className="instruction-section next-lesson"><p className="eyebrow">Next step</p><Link href={`/lessons/${nextLesson.id}${bug ? "?bug=true" : ""}`}>Continue to lesson {nextLesson.number} →</Link></div>}
            </article>
          </aside>
        </div>
      </section>
    </main>
  );
}
