"use client";

import { useEffect, useRef, useState } from "react";
import { artist, type Track } from "../../lib/artist-config";
import { track as trackEvent } from "../../lib/analytics";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  const remain = whole % 60;
  return `${minutes}:${String(remain).padStart(2, "0")}`;
}

export function MusicPlayer() {
  const playable = artist.tracks.find((item) => item.src.length > 0) ?? null;
  if (!playable) return <EmptyMusic />;
  return <ActivePlayer track={playable} />;
}

function EmptyMusic() {
  const releaseCopy =
    artist.releases.length === 0
      ? "No release metadata has been added."
      : artist.releases
          .map((release) => [release.title, release.year, release.note].filter(Boolean).join(" · "))
          .join(" ");

  return (
    <section className="rd-player" aria-label="Featured music">
      <p className="rd-kicker">Featured music</p>
      <p className="rd-note">{releaseCopy} No licensed audio file is attached, so playback stays off.</p>
      <div className="rd-transport">
        <button type="button" disabled>
          Play
        </button>
        <label>
          Seek
          <input type="range" min={0} max={1} defaultValue={0} disabled aria-label="Seek, unavailable until audio is added" />
        </label>
        <label>
          Volume
          <input type="range" min={0} max={1} step={0.01} defaultValue={0.8} disabled aria-label="Volume, unavailable until audio is added" />
        </label>
      </div>
    </section>
  );
}

function ActivePlayer({ track }: { track: Track }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragging = useRef(false);
  const graph = useRef<{ context: AudioContext; analyser: AnalyserNode } | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [audioError, setAudioError] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      if (!dragging.current) setTime(audio.currentTime);
    };
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => setPlaying(false);
    const onError = () => setAudioError("This audio file could not be played.");
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("error", onError);
    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("error", onError);
      void graph.current?.context.close();
      graph.current = null;
    };
  }, [track.src]);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const draw = () => {
      const canvas = canvasRef.current;
      const analyser = graph.current?.analyser;
      const context = canvas?.getContext("2d");
      if (canvas && analyser && context) {
        const bins = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(bins);
        context.clearRect(0, 0, canvas.width, canvas.height);
        const gap = 3;
        const width = (canvas.width - gap * (bins.length - 1)) / bins.length;
        bins.forEach((value, index) => {
          const height = Math.max(1, (value / 255) * canvas.height);
          context.fillStyle = "#c7a263";
          context.fillRect(index * (width + gap), canvas.height - height, width, height);
        });
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        attachAnalyser(audio);
        setPlaying(true);
        setAudioError(null);
        trackEvent({ name: "playback", action: "play", trackId: track.id });
      } catch {
        setPlaying(false);
        setAudioError("Playback could not start.");
      }
      return;
    }
    audio.pause();
    setPlaying(false);
    trackEvent({ name: "playback", action: "pause", trackId: track.id });
  }

  function attachAnalyser(audio: HTMLAudioElement) {
    if (graph.current) {
      void graph.current.context.resume();
      return;
    }
    try {
      const context = new AudioContext();
      const source = context.createMediaElementSource(audio);
      const analyser = context.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyser.connect(context.destination);
      graph.current = { context, analyser };
      void context.resume();
    } catch {
      graph.current = null;
    }
  }

  return (
    <section className="rd-player" aria-label="Featured music">
      <p className="rd-kicker">Featured music</p>
      <p className="rd-track-title">{track.title}</p>
      {artist.releases.length > 0 ? (
        <ul className="rd-releases">
          {artist.releases.map((release) => (
            <li key={release.title}>
              {release.title}
              {release.year ? ` · ${release.year}` : ""}
              {release.note ? ` — ${release.note}` : ""}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rd-note">No release metadata has been added beyond this audio file.</p>
      )}
      <audio ref={audioRef} src={track.src} preload="metadata" />
      <div className="rd-transport">
        <button type="button" onClick={() => void toggle()}>
          {playing ? "Pause" : "Play"}
        </button>
        <label>
          Seek
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(time, duration || 0)}
            aria-valuetext={formatTime(time)}
            aria-label="Seek"
            onPointerDown={() => {
              dragging.current = true;
            }}
            onPointerUp={() => {
              dragging.current = false;
              trackEvent({ name: "playback", action: "seek", trackId: track.id });
            }}
            onChange={(event) => {
              const audio = audioRef.current;
              const next = Number(event.target.value);
              if (audio) audio.currentTime = next;
              setTime(next);
            }}
          />
        </label>
        <span className="rd-time">
          {formatTime(time)} / {formatTime(duration)}
        </span>
        <label>
          Volume
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            aria-label="Volume"
            onChange={(event) => setVolume(Number(event.target.value))}
          />
        </label>
      </div>
      <canvas ref={canvasRef} className="rd-meter" width={280} height={36} aria-hidden="true" />
      {audioError ? <p className="rd-note" role="alert">{audioError}</p> : null}
    </section>
  );
}
