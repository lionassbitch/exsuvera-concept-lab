import type { BibleSection } from "./types";

export const sources: BibleSection = {
  slug: "sources",
  number: "09",
  title: "Sources",
  tagline: "What could be opened from here — and what could not",
  summary:
    "Notion and Google Drive held the recovered archive. ChatGPT conversation history and Claude Projects are not readable through this environment. Bind them by export, not by wishing.",
  blocks: [
    { type: "kicker", text: "Archive honesty · 2026-10-16" },
    {
      type: "lede",
      text: "You asked to link the complete ChatGPT and Claude history. This agent can sign nothing into those products. It can read the Notion workspace and Google Drive that already caught the work those chats produced. That is the real archive. The rest needs an export.",
    },
    {
      type: "h2",
      text: "Opened and used for this bible",
    },
    {
      type: "h3",
      text: "Google Drive",
    },
    {
      type: "links",
      items: [
        {
          href: "https://docs.google.com/document/d/1u-AR-k_BCLERcgHUHag9eZWsIZOiekHUKnWN3RqKu8k/edit",
          label: "LAB canon master screenplay — The Crown from Below (Aug 2026)",
          external: true,
        },
        {
          href: "https://docs.google.com/document/d/1dyzSHtC6B1sWVwqeZYeARvnoLiexGJDaUbdAXv5nHxw/edit",
          label: "Master profile — Eddie Colón",
          external: true,
        },
        {
          href: "https://drive.google.com/drive/folders/1ov-PAGhQil_BlShD1eV54OU_AA9yhJJ3",
          label: "LAB Exsuvera blog topics folder",
          external: true,
        },
      ],
    },
    {
      type: "h3",
      text: "Notion",
    },
    {
      type: "links",
      items: [
        {
          href: "https://app.notion.com/p/39a1170c768781a59669e255a2465e69",
          label: "From Insult to Architecture — origin story",
          external: true,
        },
        {
          href: "https://app.notion.com/p/3091170c768780b5ba46ea90da9dc250",
          label: "LAB Operating System",
          external: true,
        },
        {
          href: "https://app.notion.com/p/3ed1170c7687816e9b95e12ac2a1cecb",
          label: "Exsuvera holds the paper. LAB holds the signal.",
          external: true,
        },
        {
          href: "https://app.notion.com/p/3e61170c7687813da2c1c969db3fd67d",
          label: "DI-OS — Orion under the myth",
          external: true,
        },
        {
          href: "https://app.notion.com/p/047a0ba586434b4caf92281106509262",
          label: "Lion Ass Bitch content calendar",
          external: true,
        },
        {
          href: "https://app.notion.com/p/3fa1170c7687818f9c65e053b06224c0",
          label: "Archetype Engine",
          external: true,
        },
      ],
    },
    {
      type: "h3",
      text: "This repository",
    },
    {
      type: "links",
      items: [
        { href: "/academy", label: "LAB Academy curriculum" },
        { href: "/scan", label: "Blind Spot engine" },
        { href: "/thyself", label: "Thyself concept" },
        { href: "/blueprint", label: "Blueprint Chat concept" },
      ],
    },
    {
      type: "h2",
      text: "Could not be opened from here",
    },
    {
      type: "p",
      text: "ChatGPT. No conversation-history API is connected to this agent. Sign in with ChatGPT on this site, if enabled, proves identity. It does not import threads. Claude. The Full Ancient Wisdom Systems Reading lives as a Claude Doc you can see; this environment cannot fetch Claude Projects, Artifacts, or chat logs. The reading you pasted into the request is what we used, plus the chart-of-record block.",
    },
    {
      type: "h2",
      text: "How to bind ChatGPT and Claude for the next pass",
    },
    {
      type: "numbered",
      items: [
        "ChatGPT: Settings → Data controls → Export. Unzip. Drop the conversations.json (or shared links) into Drive folder LAB Canon / Thread Archive.",
        "ChatGPT: for living threads, use Share → copy link, paste the URLs into the Notion page “Thread Archive.” Shared links are the only URLs that travel.",
        "Claude: open the Ancient Wisdom reading → Copy / Export to Markdown → save in the same Drive folder as 2026-10-13-nine-systems-reading.md.",
        "Claude Projects: for each Project, export the key Artifacts the same way. Do not assume a future agent can log in as you.",
        "Optional: a single Notion database “Thread Archive” with properties Source (ChatGPT / Claude / Grok / Gemini), Date, Title, Drive file, Canon status (raw / distilled / superseded).",
      ],
    },
    {
      type: "callout",
      label: "What we will not do",
      text: "We will not invent ChatGPT or Claude URLs. A fake link is a second Registry — a record that looks like memory and is not. When you drop the exports in Drive, this bible’s Sources page can grow without rewriting the myth.",
    },
    {
      type: "h2",
      text: "Canon conflict log",
    },
    {
      type: "table",
      headers: ["Older public language", "Canon now", "What to do"],
      rows: [
        ["Khemetz as the third mascot", "Anput is the character; sacred reckoning is her doctrine", "Do not delete old posts. New work says Anput."],
        ["Trinity as brand mascots", "Archetypes that govern behavior; mascots advertise", "Keep the distinction in every brief."],
        ["This is a brand", "This is not a brand. This is a warning.", "Non-negotiable."],
        ["Orion as a person / guide character in shots", "Distributed signal, never humanoid", "Reject any image that gives him a face."],
      ],
    },
    {
      type: "p",
      text: "The August 2026 screenplay remains the narrative spine. This bible does not supersede it. It gives the spine a house: method, products, prompts, merch, and the 2026 sky overlay in language a tired person can use.",
    },
  ],
};
