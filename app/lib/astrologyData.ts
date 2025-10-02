// lib/astrologyData.ts
import { LagnaIncrementData, LagnaRangeData } from "./types";

export const SIGN_ORDER = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

// Data from your first HTML file (Formula 1) for finding the Rasi
// All times have been converted to total Vizanas for easier interpolation.
export const lagnaRangeData: LagnaRangeData[] = [
  {
    lat: 10 + 2 / 60,
    endTimes: {
      Aries: 3600,
      Taurus: 257,
      Gemini: 539,
      Cancer: 856,
      Leo: 1185,
      Virgo: 1501,
      Libra: 1800,
      Scorpio: 2099,
      Sagittarius: 2415,
      Capricorn: 2744,
      Aquarius: 3061,
      Pisces: 3343,
    },
  },
  {
    lat: 11 + 15 / 60,
    endTimes: {
      Aries: 3600,
      Taurus: 254,
      Gemini: 534,
      Cancer: 848,
      Leo: 1180,
      Virgo: 1498,
      Libra: 1800,
      Scorpio: 2102,
      Sagittarius: 2420,
      Capricorn: 2750,
      Aquarius: 3066,
      Pisces: 3346,
    },
  },
  {
    lat: 12 + 5 / 60,
    endTimes: {
      Aries: 3600,
      Taurus: 252,
      Gemini: 531,
      Cancer: 846,
      Leo: 1177,
      Virgo: 1496,
      Libra: 1800,
      Scorpio: 2104,
      Sagittarius: 2423,
      Capricorn: 2754,
      Aquarius: 3069,
      Pisces: 3348,
    },
  },
  {
    lat: 12 + 58 / 60,
    endTimes: {
      Aries: 3600,
      Taurus: 250,
      Gemini: 527,
      Cancer: 842,
      Leo: 1173,
      Virgo: 1494,
      Libra: 1800,
      Scorpio: 2106,
      Sagittarius: 2427,
      Capricorn: 2758,
      Aquarius: 3073,
      Pisces: 3350,
    },
  },
  {
    lat: 13 + 17 / 60,
    endTimes: {
      Aries: 3600,
      Taurus: 250,
      Gemini: 526,
      Cancer: 841,
      Leo: 1172,
      Virgo: 1494,
      Libra: 1800,
      Scorpio: 2106,
      Sagittarius: 2428,
      Capricorn: 2759,
      Aquarius: 3074,
      Pisces: 3350,
    },
  },
  {
    lat: 14 + 36 / 60,
    endTimes: {
      Aries: 3600,
      Taurus: 247,
      Gemini: 521,
      Cancer: 834,
      Leo: 1167,
      Virgo: 1491,
      Libra: 1800,
      Scorpio: 2109,
      Sagittarius: 2433,
      Capricorn: 2766,
      Aquarius: 3079,
      Pisces: 3353,
    },
  },
  {
    lat: 16 + 28 / 60,
    endTimes: {
      Aries: 3600,
      Taurus: 243,
      Gemini: 513,
      Cancer: 825,
      Leo: 1159,
      Virgo: 1487,
      Libra: 1800,
      Scorpio: 2113,
      Sagittarius: 2441,
      Capricorn: 2775,
      Aquarius: 3087,
      Pisces: 3357,
    },
  },
  {
    lat: 18 + 12 / 60,
    endTimes: {
      Aries: 3600,
      Taurus: 239,
      Gemini: 506,
      Cancer: 816,
      Leo: 1152,
      Virgo: 1483,
      Libra: 1800,
      Scorpio: 2117,
      Sagittarius: 2448,
      Capricorn: 2784,
      Aquarius: 3094,
      Pisces: 3361,
    },
  },
  {
    lat: 20 + 17 / 60,
    endTimes: {
      Aries: 3600,
      Taurus: 234,
      Gemini: 497,
      Cancer: 805,
      Leo: 1143,
      Virgo: 1478,
      Libra: 1800,
      Scorpio: 2122,
      Sagittarius: 2457,
      Capricorn: 2795,
      Aquarius: 3103,
      Pisces: 3366,
    },
  },
  {
    lat: 22 + 3 / 60,
    endTimes: {
      Aries: 3600,
      Taurus: 229,
      Gemini: 490,
      Cancer: 796,
      Leo: 1136,
      Virgo: 1473,
      Libra: 1800,
      Scorpio: 2127,
      Sagittarius: 2464,
      Capricorn: 2804,
      Aquarius: 3110,
      Pisces: 3371,
    },
  },
  {
    lat: 23 + 13 / 60,
    endTimes: {
      Aries: 3600,
      Taurus: 227,
      Gemini: 484,
      Cancer: 790,
      Leo: 1130,
      Virgo: 1471,
      Libra: 1800,
      Scorpio: 2129,
      Sagittarius: 2470,
      Capricorn: 2810,
      Aquarius: 3116,
      Pisces: 3373,
    },
  },
  {
    lat: 27 + 36 / 60,
    endTimes: {
      Aries: 3600,
      Taurus: 215,
      Gemini: 464,
      Cancer: 765,
      Leo: 1110,
      Virgo: 1459,
      Libra: 1800,
      Scorpio: 2141,
      Sagittarius: 2490,
      Capricorn: 2835,
      Aquarius: 3136,
      Pisces: 3385,
    },
  },
].sort((a, b) => a.lat - b.lat);

// Data from your second HTML file (Formula 2) for finding Amsa, Litta, etc.
// All increments have been converted to total Kharas for easier interpolation.
export const lagnaIncrementData: LagnaIncrementData[] = [
  {
    lat: 10.033,
    increments: {
      Aries: 514,
      Taurus: 564,
      Gemini: 636,
      Cancer: 656,
      Leo: 632,
      Virgo: 598,
    } as { [key: string]: number },
  },
  {
    lat: 11.25,
    increments: {
      Aries: 508,
      Taurus: 560,
      Gemini: 632,
      Cancer: 660,
      Leo: 636,
      Virgo: 604,
    } as { [key: string]: number },
  },
  {
    lat: 12.083,
    increments: {
      Aries: 504,
      Taurus: 556,
      Gemini: 632,
      Cancer: 660,
      Leo: 640,
      Virgo: 608,
    } as { [key: string]: number },
  },
  {
    lat: 12.967,
    increments: {
      Aries: 500,
      Taurus: 554,
      Gemini: 630,
      Cancer: 662,
      Leo: 642,
      Virgo: 612,
    } as { [key: string]: number },
  },
  {
    lat: 13.283,
    increments: {
      Aries: 500,
      Taurus: 552,
      Gemini: 630,
      Cancer: 662,
      Leo: 644,
      Virgo: 612,
    } as { [key: string]: number },
  },
  {
    lat: 13.867,
    increments: {
      Aries: 496,
      Taurus: 550,
      Gemini: 628,
      Cancer: 664,
      Leo: 646,
      Virgo: 616,
    } as { [key: string]: number },
  },
  {
    lat: 14.6,
    increments: {
      Aries: 494,
      Taurus: 548,
      Gemini: 626,
      Cancer: 666,
      Leo: 648,
      Virgo: 618,
    } as { [key: string]: number },
  },
  {
    lat: 16.467,
    increments: {
      Aries: 486,
      Taurus: 542,
      Gemini: 624,
      Cancer: 668,
      Leo: 654,
      Virgo: 626,
    } as { [key: string]: number },
  },
  {
    lat: 18.2,
    increments: {
      Aries: 478,
      Taurus: 534,
      Gemini: 620,
      Cancer: 672,
      Leo: 662,
      Virgo: 634,
    } as { [key: string]: number },
  },
  {
    lat: 20.283,
    increments: {
      Aries: 468,
      Taurus: 528,
      Gemini: 616,
      Cancer: 676,
      Leo: 668,
      Virgo: 644,
    } as { [key: string]: number },
  },
  {
    lat: 21.983,
    increments: {
      Aries: 460,
      Taurus: 520,
      Gemini: 614,
      Cancer: 678,
      Leo: 676,
      Virgo: 652,
    } as { [key: string]: number },
  }, // Corrected for 21 59
  {
    lat: 22.05,
    increments: {
      Aries: 458,
      Taurus: 520,
      Gemini: 614,
      Cancer: 678,
      Leo: 676,
      Virgo: 654,
    } as { [key: string]: number },
  },
  {
    lat: 23.217,
    increments: {
      Aries: 454,
      Taurus: 516,
      Gemini: 610,
      Cancer: 681,
      Leo: 680,
      Virgo: 658,
    } as { [key: string]: number },
  },
  {
    lat: 27.6,
    increments: {
      Aries: 430,
      Taurus: 498,
      Gemini: 602,
      Cancer: 690,
      Leo: 698,
      Virgo: 682,
    } as { [key: string]: number },
  },
]
  .map((d) => {
    // Symmetrically populate the other 6 signs
    const fullIncrements = { ...d.increments };
    fullIncrements.Libra = d.increments.Virgo;
    fullIncrements.Scorpio = d.increments.Leo;
    fullIncrements.Sagittarius = d.increments.Cancer;
    fullIncrements.Capricorn = d.increments.Gemini;
    fullIncrements.Aquarius = d.increments.Taurus;
    fullIncrements.Pisces = d.increments.Aries;
    return { ...d, increments: fullIncrements };
  })
  .sort((a, b) => a.lat - b.lat);
