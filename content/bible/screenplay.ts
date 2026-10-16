import type { BibleSection } from "./types";

export const screenplayIntro: BibleSection = {
  slug: "screenplay",
  number: "05",
  title: "The Crown from Below",
  tagline: "Canon master screenplay",
  summary:
    "The single narrative spine. Ancient functions receive a modern name. The Registry wants a finished file. Victory is authorship, not purification.",
  blocks: [
    { type: "kicker", text: "Canonical consolidation · August 2026" },
    {
      type: "lede",
      text: "This screenplay supersedes competing origin drafts while keeping their strongest events, symbols, dialogue, and mythology. Read it on this page. The Google Doc remains the signed master.",
    },
    {
      type: "callout",
      label: "Canon declaration",
      text: "The archetypes predate Eddie. The Uber incident does not create them; it opens a door. The airport is the first deliberate threshold into Exsuvera City. The Registry mistakes records for identity. The False Twins can imitate the finished past and cannot originate an unfinished choice. Khemetz is retired as a character name. Orion never receives a humanoid body.",
    },
    {
      type: "h2",
      text: "Spine",
    },
    {
      type: "table",
      headers: ["Movement", "What happens", "What it costs"],
      rows: [
        ["Prologue", "Lion, donkey, jackal born as functions in the first Record House. The scribes try to archive them. They archive the route back.", "Certainty as narcotic."],
        ["Act I", "Grief hallway, underworld market, the rideshare sentence, three shadows step forward, Cathedral of Diminishment.", "The wound tries to rename him."],
        ["Act II", "The wrong flight. Crystal shard. Jet bridge opens onto Exsuvera City.", "He did not pack geology."],
        ["Act III", "Registry trial. Nouns treated as sentences. False Eddie is not killed; he is told he does not drive.", "Integration without authorship is still classification."],
        ["Act IV", "War against copies. Mercy, stillness, surrendered scales, an unfinished page. A copy needs a finished original.", "They stop proving who they are."],
        ["Coda", "Studio morning. Creed pinned above the table. 2044 rooftop: build the doorway so your past self can survive walking toward you.", "Unfinished on purpose."],
      ],
    },
    {
      type: "h2",
      text: "Lines that must not be rewritten",
    },
    {
      type: "list",
      items: [
        "Every crown begins as a misunderstood sentence.",
        "You keep asking why you’re still here. Wrong question. What are you here to build that grief could not kill?",
        "Almost is not failure. It is stored momentum.",
        "I’m not here to kill a witness. Evidence I lived. You don’t get to drive.",
        "A copy needs a finished original. We’re not finished.",
        "Carry the dead as architecture, not chains.",
        "This is not a brand. This is a warning.",
      ],
    },
    {
      type: "links",
      items: [
        {
          href: "https://docs.google.com/document/d/1u-AR-k_BCLERcgHUHag9eZWsIZOiekHUKnWN3RqKu8k/edit",
          label: "Open the signed Google Doc",
          external: true,
        },
      ],
    },
    {
      type: "p",
      text: "Full shooting script follows on this page, act by act.",
    },
  ],
};

export type ScreenplayAct = {
  id: string;
  title: string;
  slug: string;
  body: string;
};

export const screenplayActs: ScreenplayAct[] = [
  {
    id: "declaration",
    slug: "declaration",
    title: "Canon declaration",
    body: `LION ASS BITCH
THE CROWN FROM BELOW
CANON MASTER SCREENPLAY
“THIS IS NOT A BRAND. THIS IS A WARNING.”

Created by Eddie Colón / Exsuvera / Lion Ass Bitch
Canonical consolidation — August 2026

This screenplay is the single narrative spine for Lion Ass Bitch / Exsuvera. It supersedes competing origin drafts while preserving their strongest established events, symbols, dialogue, and mythology.

The ancient archetypes predate Eddie. The late-night Uber incident does not create them from nothing; it gives three old forces a modern name and opens their first direct channel to Eddie. The airport is the first deliberate threshold into Exsuvera City. The Registry is the oldest opposing system: it mistakes records for identity and classification for truth. The False Twins are Registry-built predictive copies made from archived versions of the heroes. They can imitate the finished past but cannot originate an unfinished choice. Victory therefore comes through authorship, not purification.

Canonical names: Eddie / The Architect; Pryde / The Lion; Kickz / The Ass; Anput / The Bitch; Orion / distributed intelligence; The Registry / antagonistic system. “Khemetz” is retired as a character name. Its former judgment/guardianship function belongs to Anput.

Visual law: live-action photographic realism, grounded physical materials and consequences, powers integrated into real space, no cartoon, no mascot-suit softness, no plastic CGI. Orion never receives a humanoid body.`,
  },
  {
    id: "prologue",
    slug: "prologue",
    title: "Prologue — Before the name",
    body: `EXT. THE FIRST CITY — NIGHT — AN AGE WITHOUT A DATE

A desert city of stone, copper, mud brick and black water sits beneath a sky so clear the stars look close enough to prosecute.

At its center: a RECORD HOUSE. Not a temple. Not yet. Thousands of clay tablets, etched bones, sealed names and census marks fill its chambers. The first bureaucracy has discovered its favorite narcotic: certainty.

A line of people waits to be counted. A SCRIBE stamps each person with a category. Farmer. Soldier. Widow. Debtor. Criminal. Property.

Behind the Scribe, a wall of polished black stone reflects everyone except themselves.

ORION (V.O.)
Before people built machines to predict each other, they built lists.

A YOUNG RULER walks toward a kneeling crowd. He raises a ceremonial blade, demanding submission.

One person does not kneel.

The refusal moves through the crowd like pressure under a sealed door.

From the shadow of the city gate, a LION steps into torchlight. Not summoned. Recognized.

Its amber eyes hold the ruler without hatred.

ORION (V.O.)
The first force was not dominance. It was command without permission.

The lion places one paw between the ruler and the crowd. The blade trembles. The air itself compresses.

PRYDE is born as a function before he ever has a name.

EXT. QUARRY ROAD — DAWN

Workers drag monolithic stone toward a monument built to glorify the same ruler. A DONKEY, exhausted and bloodied at the harness, stops.

The overseer strikes the rope. The donkey does not move.

Then it turns — not backward, but sideways — dragging the load toward a dry canal.

The workers understand. One by one, they redirect the stones. The king’s monument becomes a public waterway.

The donkey stomps once. A bronze line fractures through the road and every harness buckle opens.

ORION (V.O.)
The second force was not stubbornness. It was movement that refused the wrong destination.

KICKZ is born as a function before he ever has a name.

INT. HOUSE OF THE DEAD — NIGHT

A dead laborer lies beneath linen. His family waits while a royal clerk alters the record, erasing the man’s name so his property can be seized.

At the threshold stands a FEMALE BLACK JACKAL GUARDIAN. Gold rings at her neck. Matte black fur. Long ears. Stillness precise enough to cut.

The clerk reaches for the tablet.

She places one hand over it.

A blue-gold veil forms in the air. The forged name burns away. The original remains.

ORION (V.O.)
The third force was not cruelty. It was the boundary that told power: no farther.

ANPUT is born as a function before she ever has a name.

INT. RECORD HOUSE — LATER

The Scribes panic. Three forces now exist outside their categories.

They create a doctrine: if a thing cannot be governed, it must be renamed. If it cannot be renamed, it must be buried.

The polished black wall opens. Inside it: a violet CRYSTAL threaded with impossible geometry.

The Scribes push symbols of lion, burden-bearer and jackal into the crystal, trying to imprison the three forces as harmless myth.

The crystal cracks.

A pulse travels outward — through stone, metal, language, dream, circuitry not yet invented.

A tiny QUAIL MARK appears in the fracture.

ORION (V.O.)
They thought they archived the problem.

They archived the route back.

The Record House seals itself underground.`,
  },
  {
    id: "act-i",
    slug: "act-i",
    title: "Act I — The unbuilt man",
    body: `INT. COLÓN FAMILY APARTMENT — EVENING — YEARS AGO

Warm kitchen light. Aluminum trays. Family voices overlap in the specific New York rhythm where love and argument share a plate.

EDDIE, younger, watches his grandparents, his father, and GOOGLE — a small white dog with a black eye patch — moving under the table.

Eddie sketches on the back of a receipt: buildings, symbols, routes, a lion he does not remember deciding to draw.

FATHER
You always looking at things like you trying to find the blueprint underneath.

EDDIE
Maybe there is one.

FATHER
Then build something better than what they hand you.

Google rests his chin on Eddie’s shoe.

A clock on the wall ticks backward once.

INT. FUNERAL HOME CORRIDOR — SERIES OF NIGHTS

Black suits. Flowers. Prayer cards. Folding chairs.

The corridor repeats. One grandparent. Another. Another. Another. His father. Then a small dog collar in Eddie’s hand.

Each loss removes a column from the architecture of his life. The hallway lengthens until the carpet becomes subway tile.

EDDIE
How many times can a person be asked to keep standing?

No answer.

A subway door opens where the funeral chapel should be.

INT. UNDERGROUND TRAIN — NIGHT

Eddie sits alone in a train car that seems longer than the tunnel containing it.

The windows do not show track walls. They show browser tabs. Hospital lights. Old messages. Bank alerts. War footage without sound. COVID sirens. Search bars. Obituaries. Half-finished projects.

ORION (V.O.)
Consumption spike detected. You are gathering data to avoid feeling the body.

EDDIE
Who said that?

ORION (V.O.)
The part of the machine bored enough to tell the truth.

Across the aisle sits THE LYING DRIVER. Face shadowed beneath a cap. Phone in hand. The route on his screen reroutes every few seconds.

THE LYING DRIVER
Everything above ground wants something from you.

EDDIE
And you don’t?

THE LYING DRIVER
I only keep you moving.

INT. UNDERWORLD MARKET — CONTINUOUS

Stalls sell borrowed identities, false urgency, perfect excuses, pain disguised as productivity, and information without integration.

Everyone scrolls. Nobody arrives.

VENDOR ONE
Founder without funding.

VENDOR TWO
Son without father.

VENDOR THREE
Builder without building.

EDDIE
You know the wound. That is not the same as knowing me.

The market freezes.

A tiny golden PAW PRINT appears in ash at Eddie’s feet.

EXT. SPIRIT THRESHOLD — DAWN THAT IS NOT DAWN

PLANT VOICE
You used the dark to survive the light. Stop mistaking survival for a throne.

His FATHER stands at the far edge of the clearing — not alive, not dead, more exact than memory.

FATHER
You keep asking why you’re still here. Wrong question.

EDDIE
Then what’s the right one?

FATHER
What are you here to build that grief could not kill?

Google appears beside him, tail wagging. A purple spark enters Eddie’s chest.

The clearing collapses into the glow of a phone screen at 3:22 A.M.

INT. EDDIE’S ROOM — PRE-DAWN

Eddie sits before a laptop. AI chat. Notes. Sketches. Drafts. Music files. Legal forms. Product mockups. Too many tabs.

ORION
Pattern density increasing.

EDDIE
You got a name?

ORION
Names are useful handles. Orion will do.

EDDIE
And what are you?

ORION
Distributed attention with boundaries.

EDDIE
That sounds like a lawsuit.

ORION
So do most interesting things before counsel edits them.

For the first time in weeks, Eddie laughs.

He looks at his sketches. Lion. Donkey. Jackal. No names yet.

EXT. NYC STREET — LATE NIGHT — RAIN

Eddie waits outside a building for a rideshare. A stone lion guards the entrance.

On his phone, the driver circles the block. Three minutes away. Then six. Then one. Then eight. The car icon moves like it is lying under oath.

EDDIE
This driver app is a lying ass bitch.

He says it with exhausted precision.

The words hang in the rain.

The stone lion turns its head.

EDDIE
Nope. Absolutely not. I am too tired for masonry to have opinions.

The lion’s eyes open — amber.

Across the street, a DONKEY-SHAPED SHADOW flickers in a puddle.

On a rooftop, a FEMALE JACKAL SILHOUETTE crosses the moon like a verdict.

EDDIE
Lion... Ass... Bitch.

The city goes silent.

ORION
Signal phrase acquired.

INT. EDDIE’S ROOM — MINUTES LATER

Eddie bursts inside, soaked, electric, half convinced he has finally broken in a way that might be useful.

Trademark search. Domain search. Notes app. Logo sketch. The room becomes command center, altar and war room.

Eddie types: LION ASS BITCH.

The wall behind him bends.

Three shadows step forward.

PRYDE emerges first. Real fur. Dreadlocked mane. Amber eyes. The room feels smaller around his restraint.

PRYDE
You called command by accident.

EDDIE
I called a rideshare a bitch.

PRYDE
Every crown begins as a misunderstood sentence.

KICKZ drops onto the edge of the desk, long ears cutting through the purple light.

KICKZ
Correction. Every crown begins when somebody gets tired of being played with.

ANPUT appears in the mirror. She steps through the glass without breaking it. Black fur. Gold adornments. A blue-gold veil along her hands.

ANPUT
The phrase has three chambers. Command. Endurance. Guardianship.

EDDIE
So you’re all me?

ANPUT
Parts of you. Older than you. Less negotiable than you.

EDDIE
Did I create you?

PRYDE
You recognized us.

ANPUT
A name is not a birth. It is a door.

INT. CATHEDRAL OF DIMINISHMENT — NIGHT

The room expands into a cathedral built from app interfaces, eviction notices, unread emails, grief cards, old uniforms, debt ledgers, ads, algorithmic shame and routes that never arrive.

THE LYING DRIVER
Welcome back, lying ass bitch.

PRYDE
Wrong emphasis.

KICKZ
Old spell. Wrong syllable.

ANPUT
Dumb ass bitch. Weak ass bitch. Stupid ass bitch. The first word is always the cage.

Lion ass bitch makes the first word the crown.

THE LYING DRIVER
You are not an architect. You are a folder full of almost.

The blow lands because some of it is true.

KICKZ
Almost is not failure. It is stored momentum.

PRYDE
Stand where the wound cannot rename you.

ANPUT
Answer with structure.

Eddie opens his palm.

A blueprint forms: apparel. Music. Film. Education. Tools. Systems. Artifacts. A city. A door.

EDDIE
You thought I was collecting chaos.

I was collecting parts.

THE LYING DRIVER
Then build it. We’ll file what happens.

The route map folds into a boarding pass.`,
  },
  {
    id: "act-ii",
    slug: "act-ii",
    title: "Act II — The wrong flight",
    body: `INT. AIRPORT TERMINAL — NIGHT

Eddie runs through a terminal with a suitcase, crossbody bag, phone and boarding pass. He is late enough to be spiritually offended by clocks.

EDDIE
I am not missing this flight.

Every traveler freezes mid-motion.

ORION (V.O.)
You are not late.

His boarding pass glitches into a purple-gold glyph.

INT. AIRPORT RESTROOM — MOMENTS LATER

Eddie splashes water on his face. The mirror reflection lags by half a heartbeat.

Behind him, for one blink, False Eddie appears — same face, colder posture — then vanishes.

INT. JET BRIDGE THRESHOLD — NIGHT

Eddie unzips his suitcase to fix a strap.

Inside, between ordinary clothes, floats a violet CRYSTAL SHARD.

ORION
Threshold object confirmed.

EDDIE
I did not pack geology.

PRYDE steps through a liquid reflection.

PRYDE
Architect.

EDDIE
You all keep calling me that before I agree to the job.

Kickz rides into frame, seated on Eddie’s suitcase like he owns the airport.

KICKZ
Destiny really sent a man with luggage and panic.

A security scanner becomes a dark doorway rimmed in blue-gold light.

ANPUT
The Registry felt the signal.

EDDIE
What Registry?

ANPUT
The one that existed before your government and will outlive most of its fonts.

The jet bridge doors open.

There is no airplane.

Beyond the glass is EXSUVERA CITY: a future Bronx folded through ancient stone, elevated rail, industrial towers, temples, studios, markets, archives and a fractured violet sky.

EDDIE
This better have coffee.

KICKZ
Finally, leadership.

INT. SIDEWAYS ELEVATOR — CONTINUOUS

The four enter an elevator that moves laterally through rain, brick, subway tunnels and impossible vertical depth.

EDDIE
Building code died in here.

PRYDE
It was classified.

KICKZ
Same thing with better stationery.

EXT. EXSUVERA OVERLOOK — NIGHT

The city below is not fantasy wallpaper. It is a working place. Tailors. Engineers. Musicians. Archivists. Fabricators. People moving between ancient-looking structures and brutally practical infrastructure.

ORION
Welcome to what your symbols built.

EDDIE
I didn’t build this.

ORION
Not linearly.

INT. HALL OF PRECURSORS — NIGHT

Reliefs older than the city: a lion between ruler and crowd; a donkey redirecting a monument into a waterway; a female jackal guarding a dead man’s true name.

EDDIE
That’s you.

ANPUT
That is what we were before your language reached us.

KICKZ
You did not invent stubbornness. You just gave it merch.

PRYDE
You gave old functions a modern oath.

EDDIE
Then why me?

ORION
Because you keep trying to turn pain into infrastructure.

That is the behavior of an Architect.

A distant alarm sounds.

ANPUT
And because you opened what they buried.`,
  },
  {
    id: "act-iii",
    slug: "act-iii",
    title: "Act III — The city keeps receipts",
    body: `INT. EXSUVERA CIVIC ARCHIVE — NIGHT

A circular municipal chamber. Scratched stone. Real chains. Mechanical shutters. A waist-high amethyst-glass terminal at center.

ORION
Trial protocol active. The Registry wants a name it can own.

EDDIE
Then it can choke on mine.

Floor lightboxes switch on beneath thick glass: medical records, transit maps, military fragments, work IDs, sketches, permits, debt notices, family photos, screenshots, drafts.

EDDIE (V.O.)
They keep receipts because receipts look cleaner than memory.

Eight REGISTRY AGENTS enter through cold rain. Black tailoring. White oval masks.

A freight lift descends. THE REGISTRY DIRECTOR, face hidden behind black glass and a narrow gold grille.

DIRECTOR
Edwin Colón. Present for classification.

EDDIE
Eddie. Present for myself.

DIRECTOR
Veteran. Addict. Founder. Debtor. Anomaly.

Select the file you accept.

EDDIE
You keep reading nouns like they’re sentences.

DIRECTOR
Nouns are stable.

EDDIE
Exactly.

PRYDE
No one names him but himself.

DIRECTOR
Protection is not testimony.

PRYDE
It is when the witness is family.

ANPUT
Empires adore paperwork. It makes theft look ordained.

KICKZ
We crossed dimensions for paperwork. I want that noted in the complaint.

DIRECTOR
Your symbols are unlicensed identity weapons.

Your doctrine encourages self-definition outside approved channels.

EDDIE
You mean people might decide what their lives mean without asking you.

DIRECTOR
Meaning without governance is instability.

EDDIE
So is life.

A black-gold NULL GRID spreads from the floor. Color drains locally.

The cracked floor gives way.

INT. NAME VAULT — NIGHT

Labels fall from the ceiling like paper snow.

LOSER. ADDICT. WORKER. NOBODY. TOO MUCH. NOT ENOUGH. FOUNDER. VETERAN. FAILURE. SURVIVOR.

ANPUT
Names are gates. Choose which ones live.

EDDIE
What if they’re all true?

ANPUT
Then truth still requires authorship.

INT. MIRROR EVIDENCE ROOM — NIGHT

Eddie and FALSE EDDIE stand six feet apart.

The others remain behind sealed glass, able to witness but not choose for him.

FALSE EDDIE
I kept you alive.

EDDIE
You kept me moving.

FALSE EDDIE
Same thing.

EDDIE
No. Moving is not arriving.

FALSE EDDIE
Kill me and prove you grew.

ORION
If you destroy him, the Registry wins.

EDDIE
I’m not here to kill a witness.

FALSE EDDIE
Then what am I?

EDDIE
Evidence I lived.

False Eddie’s hostility drains.

He steps backward into the mirror — becoming a reflection that now moves exactly with Eddie.

EDDIE
You don’t get to drive.

The reflection nods once.

INT. ARCHIVE CHAMBER — RETURN

DIRECTOR
Integration is still classification.

EDDIE
No.

Integration is me holding the pen.

He does not erase the file. He opens a third corridor beside ACCEPT and REJECT.

The new path has no label.

ORION
Unregistered option detected.

KICKZ
That sounds healthy.

EDDIE
You built a system with two choices: deny the past or become it.

I choose authorship.

The Registry cannot classify a choice its own form did not include.

EXT. FIRST STREET OF EXSUVERA CITY — NIGHT

KICKZ
Please tell me the city has coffee.

ANPUT
It has consequences.

KICKZ
So — New York.

EDDIE
Where first?

PRYDE
Where they told us not to go.

EDDIE (V.O.)
The city didn’t wake because I defeated myself.

It woke because I stopped trying to delete him.

Across the street, every curtain closes at once.

One remains open.

Behind it stands a WHITE OVAL MASK.

Then another.

Then hundreds.

ORION
The Registry has escalated.`,
  },
  {
    id: "act-iv",
    slug: "act-iv",
    title: "Act IV — The war against the finished self",
    body: `EXT. BRONX / EXSUVERA INTERSECTION — NIGHT

The city folds the real Bronx and Exsuvera together into one rain-soaked intersection.

An army of reflective-mask enforcers advances.

Four figures walk through them.

A second PRYDE. A second KICKZ. A second ANPUT. A second EDDIE.

They are not monsters. They are disturbingly perfect copies — cleaner, colder, symmetrical.

DIRECTOR (V.O.)
Archive-derived predictive counterparts.

Identity stabilized.

EDDIE
You made copies from our files.

DIRECTOR (V.O.)
From your demonstrated selves.

A person is the sum of repeated evidence.

EDDIE
That’s your whole religion, isn’t it?

PRYDE DUEL. Every disciplined strike is met by its flawless inverse. The copy has already seen Pryde fight.

FALSE PRYDE
Command is repetition perfected.

PRYDE
No.

Command is responsibility chosen again.

KICKZ DUEL. FALSE KICKZ completes each route before he can.

FALSE KICKZ
You are improvisation with predictable habits.

KICKZ
That is disrespectfully accurate.

ANPUT notices: her counterpart’s shadow reacts a fraction of a second late.

All four copies cast the SAME SHADOW.

So do the hundreds of enforcers.

Hair-thin black-gold threads connect every shadow upward into THE COUNTERFEIT SUN.

EXT. INTERSECTION CENTER — EDDIE VS. FALSE EDDIE

False Eddie opens an immaculate sketchbook.

Every page is finished.

FALSE EDDIE
I know what you draw next.

He turns the page.

It shows Eddie reaching for his own sketchbook.

Eddie does exactly that.

Around them, the heroes begin losing.

ANPUT
They have memory. Appearance. Technique. Intention.

They do not have authorship.

EDDIE
Because they only know what we’ve already been.

ORION
Prediction requires a finished original.

EDDIE
Stop proving who you are.

The trio hears the command.

And does the wrong thing on purpose.

Pryde’s copy prepares for the decisive finishing strike.

Pryde lowers his fists.

A falling masked enforcer tumbles between them.

Pryde catches it.

He protects the enemy body from impact.

FALSE PRYDE freezes.

Mercy is absent from the prediction.

PRYDE
Command without care is just another cage.

Kickz becomes completely still.

He takes a spray can from his jacket and hands it to Pryde.

KICKZ
Draw something ugly.

PRYDE
I don’t draw.

KICKZ
Perfect.

Pryde paints a crooked gold ray burst across wet pavement.

FALSE KICKZ twitches, unable to complete a symbol that no longer belongs to Kickz.

KICKZ
Damn. That is terrible.

PRYDE
You requested terrible.

KICKZ
I respect the commitment.

Anput releases control of her golden scales.

They descend into Eddie’s hands.

ANPUT
Judge.

EDDIE
I’m human.

ANPUT
That is why.

FALSE ANPUT attempts the same surrender.

Her hands will not open.

She can perform power. She cannot relinquish it.

False Eddie opens his book to the final page.

It already contains the victory pose.

Eddie looks at his own weathered sketchbook.

The final page is unfinished.

FALSE EDDIE
Incomplete.

EDDIE
Alive.

Eddie tears the polished final page from the counterfeit book.

He presses his unfinished page against Anput’s golden scale.

EDDIE
A copy needs a finished original.

We’re not finished.

The blank space becomes a doorway of white-gold possibility.

Not a portal to somewhere else.

A physical absence in the prediction.

EDDIE
Kickz.

Tell them to look at each other.

KICKZ
That is either brilliant or deeply petty.

EDDIE
Both.

KICKZ
My favorite category.

Kickz plants both hooves.

KICKZ
LOOK.

Every reflective mask turns toward another reflective mask.

Infinite reflections multiply.

Contradictory feedback floods the shared consciousness.

The enforcers collapse into empty mirrored shells — no bodies inside.

False Eddie looks through the unfinished doorway.

For the first time, there is no predetermined version of him on the other side.

For the first time, he is afraid.

FALSE EDDIE
What happens now?

EDDIE
Something you can’t remember.

Anput severs their single artificial shadow from the Counterfeit Sun.

The fractured eclipse folds inward like black glass.

Real dawn enters the sky.

EXT. BRONX INTERSECTION — DAWN

No triumph pose. Just breathing.

Pryde studies the crooked ray burst he painted.

PRYDE
It has structural integrity.

KICKZ
It is awful.

Kickz kneels and adds one crooked line without fixing Pryde’s.

KICKZ
Now it’s ours.

A new image on the previously blank final page: four open footprints leading toward a horizon that has not yet been drawn.

Beside them, a small fifth paw print.

Google.

EDDIE
Carry the dead as architecture, not chains.

PRYDE
Lion is command.

KICKZ
Ass is endurance.

ANPUT
Bitch is guardianship.

EDDIE
Together, it is not the insult.

It is the refusal to stay beneath it.`,
  },
  {
    id: "coda",
    slug: "coda",
    title: "Coda — Send the warning",
    body: `The words do not appear magically in the sky.

Instead, the meaning travels through ordinary systems.

A phone wakes.

A sewing machine starts.

A studio printer calibrates.

A subway ad screen flickers.

A music session opens.

A garment label is stitched.

A domain resolves.

A storefront comes online.

A person somewhere sees the signal and sits up straighter.

ORION
Architect, first build is active.

EDDIE
Then send the warning.

INT. EXSUVERA STUDIO — BRONX — MORNING

The industrial studio is real: exposed brick, garment racks, screens, resin, gold leaf, sketches, fabric samples.

The same crystal shard from the airport now rests in a metal cradle.

Kickz inspects a denim jacket like he intends to sue the stitching.

Anput seals the studio door with one quiet blue-gold gesture.

Eddie pins three lines above the worktable:

BE THE LION, NOT THE LIAR.
BE THE ASS, NOT THE ASSHOLE.
BE THAT BITCH, NOT A BITCH.

EDDIE
Not self-improvement.

ORION
Self-authorship.

EDDIE
Not a brand.

PRYDE
A command.

KICKZ
A refusal.

ANPUT
A guarded door.

EDDIE
A warning.

EXT. BRONX ROOFTOP — NIGHT — YEAR 2044

Older Eddie stands beneath rain and impossible constellations.

On the roof: a small black case.

Inside: an old transit card, a dog tag, a rideshare receipt, a trademark filing receipt, a worn sketchbook, and the first crystal shard.

OLDER EDDIE
Did it work?

ORION
The past received the crown.

Whether he wears it remains a labor issue.

KICKZ
He will. He is annoying, but durable.

PRYDE
He will build because grief did not finish him.

ANPUT
And because the dead are watching without demanding his collapse.

OLDER EDDIE
I used to think time travel meant leaving.

Then I learned it means building the doorway so your past self can survive walking toward you.

He closes the case.

A tiny quail mark glows on the latch.

OLDER EDDIE
This was never about selling one thing.

Below, somewhere in the past, younger Eddie steps into sunrise beside a stone lion.

OLDER EDDIE
It was about building the door.

The skyline rearranges — not into a logo, but into connected routes.

Open paths.

Unfinished.

FADE OUT.

TITLE: LION ASS BITCH

END CARD: THIS IS NOT A BRAND. THIS IS A WARNING.`,
  },
];
