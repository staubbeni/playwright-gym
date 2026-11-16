"use client";

import { useEffect, useState } from "react";
import { useLessonBugs } from "@/components/bug-provider";
import { Panel, PlaygroundCard } from "./card";

const gyms = [{ name: "Budapest Central", latitude: 47.4979, longitude: 19.0402 }];

export default function EmulationPlayground() {
  const bug = useLessonBugs("24-emulation-clock");
  const [greeting, setGreeting] = useState("");
  const [price, setPrice] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [nearest, setNearest] = useState("Location not requested.");
  const [menuOpen, setMenuOpen] = useState(false);
  const wrongGreeting = bug(1);
  const ignoreLocale = bug("2.1");
  const ignoreZone = bug("2.2");
  const [expired, setExpired] = useState(false);
  const [sessionRun, setSessionRun] = useState(0);
  const timeoutMinutes = bug("3.1") ? 10 : 15;

  useEffect(() => {
    const hour = new Date().getHours();
    if (wrongGreeting) setGreeting(hour < 12 ? "Good evening" : "Good morning");
    else setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
    const locale = navigator.language;
    setPrice(new Intl.NumberFormat(ignoreLocale ? "en-US" : locale, { style: "currency", currency: "EUR" }).format(1234.5));
    setEventTime(
      new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: ignoreZone ? "UTC" : undefined }).format(
        new Date("2026-06-01T12:00:00Z")
      )
    );
  }, [wrongGreeting, ignoreLocale, ignoreZone]);

  useEffect(() => {
    const timer = window.setTimeout(() => setExpired(true), timeoutMinutes * 60_000);
    return () => window.clearTimeout(timer);
  }, [timeoutMinutes, sessionRun]);

  const findGym = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const [latitude, longitude] = bug("3.3") ? [coords.longitude, coords.latitude] : [coords.latitude, coords.longitude];
        const gym = gyms.find((item) => Math.abs(item.latitude - latitude) < 0.5 && Math.abs(item.longitude - longitude) < 0.5);
        setNearest(gym ? `Nearest gym: ${gym.name}` : "No gym near you.");
      },
      () => setNearest("Location permission denied.")
    );
  };

  return (
    <PlaygroundCard lessonId="24-emulation-clock" title="Gym finder">
      {expired && (
        <div role="alert" className="result-panel">
          Session expired due to inactivity.{" "}
          <button
            className="secondary-button"
            type="button"
            onClick={() => {
              setExpired(false);
              if (!bug("3.2")) setSessionRun(sessionRun + 1);
            }}
          >
            Stay signed in
          </button>
        </div>
      )}
      <p className="muted">Sessions end after 15 minutes of inactivity.</p>
      <div className="responsive-nav">
        <nav aria-label="Site" className="desktop-nav">
          <a href="#classes">Classes</a> <a href="#trainers">Trainers</a> <a href="#prices">Prices</a>
        </nav>
        <button className="secondary-button mobile-only" type="button" onClick={() => setMenuOpen(!menuOpen)}>Open menu</button>
        {menuOpen && <p className="mobile-only">Classes · Trainers · Prices</p>}
      </div>
      <Panel title="Today">
        <p data-testid="greeting">{greeting}</p>
      </Panel>
      <Panel title="Membership">
        <p data-testid="price">{price}</p>
        <p data-testid="event-time">{eventTime}</p>
      </Panel>
      <Panel title="Location">
        <button className="primary-button" type="button" onClick={findGym}>Find nearest gym</button>
        <p data-testid="nearest-gym">{nearest}</p>
      </Panel>
    </PlaygroundCard>
  );
}
