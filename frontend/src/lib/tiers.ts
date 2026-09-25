  import type { MembershipLevel } from "../types";

  export type Tier = {
    level: MembershipLevel;
    name: string;
    priceKr: number;
    tagline: string;
    features: string[];
  };

  export const TIERS: Tier[] = [
    {
      level: "BASIC",
      name: "Regional Scout",
      priceKr: 0,
      tagline: "För dig som vill komma igång",
      features: ["Spelarprofiler", "Grundläggande statistik", "Scoutingartiklar"],
    },
    {
      level: "PLUS",
      name: "Head Scout",
      priceKr: 149,
      tagline: "För dig som jämför och väljer",
      features: ["Allt i Regional Scout", "Jämför spelare sida vid sida", "Klubbrapporter"],
    },
    {
      level: "FULL",
      name: "Chief Scout",
      priceKr: 299,
      tagline: "För dig som bygger en trupp",
      features: [
        "Allt i Head Scout",
        "Egna scoutlistor",
        "Sätt betyg på spelare",
        "Exklusiva scoutrapporter",
      ],
    },
  ];