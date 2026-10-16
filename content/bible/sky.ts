import type { BibleSection } from "./types";

export const sky: BibleSection = {
  slug: "sky",
  number: "03",
  title: "Written in the stars",
  tagline: "The overlay, in plain words",
  summary:
    "Nine systems. Four literal LAB anchors. Four agreements they share. A long cycle that closes through 2027 and restarts in 2028. None of it is evidence. The testable dates are.",
  blocks: [
    { type: "kicker", text: "Chart of record · computed 2026-10-13 · Harlem, 1986-07-18 04:35 EDT" },
    {
      type: "lede",
      text: "The planet of names, running backward in the Lion, in the house of money. That is the origin story in one line. Everything else is either a tight echo or decoration. Decoration was guaranteed. The four tight ones are what we canonize.",
    },
    {
      type: "h2",
      text: "The four agreements",
    },
    {
      type: "h3",
      text: "1. Your weapon is the exact word",
    },
    {
      type: "p",
      text: "Every system has a slot for how this person communicates. In this chart the slot does not say “talks a lot.” It says “names things precisely.” The planet of words sits in the money part of the chart in both zodiacs, so words are the asset. Fine print from Human Design: sharper answering a real question than broadcasting. That favors The Dig over the rant.",
    },
    {
      type: "h3",
      text: "2. You build big by doing small things exactly",
    },
    {
      type: "p",
      text: "Numerology says Master Builder. The I Ching position the Sun lands on says: small things done right succeed; the bird that flies too high is lost. The chart carries both the “small” and the “great” versions of that lesson, and the conscious self picked small. Carry the big ambition with the small-pieces method, or the beam breaks.",
    },
    {
      type: "h3",
      text: "3. You make more than you can bank",
    },
    {
      type: "p",
      text: "The Chinese chart counts six parts output against zero parts refill. The name is missing the money-and-authority number. Human Design leaves willpower and voice unpowered — the textbook setup for promising more than you can deliver. Western astrology weakens every “backing” signal and makes income self-made. The fix all four agree on: an editor’s blade, contracts, systems, a mentor or partner with rank, rest, and peers who share the load.",
    },
    {
      type: "h3",
      text: "4. One chapter closes in 2027; four clocks restart in 2028",
    },
    {
      type: "p",
      text: "The twenty-year art period ends February 2028, with its last fourteen months about pruning. Numerology goes 8, 9, 1. The Chinese cycle flips from pressure to your own root mid-2028. Saturn finishes auditing the Sun in March 2028. An eclipse lands in the sign four days after the 42nd birthday. Devil’s advocate, included on purpose: four clocks with different periods means any year is a restart in one of them. Four at once is a coincidence until the dated claims are tested against the life.",
    },
    {
      type: "h2",
      text: "The LAB anchors — keep four as canon",
    },
    {
      type: "table",
      headers: ["Anchor", "Mechanism", "Odds, roughly", "Status"],
      rows: [
        ["LION", "Mercury retrograde in Leo, combust, in the 2nd house. A word heard wrong, under Pluto’s square and Saturn’s trine, becoming a company.", "About 1 in 60", "Canon"],
        ["ASS", "The same Mercury, sidereal, in Pushya. The Aselli: two donkeys who won a war by braying. Channel 28–38, stubbornness: Kickz.", "Mercury in Pushya ~1 in 27; 28–38 ~1 in 12", "Canon"],
        ["BITCH", "Sun 0°09' from Procyon, the Lesser Dog. Egyptians: Anubis. Anput. Born in the Dog Days. Loyalty that stays.", "Sun within 10' of Procyon ~1 in 1,000 birthdays", "Canon"],
        ["STUBBORNNESS CHANNEL", "28–38 defined. Kickz as a design, not a mood.", "About 1 in 12", "Canon"],
        ["EXSUVERA / CRAB", "Sun and rising in Cancer. Grows by shedding. Gate 62.5 Metamorphosis against Gate 61 Inner Truth.", "Sun in Cancer ~1 in 12. You also coined the word.", "Structural, not the same tightness"],
      ],
    },
    {
      type: "p",
      text: "A dragnet this wide guarantees some hits. Those four have a literal mechanism. They are what belongs in the Exsuvera Presents nomenclature explainer. Stretch material (Sothis decan, Kenmet lion-serpent, Crowley’s Prince of Wands) can live in essays. Leave it out of canon.",
    },
    {
      type: "h2",
      text: "Cold water, kept on the page",
    },
    {
      type: "list",
      items: [
        "The lion is a voice (Mercury) and a season, not the core animal. The core animal, if any, is the Crab.",
        "The Human Design profile flips from 5/2 to 6/2 if birth was 4:39 or later. The recorded time is 4:35. Treat 5/2 as working, not sacred.",
        "Life Path 22 depends on which addition method you use.",
        "Assumption: born in Harlem. If the hospital was elsewhere in the city, nothing changes. Outside it, recast the Ascendant.",
        "None of this is evidence. It is a ranked overlay you can use, test, and refuse.",
      ],
    },
    {
      type: "h2",
      text: "Where you are, who you became, where this goes",
    },
    {
      type: "p",
      text: "2024: a name that made a next day possible. 2025–26: the cathedral sketched faster than the bricks. Navy years as externally supplied Metal, ended 2013. The employee decade grinding against Hurting Officer. 2026–27: prune. Ketu’s last fourteen months from December 2026. Saturn on the 10th, then square the Sun from June 2027 to March 2028.",
    },
    {
      type: "p",
      text: "2028: four clocks restart. Sun period. Building pinnacle. Own root. Craft becoming income. The eclipse at 29° Cancer, four days after the 42nd birthday. The instruction is not “wait for 2028.” The instruction is: spend the remaining months making the living work able to hold what arrives.",
    },
    {
      type: "h2",
      text: "Chart of record — copy for ThyselfLab",
    },
    {
      type: "p",
      text: "Positions are (sign, degrees, minutes). R marks retrograde. This block is the golden test for the ThyselfLab engine.",
    },
    {
      type: "code",
      label: "CHART_OF_RECORD",
      text: `birth: 1986-07-18 04:35 EDT · Harlem, NY · 40.8116, -73.9465
tropical: ASC Cancer 11°10' · Sun Cancer 25°26' · Mercury Leo 3°43' R
sidereal (Lahiri): Mercury Cancer 10°03' Pushya 3 · Sun Cancer 1°46' Punarvasu 4
numerology: LP 22/4 · Expression 3 · Soul Urge 5 · missing 1, 7, 8
human design: Generator · Sacral · 5/2 (6/2 if ≥04:39) · Split
channels: 10-34 Pryde · 28-38 Kickz · 32-54 Anput
gates: personality Sun 62.5 · Earth 61.5 · design Sun 3.2 · Earth 50.2
i ching: 62 / 61 / 3 / 50
sect: night · houses: whole sign`,
    },
  ],
};
