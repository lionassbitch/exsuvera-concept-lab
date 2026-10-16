import Link from "next/link";

export default function Home(){return <main className="hub">
  <header className="top"><b>EXSUVERA / CONCEPT LAB</b><span>Canon. Products. Proof.</span></header>
  <section className="hubHero"><p className="tag">Exsuvera presents · Lion Ass Bitch</p><h1>Proof before<br/><em>polish.</em></h1><p className="lead">The insult became the universe. Use the Origins Bible for canon, then prove the tools: Thyself, Blueprint, the Scan, and LAB Academy.</p></section>
  <section className="conceptCards">
    <Link href="/thyself" className="concept thy"><span>01 / Emotional fitness</span><h2>Thyself</h2><p>Turn an unavailable domain and an abstract AI promise into a trusted, repeatable emotional-work practice.</p><b>Open concept + SWOT →</b></Link>
    <Link href="/blueprint" className="concept bp"><span>02 / Founder clarity</span><h2>Blueprint Chat</h2><p>Turn a 26-question voice intake into an instantly legible, outcome-first business blueprint experience.</p><b>Open concept + SWOT →</b></Link>
  </section>
    <section className="conceptCards" style={{gridTemplateColumns:"1fr 1fr"}}>
    <Link href="/scan" className="concept bp"><span>03 / Live instrument</span><h2>Blind Spot Scan</h2><p>Four questions. The engine reads how you answer, not just what you answer, and names the one thing you can&apos;t see. Every run adds to a living corpus.</p><b>Run the scan →</b></Link>
    <Link href="/academy" className="concept thy" style={{background:"#141c2c",color:"#e9e6dd"}}><span>04 / Education</span><h2>LAB Academy</h2><p>Nine phases from unsure to execution — sharpen your vision, reverse-plan your mission, and ship with proof. [ sharpen my vision ]</p><b>Start the curriculum →</b></Link>
  </section>
  <section className="conceptCards" style={{gridTemplateColumns:"1fr"}}>
    <Link href="/bible" className="concept" style={{background:"#0c0d0a",color:"#f3efe4"}}><span>00 / Canon</span><h2>Origins Bible</h2><p>Creed, origin night, trinity, sky overlay, Workbench method, the master screenplay, GPT Image 2.5 prompts, merch, and the product map — with the Notion and Drive archive linked, and an honest note on ChatGPT and Claude.</p><b>Open the house →</b></Link>
  </section>
  <section className="thesis"><p className="tag">Portfolio thesis</p><h2>Thyself builds the person.<br/>Blueprint builds the plan.<br/>The Bible keeps the names true.</h2><p>The strongest portfolio play is a shared engine with separate category stories — and one canon so the insult cannot be renamed by accident.</p></section>
</main>}
