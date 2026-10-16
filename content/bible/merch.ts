import type { BibleSection } from "./types";

export const merch: BibleSection = {
  slug: "merch",
  number: "07",
  title: "The Drop",
  tagline: "Wear the warning. Do not costume the myth.",
  summary:
    "Garments as mobile temples and visible boundaries. Small marks, heavy cloth, no mascot shouting. Each piece maps to a function, not a fandom.",
  blocks: [
    { type: "kicker", text: "Product law · quality over icon spam" },
    {
      type: "lede",
      text: "Clothing is armor of the will, not a billboard for the insult. If a stranger can only see a joke, the piece failed. If they can feel a boundary, it landed.",
    },
    {
      type: "h2",
      text: "Drop architecture",
    },
    {
      type: "table",
      headers: ["Line", "Function", "First SKU", "Price band"],
      rows: [
        ["Creed", "The oath on the body", "Heavy hoodie, three-line hem label", "$88–$128"],
        ["Pryde", "Held power", "Gold-thread claw at the collar, black wool/cotton", "$96–$160"],
        ["Kickz", "Who’s carrying this", "Work jacket, hoof print inside the pocket", "$140–$220"],
        ["Anput", "Threshold", "Jackal-scale pin, blade bookmark, black silk scarf", "$24–$90"],
        ["Workbench", "The brick", "Tote, sketchbook with a blank last page, brick paperweight", "$18–$64"],
        ["Warning", "Signal, not slogan", "Sticker pack, enamel, sewing label pack for makers", "$8–$28"],
      ],
    },
    {
      type: "h2",
      text: "SKU notes — first twelve",
    },
    {
      type: "numbered",
      items: [
        "Creed Hoodie — black, violet lining, three lines at the hem like a care label. The back stays quiet.",
        "Pryde Collar Tee — small amber-gold claw, left clavicle. No mane print.",
        "Kickz Work Jacket — denim/canvas, bronze hardware, inner pocket stamp: WHO’S CARRYING ALL THIS.",
        "Anput Pin — black jackal head, gold collar, enamel, 25mm. True ears.",
        "Anput Blade Bookmark — black steel, for the editor’s copy of any script.",
        "Manger Tote — heavy canvas, two donkeys as a tiny constellation, empty trough in the center. Feed the carriers.",
        "Unfinished Page Sketchbook — last page printed blank on purpose. Do not fill it in manufacturing.",
        "Shell Card — credit-card size: “A shell can save your life. It can also become too small.”",
        "Orion Stitch Kit — violet thread, one needle, instructions: mend one unfinished edge.",
        "Warning Label Pack — sew-in labels for other makers in the pride: THIS IS NOT A BRAND. THIS IS A WARNING.",
        "Trinity Night Cap — unstructured, no puff embroidery, small triad at the back.",
        "2044 Rooftop Poster — older Eddie, case of receipts, unfinished skyline. Numbered.",
      ],
    },
    {
      type: "h2",
      text: "What we will not make",
    },
    {
      type: "list",
      items: [
        "Cartoon mascot plush of the trinity.",
        "The phrase as giant back-print irony.",
        "Anput as a sexy human with ears.",
        "Anything that requires the wearer to explain they are kidding.",
        "Drops that outrun the Manger: no inventory you cannot store, pack, or stand behind.",
      ],
    },
    {
      type: "h2",
      text: "How a drop earns its place",
    },
    {
      type: "p",
      text: "Anput’s three boxes apply to merch. Alive: someone would wear it on a Tuesday. Needs help: the idea is true, the construction is not. Eating the others: it is a joke SKU that steals weeks from the Creed hoodie.",
    },
    {
      type: "callout",
      label: "Ops",
      text: "Collabs sign with Exsuvera LLC. The myth does not sign. Hangtags: Exsuvera presents / Lion Ass Bitch. Care label carries the creed. USPTO serial 99127454 was marked abandoned Feb 9, 2026 — counsel on revival vs new filing before the next namedrop. Not legal advice; it is a door Anput already flagged.",
    },
  ],
};
