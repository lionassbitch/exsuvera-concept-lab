import Link from "next/link";

export default function Home(){return <main className="hub">
  <header className="top"><b>EXSUVERA / CONCEPT LAB</b><span>Two products. Two proof paths.</span></header>
  <section className="hubHero"><p className="tag">Product strategy · July 2026</p><h1>Proof before<br/><em>polish.</em></h1><p className="lead">Two focused website concepts designed to test positioning, conversion, and product-market clarity—not merely visual taste.</p></section>
  <section className="conceptCards">
    <Link href="/thyself" className="concept thy"><span>01 / Emotional fitness</span><h2>Thyself</h2><p>Turn an unavailable domain and an abstract AI promise into a trusted, repeatable emotional-work practice.</p><b>Open concept + SWOT →</b></Link>
    <Link href="/blueprint" className="concept bp"><span>02 / Founder clarity</span><h2>Blueprint Chat</h2><p>Turn a 26-question voice intake into an instantly legible, outcome-first business blueprint experience.</p><b>Open concept + SWOT →</b></Link>
  </section>
    <section className="conceptCards" style={{gridTemplateColumns:"1fr"}}>
    <Link href="/scan" className="concept bp"><span>03 / Live instrument</span><h2>Blind Spot Scan</h2><p>Four questions. The engine reads how you answer, not just what you answer, and names the one thing you can&apos;t see. Every run adds to a living corpus.</p><b>Run the scan →</b></Link>
  </section>
  <section className="thesis"><p className="tag">Portfolio thesis</p><h2>Thyself builds the person.<br/>Blueprint builds the plan.</h2><p>The strongest portfolio play is a shared engine with separate category stories: reflective depth for one, decisive momentum for the other.</p></section>
</main>}
