import type { Curriculum } from "./types";

export const curriculum: Curriculum = {
  title: "LAB Academy",
  subtitle: "Exsuvera presents",
  tagline: "[ sharpen my vision ]",
  thesis:
    "Most founders stall not from lack of ambition but from unclear sequence. LAB Academy walks you from uncertainty to execution in nine ordered phases — each with a deliverable you can hold, test, and build on.",
  phases: [
    {
      slug: "orientation",
      number: "01",
      title: "Orientation",
      tagline: "From unsure to focused",
      description:
        "Before you build anything, you need to know what you are actually deciding. This phase turns vague restlessness into a bounded problem worth solving.",
      outcome: "A one-page focus brief: the problem, the person, and the constraint that makes the idea real.",
      lessons: [
        {
          slug: "uncertainty-audit",
          title: "The uncertainty audit",
          duration: "15 min",
          summary:
            "Name what you do not know yet — and separate genuine unknowns from avoidance disguised as research.",
          objectives: [
            "List every open question blocking you from a next step",
            "Classify each as knowable, testable, or unknowable",
            "Identify the one question that unlocks the rest",
          ],
          body: [
            "Uncertainty feels like fog because it is undifferentiated. You treat every doubt as equally heavy, so nothing moves.",
            "Run a three-column audit. Column one: facts you already have. Column two: assumptions you are acting on without proof. Column three: questions you genuinely cannot answer without doing something.",
            "Most people discover their block is not in column three. It is in column two — beliefs treated as facts. 'People will pay for this' is an assumption until someone does.",
            "The unlock question is the one whose answer would change your next seven days of work. Not your next seven years — your next seven days.",
          ],
          exercise: {
            prompt:
              "Write three columns: Known / Assumed / Unknown. Fill each with at least five items about your idea. Circle the one unknown that, if resolved, would let you take a concrete action this week.",
            deliverable: "Uncertainty audit worksheet",
            time: "15 min",
          },
        },
        {
          slug: "narrowing-the-field",
          title: "Narrowing the field",
          duration: "20 min",
          summary:
            "Constraints are not limitations — they are the lens that makes an idea legible.",
          objectives: [
            "Apply three constraint types: audience, geography, and capability",
            "Reject at least two adjacent directions you could take but will not",
            "State your focus in one sentence a stranger would understand",
          ],
          body: [
            "Broad ideas feel safe because they cannot be wrong. They also cannot be tested. Every successful venture started as a narrow wedge, not a category.",
            "Pick one constraint to lead with: who (a specific person), where (a bounded market), or how (a capability only you have). The other two follow.",
            "Write two 'not this' statements. 'We are not building for enterprises.' 'We are not a marketplace.' Rejection is focus.",
            "Your focus sentence follows this shape: 'I help [specific person] achieve [specific outcome] through [specific mechanism].' If any slot needs 'everyone' or 'anything,' you are not focused yet.",
          ],
          exercise: {
            prompt:
              "Complete the focus sentence. Write two explicit rejections. Read both aloud — if they feel uncomfortable, you are probably close.",
            deliverable: "Focus sentence + two rejections",
            time: "20 min",
          },
          toolLink: { href: "/scan", label: "Run Blind Spot Scan →" },
        },
        {
          slug: "choosing-your-lane",
          title: "Choosing your lane",
          duration: "12 min",
          summary:
            "Pick the version of your idea you can prove in 90 days — not the version that needs permission.",
          objectives: [
            "Define a 90-day proof horizon",
            "Identify the smallest version that produces evidence",
            "Name what you will defer deliberately",
          ],
          body: [
            "Founders often conflate the dream version with the proof version. The dream needs capital, team, and time. The proof needs one person to care enough to act.",
            "Your 90-day lane is the smallest scope where a stranger could observe whether your core assumption holds. Not whether you can build it — whether anyone wants it.",
            "Defer list is as important as the build list. Write what you are explicitly not doing for 90 days: no custom app, no full brand, no hiring. Deferral is strategy.",
          ],
          exercise: {
            prompt:
              "Define your 90-day proof: one customer action that would validate your core assumption. List three things you will not build, hire, or spend on during this window.",
            deliverable: "90-day proof brief",
            time: "12 min",
          },
        },
      ],
    },
    {
      slug: "mission",
      number: "02",
      title: "Mission",
      tagline: "Discover why this exists",
      description:
        "Mission is not marketing copy. It is the reason you will still care when the work gets boring, expensive, or lonely.",
      outcome: "A mission statement you would defend in a room of skeptics — plus the personal stake behind it.",
      lessons: [
        {
          slug: "why-mission-first",
          title: "Why mission before market",
          duration: "10 min",
          summary:
            "Market sizing tells you if money exists. Mission tells you if you will still be in the room when the money is slow.",
          objectives: [
            "Distinguish mission from vision, values, and positioning",
            "Articulate your personal stake — not the customer's",
            "Test whether your mission survives a bad quarter",
          ],
          body: [
            "Mission answers: why does this need to exist, and why are you the one to build it? Market answers: who will pay, and how much? Both matter. Sequence matters more.",
            "If your only reason is 'this could be big,' you will quit at the first plateau. Mission is the non-financial reason that keeps you iterating when metrics flatline.",
            "Personal stake is not weakness — it is fuel. The best missions connect a lived experience to a problem you cannot unsee. That connection is hard to copy.",
          ],
          exercise: {
            prompt:
              "Finish: 'I am building this because I cannot stop noticing ___' and 'The moment I knew this mattered was when ___.'",
            deliverable: "Personal stake paragraph",
            time: "10 min",
          },
        },
        {
          slug: "mission-workshop",
          title: "Mission statement workshop",
          duration: "25 min",
          summary:
            "Draft a mission that is specific enough to guide decisions and short enough to remember.",
          objectives: [
            "Write three mission drafts of increasing specificity",
            "Apply the 'would you reject revenue?' test",
            "Arrive at a final statement under 30 words",
          ],
          body: [
            "Draft one: aspirational and broad. Draft two: adds the specific person you serve. Draft three: adds the change you create in their life.",
            "The rejection test: if a lucrative opportunity appeared that violated your mission, would you say no? If everything is acceptable, you have a slogan, not a mission.",
            "Strong missions use active verbs and name a transformation. Weak missions use 'empower,' 'leverage,' or 'revolutionize' without saying for whom.",
            "Under 30 words forces clarity. If you need more, you are describing multiple missions.",
          ],
          exercise: {
            prompt:
              "Write three drafts. Apply the rejection test to each. Select one final statement and explain what revenue you would turn down to keep it.",
            deliverable: "Final mission statement (≤30 words)",
            time: "25 min",
          },
        },
        {
          slug: "mission-resonance",
          title: "Testing mission resonance",
          duration: "15 min",
          summary:
            "A mission that only makes sense to you is a diary entry. Test whether it lands with the people you serve.",
          objectives: [
            "Identify three people to test your mission with",
            "Prepare a one-sentence ask, not a pitch",
            "Document what confused them versus what lit them up",
          ],
          body: [
            "Do not test mission with investors first. Test with the person your mission claims to serve. Their reaction tells you if you understand their world.",
            "The ask is simple: 'Does this describe a problem you actually have?' Not 'Do you like my idea?' Their problem, not your solution.",
            "Confusion is data. If they ask 'what do you mean by that word?' your mission is speaking your language, not theirs. Revise until they nod before you explain.",
          ],
          exercise: {
            prompt:
              "Send your mission statement to three people in your target audience. Record exact quotes from their reactions — confusion and enthusiasm both.",
            deliverable: "Resonance notes from 3 conversations",
            time: "15 min",
          },
        },
      ],
    },
    {
      slug: "vision",
      number: "03",
      title: "Vision",
      tagline: "[ sharpen my vision ]",
      description:
        "Vision is the future state your mission makes inevitable — vivid enough to reverse-plan from, concrete enough to share without a deck.",
      outcome: "A vision brief: the world as it looks when your mission succeeds, with sensory detail and measurable markers.",
      lessons: [
        {
          slug: "future-state-sketch",
          title: "Future-state sketch",
          duration: "20 min",
          summary:
            "Describe the world after your mission succeeds — not your company after it succeeds.",
          objectives: [
            "Write a day-in-the-life scene from your customer's future",
            "Identify three visible markers that prove the vision is real",
            "Separate vision from vanity metrics",
          ],
          body: [
            "Company vision ('we are the leading platform') is not useful for planning. Customer vision ('Maria closes her laptop at 5pm because the prep is done') is.",
            "Write a scene, not a slide. What does the person see, do, and stop worrying about? Sensory detail makes vision plan-able.",
            "Markers are observable. '10,000 users' is a metric. 'Families in this zip code no longer order takeout on Sundays because prep is handled' is a marker tied to vision.",
          ],
          exercise: {
            prompt:
              "Write a 200-word scene of one customer's day after your mission succeeds. List three observable markers that would prove this scene is becoming real.",
            deliverable: "Future-state scene + markers",
            time: "20 min",
          },
        },
        {
          slug: "vision-mission-values",
          title: "Vision, mission, and values",
          duration: "12 min",
          summary:
            "Three layers, three jobs. When they collapse into one paragraph, none of them work.",
          objectives: [
            "Place your existing mission inside the three-layer stack",
            "Draft three operating values that constrain how you build",
            "Check for contradictions between layers",
          ],
          body: [
            "Mission: why we exist. Vision: what the world looks like when we succeed. Values: how we behave while getting there. Each layer resolves different decisions.",
            "Values are decision shortcuts. 'Ship weekly' resolves the perfectionism debate. 'Customer evidence before features' resolves the build-what-I-think-is-cool debate.",
            "Contradiction check: if your vision requires scale but your values require handcrafted quality, name the tension now — do not discover it at 100 customers.",
          ],
          exercise: {
            prompt:
              "Write your mission, vision, and three values on separate lines. For each value, write one decision it would force you to make differently.",
            deliverable: "Mission / vision / values stack",
            time: "12 min",
          },
        },
        {
          slug: "making-vision-legible",
          title: "Making the vision legible",
          duration: "18 min",
          summary:
            "If your co-founder, first hire, or investor cannot repeat your vision back, it is still private.",
          objectives: [
            "Reduce your vision to a 60-second spoken version",
            "Create a one-page vision brief with image or sketch",
            "Test comprehension with someone outside your head",
          ],
          body: [
            "Legibility test: explain your vision in 60 seconds without jargon. If the listener asks 'but what do you actually do?' the vision is not landing.",
            "One-page brief structure: the scene (customer future), the gap (what is broken today), the bridge (your mechanism), the marker (how we will know).",
            "A rough sketch beats polished prose for early alignment. Draw the before and after. Pictures expose gaps in logic that words hide.",
          ],
          exercise: {
            prompt:
              "Record a 60-second vision explanation. Play it back. Rewrite until a non-founder friend can summarize it in one sentence.",
            deliverable: "One-page vision brief",
            time: "18 min",
          },
          toolLink: { href: "/blueprint", label: "Try Blueprint Chat →" },
        },
      ],
    },
    {
      slug: "architecture",
      number: "04",
      title: "Architecture",
      tagline: "Reverse-plan the mission",
      description:
        "Start from the vision and work backward. Architecture is the scaffold — milestones, dependencies, and the critical path from here to there.",
      outcome: "A reverse-plan architecture: milestones from vision to now, with dependencies and a critical path.",
      lessons: [
        {
          slug: "working-backward",
          title: "Working backward from vision",
          duration: "25 min",
          summary:
            "Forward planning guesses. Reverse planning deduces what must be true at each step.",
          objectives: [
            "Place your vision marker on a timeline",
            "Work backward in 90-day increments",
            "Identify the nearest milestone that produces evidence",
          ],
          body: [
            "Start at the vision marker — the observable proof your mission succeeded. Ask: what must be true immediately before that? Repeat until you reach today.",
            "Each milestone should end with evidence, not activity. 'Launched website' is activity. 'Ten strangers paid for the pilot' is evidence.",
            "The nearest milestone is your only priority. Everything else is a branch that opens only after the nearest gate clears.",
          ],
          exercise: {
            prompt:
              "Draw a backward chain of at least five milestones from your vision marker to today. Circle the nearest one that produces customer evidence.",
            deliverable: "Reverse milestone chain",
            time: "25 min",
          },
        },
        {
          slug: "dependency-mapping",
          title: "Dependency mapping",
          duration: "20 min",
          summary:
            "Some work only matters after other work is true. Map it before you waste a month on the wrong sequence.",
          objectives: [
            "List all work items for your nearest milestone",
            "Mark hard dependencies versus parallel work",
            "Identify the bottleneck — the one item everything waits on",
          ],
          body: [
            "Hard dependency: B cannot start until A is done. 'Accept payments' depends on 'legal entity exists.' 'Run ads' depends on 'landing page converts.'",
            "Parallel work: can happen simultaneously without blocking. Brand and product can often run in parallel; compliance and banking usually cannot.",
            "The bottleneck is the longest dependent chain. That chain sets your real timeline — not your optimistic calendar.",
          ],
          exercise: {
            prompt:
              "List every task for your nearest milestone. Draw arrows for dependencies. Highlight the bottleneck — the task with the longest chain behind it.",
            deliverable: "Dependency map",
            time: "20 min",
          },
        },
        {
          slug: "architecture-document",
          title: "The architecture document",
          duration: "30 min",
          summary:
            "One page that anyone can read to understand where you are, where you are going, and what must happen next.",
          objectives: [
            "Assemble mission, vision, milestones, and dependencies into one doc",
            "Define success criteria for the current phase",
            "Set a review cadence — architecture is living, not static",
          ],
          body: [
            "Architecture document sections: Mission (why), Vision (where), Current milestone (now), Critical path (how), Deferred (not yet), Review date (when we revisit).",
            "Success criteria must be falsifiable. 'Feel good about progress' is not criteria. 'Three paying customers' is.",
            "Review monthly at minimum. Architecture that never updates is a fantasy that calcified. Real plans change when evidence arrives.",
          ],
          exercise: {
            prompt:
              "Write your architecture document on one page using the six sections above. Schedule your first review date.",
            deliverable: "One-page architecture document",
            time: "30 min",
          },
        },
      ],
    },
    {
      slug: "logistics",
      number: "05",
      title: "Logistics",
      tagline: "Resources and operations",
      description:
        "Ideas fail on logistics more often than on insight. This phase maps what you need, what you have, and what you can borrow before you buy.",
      outcome: "A resource map: time budget, tool stack, people, and capital requirements for your current milestone.",
      lessons: [
        {
          slug: "need-vs-want",
          title: "What you need vs what you want",
          duration: "15 min",
          summary:
            "Every 'need' is a hypothesis until your milestone proves otherwise.",
          objectives: [
            "Audit every resource you think you need",
            "Classify as required, substitutable, or deferred",
            "Calculate the cost of your actual critical path only",
          ],
          body: [
            "Founders over-resource early because spending feels like progress. A $500/month tool stack before your first customer is often procrastination with a receipt.",
            "Required: without it, the milestone fails. Substitutable: a free or manual alternative exists for now. Deferred: needed later, not for current evidence.",
            "Cost your critical path only. Everything else is optional until the milestone clears.",
          ],
          exercise: {
            prompt:
              "List every resource you think you need (tools, people, money, space). Tag each R/S/D. Total the cost of Required items only.",
            deliverable: "Resource audit with R/S/D tags",
            time: "15 min",
          },
        },
        {
          slug: "time-team-territory",
          title: "Time, team, and territory",
          duration: "20 min",
          summary:
            "The three constraints every solo founder and small team must name explicitly.",
          objectives: [
            "Define your weekly time budget for this venture",
            "Decide build vs buy vs borrow for each skill gap",
            "Bound your geographic or market territory for phase one",
          ],
          body: [
            "Time budget: honest hours per week, not aspirational. If you have 10 hours, your milestone must fit 10 hours — not the 40 you wish you had.",
            "Skill gaps: build (learn it yourself), buy (hire or contract), borrow (partner or advisor). Default to borrow for legal and accounting; build for customer-facing skills.",
            "Territory: where will you prove this first? One neighborhood, one niche community, one professional network. Dominate a room before you try to fill a stadium.",
          ],
          exercise: {
            prompt:
              "Write your weekly hour budget. For each skill you lack, mark B/B/B. Define your territory in one sentence.",
            deliverable: "Time / team / territory brief",
            time: "20 min",
          },
        },
        {
          slug: "resource-map",
          title: "The resource map",
          duration: "25 min",
          summary:
            "A single view of everything required to reach your nearest milestone — and where each piece comes from.",
          objectives: [
            "Map each critical-path task to a resource",
            "Identify gaps with a specific acquisition plan",
            "Set spending triggers — when you will actually pay for something",
          ],
          body: [
            "Resource map rows: task, resource needed, source (have / find / buy), cost, trigger (what evidence unlocks this spend).",
            "Spending triggers prevent premature investment. 'Hire a designer when 5 paying customers' is a trigger. 'Hire a designer because the logo feels wrong' is not.",
            "Share the map with anyone helping you. Misaligned assumptions about resources kill partnerships quietly.",
          ],
          exercise: {
            prompt:
              "Build your resource map for the current milestone. Add at least three spending triggers tied to evidence, not feelings.",
            deliverable: "Resource map with spending triggers",
            time: "25 min",
          },
        },
      ],
    },
    {
      slug: "foundations",
      number: "06",
      title: "Foundations",
      tagline: "Entrepreneurial literacy",
      description:
        "You do not need an MBA. You need a working model of how value moves from problem to payment — and the vocabulary to talk about it.",
      outcome: "A business model sketch: customer, offer, price, cost, channel, and the one number that must work.",
      lessons: [
        {
          slug: "business-models-101",
          title: "Business models 101",
          duration: "18 min",
          summary:
            "How value is created, delivered, and captured — in plain language.",
          objectives: [
            "Name your business model type",
            "Map the value chain from problem to payment",
            "Identify where margin lives in your model",
          ],
          body: [
            "Every business model answers: who pays, for what, how often, and why you keep more than you spend. Subscription, transaction, licensing, marketplace — name yours.",
            "Value chain: problem recognized → solution discovered → trust established → payment exchanged → value delivered → repeat or refer. Where are you weakest?",
            "Margin is not markup. It is what remains after you deliver the promised value. A low-price high-volume model needs different math than a high-touch service.",
          ],
          exercise: {
            prompt:
              "Draw your value chain in six steps. Circle the step where you are most vulnerable. Write one experiment to strengthen it.",
            deliverable: "Value chain diagram",
            time: "18 min",
          },
        },
        {
          slug: "customer-economics",
          title: "Customer economics",
          duration: "20 min",
          summary:
            "One customer who pays is a signal. The economics of that customer is the business.",
          objectives: [
            "Define customer acquisition cost (CAC) for your first 10 customers",
            "Estimate lifetime value (LTV) with conservative assumptions",
            "Calculate payback period — when a customer becomes profitable",
          ],
          body: [
            "For your first 10 customers, CAC is mostly time. Track hours spent finding each customer. That is your real acquisition cost.",
            "LTV = average revenue per customer × average retention period. If you do not know retention, assume one purchase and revise when data arrives.",
            "Payback period: how many months until cumulative revenue from a customer exceeds CAC. Under 12 months is healthy for most early ventures.",
          ],
          exercise: {
            prompt:
              "Calculate CAC for your last (or projected) customer. Estimate LTV with conservative assumptions. Is payback under 12 months?",
            deliverable: "CAC / LTV / payback worksheet",
            time: "20 min",
          },
        },
        {
          slug: "go-to-market-basics",
          title: "Go-to-market basics",
          duration: "22 min",
          summary:
            "How the right person discovers you, trusts you, and pays you — without a marketing budget you do not have.",
          objectives: [
            "Choose one primary acquisition channel for phase one",
            "Write your offer in the customer's language",
            "Design a first-conversion path that fits your time budget",
          ],
          body: [
            "Channel options for early stage: direct outreach, community presence, content, referral, partnership. Pick one. Multiple channels at zero budget means zero focus.",
            "Offer language test: would your customer use these words to describe their problem? If not, rewrite until they would.",
            "First-conversion path: the exact steps from stranger to paying customer. Draw it. Count the steps. Remove half.",
          ],
          exercise: {
            prompt:
              "Pick your primary channel. Write your offer in customer language. Draw a first-conversion path of no more than five steps.",
            deliverable: "GTM one-pager",
            time: "22 min",
          },
          toolLink: { href: "/scan", label: "Test your offer clarity →" },
        },
      ],
    },
    {
      slug: "structure",
      number: "07",
      title: "Structure",
      tagline: "IP, legal, registration, banking",
      description:
        "The unglamorous infrastructure that protects what you build and keeps you out of preventable trouble.",
      outcome: "A structure checklist: entity decision, IP inventory, registration steps, and banking setup — with timelines.",
      lessons: [
        {
          slug: "entity-types",
          title: "Entity types and when each fits",
          duration: "15 min",
          summary:
            "Sole prop, LLC, C-corp — the choice affects taxes, liability, and whether you can raise money.",
          objectives: [
            "Compare sole proprietorship, LLC, and corporation for your situation",
            "Identify liability exposure in your specific business",
            "Decide whether to formalize now or after first revenue",
          ],
          body: [
            "Sole prop: simplest, no separation between you and the business, unlimited personal liability. Fine for low-risk testing; risky once money flows.",
            "LLC: liability shield, flexible taxes, cheap to form. The default choice for most service and product businesses before raising institutional capital.",
            "C-corp: required for most VC, double taxation, more admin. Only worth it if you are actively raising or planning to within 12 months.",
            "Timing: many founders test as sole prop, formalize at first revenue or first contract requiring it. Know your trigger before you need it.",
          ],
          exercise: {
            prompt:
              "Write your entity recommendation and why. Define your formalization trigger (revenue amount, contract type, or date).",
            deliverable: "Entity decision memo",
            time: "15 min",
          },
        },
        {
          slug: "ip-basics",
          title: "IP protection basics",
          duration: "18 min",
          summary:
            "What you can own, what you cannot, and what to do before you talk to anyone.",
          objectives: [
            "Inventory your IP: brand, content, code, process, data",
            "Understand trademark vs copyright vs patent vs trade secret",
            "Draft basic protection steps you can take this week",
          ],
          body: [
            "Brand name and logo: trademark territory. Code and content: copyright (automatic, but registration strengthens enforcement). Novel inventions: patent (expensive, slow). Processes and lists: trade secret (keep them secret).",
            "Before sharing anything: document creation dates, use NDAs for sensitive conversations, avoid public disclosure of patentable ideas.",
            "This week: search your brand name for conflicts, add copyright notice to key content, write down your trade secrets and who has access.",
          ],
          exercise: {
            prompt:
              "Inventory your IP assets. Tag each with protection type. List three actions you will take this week.",
            deliverable: "IP inventory + action list",
            time: "18 min",
          },
        },
        {
          slug: "registration-banking",
          title: "Registration and banking",
          duration: "20 min",
          summary:
            "Separate your money, register what the law requires, and build the financial hygiene that survives scrutiny.",
          objectives: [
            "List every registration required in your jurisdiction",
            "Open a dedicated business bank account",
            "Set up basic bookkeeping from day one",
          ],
          body: [
            "Registrations vary by location and entity: business license, state registration, EIN (US), sales tax permit if applicable. Check your city and state — not a blog post from another country.",
            "Business bank account: non-negotiable once money moves. Commingling personal and business funds destroys liability protection and makes taxes painful.",
            "Bookkeeping: a spreadsheet with date, description, amount, category is enough to start. Categories: revenue, COGS, operating expense, owner draw. Upgrade to software when transactions exceed ~20/month.",
          ],
          exercise: {
            prompt:
              "List your required registrations with deadlines. Open or schedule a business bank account. Create your bookkeeping template.",
            deliverable: "Registration + banking checklist",
            time: "20 min",
          },
        },
      ],
    },
    {
      slug: "funding",
      number: "08",
      title: "Funding",
      tagline: "Capital pathways",
      description:
        "Money is a tool, not a milestone. This phase maps how to fund your current architecture — without giving away what you have not built yet.",
      outcome: "A funding strategy: bootstrap plan, raise criteria, and non-dilutive options ranked for your stage.",
      lessons: [
        {
          slug: "bootstrap-vs-raise",
          title: "Bootstrap vs raise",
          duration: "15 min",
          summary:
            "The decision is not moral — it is architectural. Different capital fits different milestones.",
          objectives: [
            "Calculate your bootstrap runway from the resource map",
            "Define raise criteria — what evidence would make raising rational",
            "Understand what you trade for each capital type",
          ],
          body: [
            "Bootstrap: you keep control, you keep all upside, you move at the speed of revenue. Raise: you trade equity for speed and scale you could not self-fund.",
            "Raise criteria example: 'I will raise when I have 50 paying customers and need capital only for inventory, not for finding product-market fit.'",
            "What you trade: equity (ownership), debt (cash flow), grants (time and reporting), revenue share (margin). Name what you are willing to trade before you need to.",
          ],
          exercise: {
            prompt:
              "Calculate bootstrap runway in months. Write your raise criteria as an if-then statement. List what you will not trade at this stage.",
            deliverable: "Bootstrap / raise decision framework",
            time: "15 min",
          },
        },
        {
          slug: "funding-instruments",
          title: "Funding stages and instruments",
          duration: "20 min",
          summary:
            "Friends and family, angels, pre-seed, grants, revenue-based financing — what each is for and when it fits.",
          objectives: [
            "Map funding instruments to your current milestone",
            "Understand dilution basics for equity rounds",
            "Identify two non-dilutive options relevant to you",
          ],
          body: [
            "Pre-revenue: personal savings, friends and family, grants, competitions, pre-sales. Post-revenue: angels, revenue-based financing, bank lines.",
            "Dilution: each equity round sells a percentage of your company. Round one at 15% leaves you 85%. Round two at 15% of the remaining leaves you ~72%. Plan the dilution path before you start.",
            "Non-dilutive: grants (SBIR, industry-specific), revenue-based financing (repay from revenue), strategic partnerships (they fund, you deliver). Often slower but you keep ownership.",
          ],
          exercise: {
            prompt:
              "Rank five funding instruments by fit for your stage. For your top choice, write what you would use the capital for — tied to architecture milestones.",
            deliverable: "Funding instrument ranking",
            time: "20 min",
          },
        },
        {
          slug: "pitch-from-architecture",
          title: "Pitch narrative from your architecture",
          duration: "25 min",
          summary:
            "The best pitch is your architecture document spoken aloud — not a template from the internet.",
          objectives: [
            "Structure a 3-minute pitch from your existing documents",
            "Lead with evidence, not aspiration",
            "Prepare for the three questions every investor asks",
          ],
          body: [
            "Pitch structure: problem (customer scene), insight (why now), solution (your mechanism), evidence (what you have proved), ask (specific use of funds), vision (where this goes).",
            "Evidence beats vision in early pitches. 'Three paying customers in six weeks' beats 'a $10B market.' Investors fund traction or exceptional founders — lead with what you have.",
            "Three inevitable questions: Why you? Why now? What do you need and what does it unlock? Write answers before you enter any room.",
          ],
          exercise: {
            prompt:
              "Write your 3-minute pitch using architecture document sections. Draft answers to Why you / Why now / What do you need.",
            deliverable: "3-minute pitch script",
            time: "25 min",
          },
        },
      ],
    },
    {
      slug: "execution",
      number: "09",
      title: "Execution",
      tagline: "Ship it",
      description:
        "Architecture without execution is a document. This phase turns your plan into a 90-day sprint with proof, measurement, and the discipline to iterate.",
      outcome: "A 90-day execution sprint: weekly actions, success metrics, review rituals, and pivot criteria.",
      lessons: [
        {
          slug: "ninety-day-sprint",
          title: "The 90-day launch sprint",
          duration: "30 min",
          summary:
            "Break your nearest milestone into weekly actions with one non-negotiable deliverable per week.",
          objectives: [
            "Define 12 weekly deliverables tied to evidence",
            "Assign each deliverable to your time budget",
            "Identify the one metric that tells you if the sprint is working",
          ],
          body: [
            "Twelve weeks, twelve deliverables. Each ends with something observable — a conversation, a payment, a signup, a shipped test. No 'work on marketing' weeks.",
            "Time budget reality check: if a deliverable needs 20 hours and you have 10 per week, either extend the timeline or shrink the deliverable.",
            "One metric: the single number that tells you the sprint is working. Revenue, conversion rate, retention, NPS — pick one, ignore the rest for 90 days.",
          ],
          exercise: {
            prompt:
              "Write 12 weekly deliverables. Assign hours to each. Pick your one metric and define what 'working' looks like at week 4, 8, and 12.",
            deliverable: "90-day sprint plan",
            time: "30 min",
          },
        },
        {
          slug: "proof-before-polish",
          title: "Proof before polish",
          duration: "12 min",
          summary:
            "The discipline of shipping ugly evidence before beautiful assumptions.",
          objectives: [
            "Identify where you are over-building relative to evidence needed",
            "Define the minimum viable proof for your current milestone",
            "Set a ship date and hold it",
          ],
          body: [
            "Polish is procrastination when you have zero customers. The landing page does not need to be perfect — it needs to convert one stranger.",
            "Minimum viable proof: the cheapest, fastest version that produces the evidence your architecture requires. Often a PDF, a form, or a conversation — not an app.",
            "Ship dates are commitments to learning. Missing a ship date means missing evidence. Treat it like a customer meeting you cannot reschedule.",
          ],
          exercise: {
            prompt:
              "Define your MVP proof. Set a ship date within 14 days. List what you will deliberately not polish.",
            deliverable: "MVP proof spec + ship date",
            time: "12 min",
          },
          toolLink: { href: "/interactive", label: "Try the engine →" },
        },
        {
          slug: "measure-iterate-pivot",
          title: "Measure, iterate, pivot",
          duration: "20 min",
          summary:
            "Evidence changes plans. Build the review ritual that lets you adapt without panicking.",
          objectives: [
            "Set weekly and monthly review rituals",
            "Define pivot criteria before you need them",
            "Distinguish iteration (same mission, new tactic) from pivot (new mission)",
          ],
          body: [
            "Weekly review: did I ship the deliverable? What did I learn? What changes next week? Thirty minutes, same day each week, non-negotiable.",
            "Monthly review: is the one metric moving? Is the architecture still valid? What evidence contradicts our assumptions? Update the architecture document.",
            "Pivot criteria written in advance: 'If we have zero paying customers after 90 days despite 50 conversations, we revisit the offer — not the mission.' Pre-commitment prevents sunk-cost denial.",
          ],
          exercise: {
            prompt:
              "Schedule weekly and monthly reviews. Write your pivot criteria as if-then statements. Share with an accountability partner.",
            deliverable: "Review ritual + pivot criteria",
            time: "20 min",
          },
        },
      ],
    },
  ],
};

export function getPhase(slug: string) {
  return curriculum.phases.find((p) => p.slug === slug);
}

export function getLesson(phaseSlug: string, lessonSlug: string) {
  const phase = getPhase(phaseSlug);
  return phase?.lessons.find((l) => l.slug === lessonSlug);
}

export function getAllPhases() {
  return curriculum.phases;
}

export function getTotalLessons() {
  return curriculum.phases.reduce((n, p) => n + p.lessons.length, 0);
}

export function getLessonIndex(phaseSlug: string, lessonSlug: string) {
  let index = 0;
  for (const phase of curriculum.phases) {
    for (const lesson of phase.lessons) {
      index++;
      if (phase.slug === phaseSlug && lesson.slug === lessonSlug) {
        return index;
      }
    }
  }
  return 0;
}

export function getAdjacentLessons(phaseSlug: string, lessonSlug: string) {
  const flat = curriculum.phases.flatMap((p) =>
    p.lessons.map((l) => ({ phase: p, lesson: l }))
  );
  const i = flat.findIndex(
    (x) => x.phase.slug === phaseSlug && x.lesson.slug === lessonSlug
  );
  return {
    prev: i > 0 ? flat[i - 1] : null,
    next: i < flat.length - 1 ? flat[i + 1] : null,
  };
}
