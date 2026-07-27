import Link from "next/link";
import SessionPreview from "../thyself/SessionPreview";
import BlueprintDemo from "../blueprint/BlueprintDemo";
import "../interactive.css";

export default function InteractiveLab() {
  return <main className="hub interactiveLab"><header className="top"><Link href="/">EXSUVERA / CONCEPT LAB</Link><span>Interactive prototypes</span></header><section className="hubHero"><p className="tag">Two ideas you can feel</p><h1>Try the<br/><em>engine.</em></h1><p className="lead">Small, honest demos for the two strongest concepts in the archive: a guided emotional check-in and a founder clarity sprint.</p></section><section className="session interactiveThy"><div><p className="tag">01 / Thyself</p><h2>Listen inward.</h2><p>A live breathing timer turns the emotional-fitness promise into a gentle first action.</p></div><SessionPreview /></section><section className="demo"><BlueprintDemo /></section><footer className="source"><Link href="/thyself">Read Thyself concept →</Link><Link href="/blueprint">Read Blueprint concept →</Link><Link href="/">Back to concept lab</Link></footer></main>;
}
