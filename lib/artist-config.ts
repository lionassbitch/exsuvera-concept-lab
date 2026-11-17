/**
 * Single source of truth for Rich Demon$ / Entitled 2 Equity.
 * Unknown biography, releases, shows, and URLs stay null or empty.
 * Do not invent official links, tracklists, or a likeness.
 */

export type Destination = {
  label: string;
  href: string;
};

export type Release = {
  title: string;
  year: string | null;
  note: string | null;
};

export type Track = {
  id: string;
  title: string;
  /** Local public path or same-origin URL for a licensed file. Playback stays off when this is absent. */
  src: string;
};

export type Show = {
  date: string;
  place: string;
  href: string | null;
};

export type ArtistConfig = {
  artistName: string;
  featuredProject: string;
  tagline: string | null;
  /** Chapter-three lockup taken from the supplied reference board. */
  worldLine: string | null;
  bio: string | null;
  releases: Release[];
  tracks: Track[];
  musicPlatforms: Destination[];
  socialPlatforms: Destination[];
  videos: Destination[];
  shows: Show[];
  merchandise: Destination[];
  bookingEmail: string | null;
  contactDestinations: Destination[];
};

export const artist: ArtistConfig = {
  artistName: "Rich Demon$",
  featuredProject: "Entitled 2 Equity",
  tagline: null,
  worldLine: "This is equity.",
  bio: null,
  releases: [],
  tracks: [],
  musicPlatforms: [],
  socialPlatforms: [],
  videos: [],
  shows: [],
  merchandise: [],
  bookingEmail: null,
  contactDestinations: [],
};

export type SourceImageKey = "hoodie" | "portrait" | "portraitRed" | "emblem" | "world";

export type SourceImage = {
  key: SourceImageKey;
  src: string;
  filename: string;
  alt: string;
  chapter: "artist" | "symbol" | "world";
};

/**
 * Plates in this build. The hoodie, mark, and world art were taken from the
 * supplied reference board because standalone high-resolution files were not
 * included. The portraits are the photographs supplied for the artist.
 */
export const sourceImages: Record<SourceImageKey, SourceImage> = {
  hoodie: {
    key: "hoodie",
    src: "/images/entitled-hoodie.jpg",
    filename: "entitled-hoodie.jpg",
    alt: "Black hoodie with the Entitled 2 Equity mark embroidered in white.",
    chapter: "artist",
  },
  portrait: {
    key: "portrait",
    src: "/images/artist-portrait.jpg",
    filename: "artist-portrait.jpg",
    alt: "Supplied portrait of a person with shoulder-length locs, sunglasses, and a black jacket, leaning on a car. Used as the artist image for Rich Demon$.",
    chapter: "artist",
  },
  portraitRed: {
    key: "portraitRed",
    src: "/images/artist-portrait-red.jpg",
    filename: "artist-portrait-red.jpg",
    alt: "Supplied close portrait under red light of a person with locs and a pendant.",
    chapter: "artist",
  },
  emblem: {
    key: "emblem",
    src: "/images/rich-demons-mark.jpg",
    filename: "rich-demons-mark.jpg",
    alt: "Black and gold Rich Demon$ emblem: a horned dollar-sign monogram.",
    chapter: "symbol",
  },
  world: {
    key: "world",
    src: "/images/entitled-world.jpg",
    filename: "entitled-world.jpg",
    alt: "Turquoise artwork reading Entitled 2 Equity, with a speaker and a small building.",
    chapter: "world",
  },
};

export const sourceImageList = Object.values(sourceImages);
