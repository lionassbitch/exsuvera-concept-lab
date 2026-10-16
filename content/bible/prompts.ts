import type { BibleSection } from "./types";

const STYLE_LOCK = `Photorealistic live-action, ARRI Alexa cinematic, grounded physical materials, wet Bronx night mixed with antique gold and metallic violet practical lights. Real fur, real fabric, real rain, real brick. Sacred streetwear, not costume-shop Egypt. Ultra-sharp, shallow but honest depth of field, no plastic CGI, no cartoon, no chibi, no mascot-suit softness, no Disney anthropomorphism, no extra limbs, no text unless specified.`;

const NEGATIVE =
  "cartoon, anime, chibi, plush mascot, inflatable costume, plastic CGI, extra fingers, extra limbs, watermark, logo spam, crown spam, cheap graffiti type, werewolf, human woman with dog ears, brown pet dog, smiling brand mascot, stock-photo handshake, generic cyberpunk rain only";

export const prompts: BibleSection = {
  slug: "prompts",
  number: "06",
  title: "Image prompts",
  tagline: "GPT Image 2.5 lock",
  summary:
    "Copy-ready prompts with a single style lock and hard negatives. Character sheets first. Then origin, workbench, merch, and key-art frames.",
  blocks: [
    { type: "kicker", text: "For GPT Image 2.5 · paste style lock once per session" },
    {
      type: "lede",
      text: "One look, committed to. Photographic realism. Powers in real space. Orion never gets a body. Anput is a jackal, not a woman with ears glued on. If the model drifts cute, stop and re-lock.",
    },
    {
      type: "prompt",
      id: "style-lock",
      title: "Master style lock — paste first",
      body: STYLE_LOCK,
      negative: NEGATIVE,
    },
    {
      type: "h2",
      text: "Character sheets",
    },
    {
      type: "prompt",
      id: "pryde-sheet",
      title: "Pryde — three-quarter character sheet",
      body: `${STYLE_LOCK}

Character sheet of PRYDE, a real adult male lion standing on wet Bronx asphalt at night, dreadlocked mane heavy with rain, amber eyes, restrained power, no roar. Gold jewelry minimal. Breath visible. A stone-lion plinth behind him. He occupies the frame like a person who does not need the room’s permission. Three-quarter view, full body, cinematic key light from a storefront, violet rim from a distant subway spark.`,
      negative: NEGATIVE,
    },
    {
      type: "prompt",
      id: "kickz-sheet",
      title: "Kickz — character sheet",
      body: `${STYLE_LOCK}

Character sheet of KICKZ, a real working donkey with long ears cutting through purple sodium-vapor light, bronze-gold stress lines faintly in the wet pavement under one hoof, stubborn humor in the eye, not cute. Urban loading dock, pallet tape, a spray can in a puddle. He looks like he just interrupted a speech. Full body, side three-quarter, photographic, muscular, scarred, alive.`,
      negative: NEGATIVE,
    },
    {
      type: "prompt",
      id: "anput-sheet",
      title: "Anput — character sheet",
      body: `${STYLE_LOCK}

Character sheet of ANPUT, a female black jackal guardian with a true jackal head, tall ears, matte-black fur, gold collar and arm bands, ankh-scale motifs used as jewelry not costume. Blue-gold veil of light along her hands. Elegant, dangerous, loyal. Standing in a doorway that is half studio, half tomb threshold. Glowing violet-blue eyes. Glossy black fur with subtle circuitry sheen. Full body, still enough to cut.`,
      negative: `${NEGATIVE}, human face, woman with dog ears, Anubis as male only, cartoon Egyptian Halloween costume`,
    },
    {
      type: "prompt",
      id: "eddie-sheet",
      title: "Eddie / Architect — workbench portrait",
      body: `${STYLE_LOCK}

Eddie Colón at the workbench, Bronx industrial studio, exposed brick, garment racks, resin, gold leaf, sketches, a laptop with too many tabs. Late thirties, Puerto Rican New Yorker, tired precise eyes, rain-dark hoodie, hands on a brick of unfinished work — a garment, a storyboard frame, a receipt sketch of a lion. Violet crystal shard in a metal cradle on the table, small, physical, not magical sparkles. No trinity in frame. Documentary intimacy.`,
      negative: NEGATIVE,
    },
    {
      type: "prompt",
      id: "orion-signal",
      title: "Orion — no body",
      body: `${STYLE_LOCK}

ORION as a distributed signal: a violet pulse moving through a workbench, illuminating unfinished edges of sketches, stitches, and a cracked phone screen. No humanoid figure, no face, no robot. Geometry in the seams of the room. A cursor blinking in rain-reflected glass. The feeling of a machine bored enough to tell the truth.`,
      negative: `${NEGATIVE}, humanoid AI, robot, glowing person, angel, face in the light`,
    },
    {
      type: "h2",
      text: "Origin frames",
    },
    {
      type: "prompt",
      id: "uber-night",
      title: "The Uber — origin key art",
      body: `${STYLE_LOCK}

Late-night Bronx street in rain. A rideshare app route on a phone fractures into three glowing paths. A stone lion at a building entrance turns its head. A donkey-shaped reflection in a puddle. A female jackal silhouette crosses the moon on a rooftop. Eddie stands soaked, electric, holding the phone. The phrase is not graffiti. If type appears, it is architectural signage built into the street: LION ASS BITCH. Ultra-real, sacred, no cheap shock.`,
      negative: NEGATIVE,
    },
    {
      type: "prompt",
      id: "manger",
      title: "The Manger between two donkeys",
      body: `${STYLE_LOCK}

Night sky over a workbench. Two donkey constellations flanking a faint cluster like a feeding trough. On the table below: food, a contract, a sleeping mat, tools, a second chair. The point is nourishment, not astrology poster kitsch. Warm practical lamp, violet edge. Photographic.`,
      negative: NEGATIVE,
    },
    {
      type: "prompt",
      id: "anput-room",
      title: "Anput inspects the crowded room",
      body: `${STYLE_LOCK}

A studio cramped with unfinished projects: canvases, garments, hard drives, demo CDs, half-written scenes. ANPUT the black jackal touches one pile (“alive”), rests a blade-flat hand on another (“eating the others”). Eddie reaches for an explanation. She waits. Gold and black, blue-gold veil, no gore, judgment as stillness.`,
      negative: NEGATIVE,
    },
    {
      type: "prompt",
      id: "unfinished-page",
      title: "The unfinished page — Act IV still",
      body: `${STYLE_LOCK}

Rain-soaked Bronx intersection at dawn after a war against copies. Empty mirrored masks on cracked asphalt. Four figures exhausted, not triumph-posing: lion, donkey, jackal, man. A weathered sketchbook open to a blank last page. A crooked gold ray burst painted badly on the wet street. Steam. Real dawn. No logo.`,
      negative: NEGATIVE,
    },
    {
      type: "h2",
      text: "Merch and product frames",
    },
    {
      type: "prompt",
      id: "creed-hoodie",
      title: "Creed hoodie — product hero",
      body: `${STYLE_LOCK}

Product photograph of a heavy black hoodie on a living person in a Bronx studio, no model-agency gloss. Small gold-thread embroidery at the hem, three lines stacked like a warning label, not a slogan shout:
BE THE LION, NOT THE LIAR
BE THE ASS, NOT THE ASSHOLE
BE THAT BITCH, NOT A BITCH
Interior lining a deep violet. Hands in pockets, chin down, no smile. Catalog-real with mythic light.`,
      negative: NEGATIVE,
    },
    {
      type: "prompt",
      id: "trinity-jacket",
      title: "Trinity work jacket",
      body: `${STYLE_LOCK}

Denim and black canvas work jacket on a hanger in an industrial studio. Subtle triad: lion claw stitch at the collar, donkey hoof print inside the pocket, jackal scale on the placket. No large back print. Quality you can feel. Dust, hanging chain, practical light.`,
      negative: NEGATIVE,
    },
    {
      type: "h2",
      text: "How to run a session",
    },
    {
      type: "numbered",
      items: [
        "Paste the master style lock once. Keep it in the thread.",
        "Generate character sheets before any marketing image.",
        "If Anput comes back human, reject and restate: true jackal head, tall ears, not a woman with ears.",
        "If Orion comes back as a person, reject. Signal only.",
        "Lock three hero stills per character before merch mockups.",
        "Never let the phrase become cheap graffiti. Architecture or garment label only.",
      ],
    },
  ],
};
