"use client";

import { useState } from "react";
const questions = [["Question 07 of 26", "Who feels this problem most sharply?", "Don’t describe everyone. Tell me about the person already looking for a solution."], ["Question 08 of 26", "What do they do today instead?", "The workaround reveals the real competition—and the opening for your offer."], ["Question 09 of 26", "What would make a first test feel undeniable?", "Name the smallest proof that earns your next serious move."]];
export default function BlueprintDemo() {
  const [index, setIndex] = useState(0); const [recording, setRecording] = useState(false); const [label, prompt, copy] = questions[index];
  return <><div><p className="tag">{label}</p><h2>{prompt}</h2><p>{copy}</p></div><div className={`wave${recording ? " isRecording" : ""}`}>{Array.from({ length: 8 }, (_, item) => <i key={item} />)}<button type="button" onClick={() => setRecording((value) => !value)}>{recording ? "Listening · tap to pause" : "Speak your answer"}</button><div className="demoSteps" aria-label="Demo question progress">{questions.map((_, item) => <button type="button" aria-label={`Show question ${item + 7}`} aria-current={item === index} onClick={() => { setIndex(item); setRecording(false); }} key={item} />)}</div></div></>;
}
