"use client";

import { useEffect, useState } from "react";

export default function SessionPreview() {
  const [seconds, setSeconds] = useState(240);
  const [listening, setListening] = useState(false);
  useEffect(() => {
    if (!listening || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [listening, seconds]);
  const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  return <div className="phone"><span>THYSELF</span><i className={`pulse${listening ? " isListening" : ""}`} /><p>{listening ? "Where do you notice that in your body?" : "A quieter place to begin."}</p><button type="button" onClick={() => setListening((value) => !value)}>{listening ? `Listening · ${time}` : "Begin listening"}</button></div>;
}
