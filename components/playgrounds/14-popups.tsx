"use client";

import { useEffect, useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { PlaygroundCard } from "./card";

export default function PopupsPlayground() {
  const bug = useLessonBugs("14-popups");
  const ignoreApproval = bug("2.1");
  const [status, setStatus] = useState("Payment not started.");

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.data?.type === "payment-approved" && !ignoreApproval) {
        setStatus("Payment approved.");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [ignoreApproval]);

  return (
    <PlaygroundCard lessonId="14-popups" title="Payment with a popup">
      <div className="button-row">
        <button
          className="primary-button"
          type="button"
          onClick={() => {
            if (bug(1)) return;
            window.open("/popup/payment", "payment", "width=480,height=420");
            setStatus("Waiting for approval...");
          }}
        >
          Open payment window
        </button>
        <a
          className="secondary-button"
          href={bug("3.1") ? "/popup/payment" : "/popup/terms"}
          target="_blank"
          rel="noopener"
          onClick={() => bug("3.2") && setStatus("Payment not started.")}
        >
          Read the terms
        </a>
      </div>
      <p className="result-panel" role="status">{status}</p>
    </PlaygroundCard>
  );
}
