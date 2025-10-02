// lib/astrology.ts
import { BirthInfo, LocationInfo, BurmeseTime, AsuddhaLagna } from "./types";

// --- CONSTANTS ---
const MYANMAR_STANDARD_MERIDIAN = 97.5; // 97° 30'
const DEG_TO_SECONDS_TIME = 240; // 1 degree of longitude = 4 minutes = 240 seconds

// Conversion factors for Burmese Time
const NARI_IN_DAY = 60;
const VIZANA_IN_NARI = 60;
const KHARA_IN_VIZANA = 60;
const VIKHARA_IN_KHARA = 60;
const ANUKHARA_IN_VIKHARA = 60;
const PRAMANUKHARA_IN_ANUKHARA = 60;
const TADANUKHARA_IN_PRAMANUKHARA = 60;

// --- UTILITY FUNCTIONS FOR BURMESE TIME ---

/**
 * Converts a BurmeseTime object to a single total in the smallest unit (Tadanukhara).
 */
function toTotalTadanukhara(time: BurmeseTime): number {
  let total = time.tadanukhara;
  total += time.pramanukhara * TADANUKHARA_IN_PRAMANUKHARA;
  total +=
    time.anukhara * TADANUKHARA_IN_PRAMANUKHARA * PRAMANUKHARA_IN_ANUKHARA;
  total +=
    time.vikhara *
    TADANUKHARA_IN_PRAMANUKHARA *
    PRAMANUKHARA_IN_ANUKHARA *
    ANUKHARA_IN_VIKHARA;
  total +=
    time.khara *
    TADANUKHARA_IN_PRAMANUKHARA *
    PRAMANUKHARA_IN_ANUKHARA *
    ANUKHARA_IN_VIKHARA *
    VIKHARA_IN_KHARA;
  total +=
    time.vizana *
    TADANUKHARA_IN_PRAMANUKHARA *
    PRAMANUKHARA_IN_ANUKHARA *
    ANUKHARA_IN_VIKHARA *
    VIKHARA_IN_KHARA *
    KHARA_IN_VIZANA;
  total +=
    time.nari *
    TADANUKHARA_IN_PRAMANUKHARA *
    PRAMANUKHARA_IN_ANUKHARA *
    ANUKHARA_IN_VIKHARA *
    VIKHARA_IN_KHARA *
    KHARA_IN_VIZANA *
    VIZANA_IN_NARI;
  return total;
}

/**
 * Converts a total number of Tadanukhara back into a BurmeseTime object.
 */
function fromTotalTadanukhara(total: number): BurmeseTime {
  const time: BurmeseTime = {
    nari: 0,
    vizana: 0,
    khara: 0,
    vikhara: 0,
    anukhara: 0,
    pramanukhara: 0,
    tadanukhara: 0,
  };

  let remainder = Math.round(total);

  time.nari = Math.floor(
    remainder /
      (VIZANA_IN_NARI *
        KHARA_IN_VIZANA *
        VIKHARA_IN_KHARA *
        ANUKHARA_IN_VIKHARA *
        PRAMANUKHARA_IN_ANUKHARA *
        TADANUKHARA_IN_PRAMANUKHARA)
  );
  remainder %=
    VIZANA_IN_NARI *
    KHARA_IN_VIZANA *
    VIKHARA_IN_KHARA *
    ANUKHARA_IN_VIKHARA *
    PRAMANUKHARA_IN_ANUKHARA *
    TADANUKHARA_IN_PRAMANUKHARA;

  time.vizana = Math.floor(
    remainder /
      (KHARA_IN_VIZANA *
        VIKHARA_IN_KHARA *
        ANUKHARA_IN_VIKHARA *
        PRAMANUKHARA_IN_ANUKHARA *
        TADANUKHARA_IN_PRAMANUKHARA)
  );
  remainder %=
    KHARA_IN_VIZANA *
    VIKHARA_IN_KHARA *
    ANUKHARA_IN_VIKHARA *
    PRAMANUKHARA_IN_ANUKHARA *
    TADANUKHARA_IN_PRAMANUKHARA;

  time.khara = Math.floor(
    remainder /
      (VIKHARA_IN_KHARA *
        ANUKHARA_IN_VIKHARA *
        PRAMANUKHARA_IN_ANUKHARA *
        TADANUKHARA_IN_PRAMANUKHARA)
  );
  remainder %=
    VIKHARA_IN_KHARA *
    ANUKHARA_IN_VIKHARA *
    PRAMANUKHARA_IN_ANUKHARA *
    TADANUKHARA_IN_PRAMANUKHARA;

  time.vikhara = Math.floor(
    remainder /
      (ANUKHARA_IN_VIKHARA *
        PRAMANUKHARA_IN_ANUKHARA *
        TADANUKHARA_IN_PRAMANUKHARA)
  );
  remainder %=
    ANUKHARA_IN_VIKHARA *
    PRAMANUKHARA_IN_ANUKHARA *
    TADANUKHARA_IN_PRAMANUKHARA;

  time.anukhara = Math.floor(
    remainder / (PRAMANUKHARA_IN_ANUKHARA * TADANUKHARA_IN_PRAMANUKHARA)
  );
  remainder %= PRAMANUKHARA_IN_ANUKHARA * TADANUKHARA_IN_PRAMANUKHARA;

  time.pramanukhara = Math.floor(remainder / TADANUKHARA_IN_PRAMANUKHARA);
  time.tadanukhara = remainder % TADANUKHARA_IN_PRAMANUKHARA;

  return time;
}

/**
 * Adds two BurmeseTime objects.
 */
function addBurmeseTimes(t1: BurmeseTime, t2: BurmeseTime): BurmeseTime {
  const total1 = toTotalTadanukhara(t1);
  const total2 = toTotalTadanukhara(t2);
  return fromTotalTadanukhara(total1 + total2);
}

/**
 * Subtracts the second BurmeseTime object from the first.
 */
function subtractBurmeseTimes(t1: BurmeseTime, t2: BurmeseTime): BurmeseTime {
  const total1 = toTotalTadanukhara(t1);
  const total2 = toTotalTadanukhara(t2);
  return fromTotalTadanukhara(total1 - total2);
}

/**
 * Calculates the Local Mean Time (LMT) and converts it to Takkala Time.
 */
function calculateTakkalaTime(
  birthInfo: BirthInfo,
  location: LocationInfo
): BurmeseTime {
  // 1. Convert longitude to decimal
  const longitudeDecimal =
    location.longitude.degrees + location.longitude.minutes / 60;

  // 2. Calculate LMT difference from MMT
  const longitudeDiff = Math.abs(longitudeDecimal - MYANMAR_STANDARD_MERIDIAN);
  const timeDiffInSeconds = longitudeDiff * DEG_TO_SECONDS_TIME;

  // 3. Convert birth time (MMT) to 24-hour format in seconds from midnight
  let hours24 = birthInfo.hours;
  if (birthInfo.period === "PM" && hours24 !== 12) {
    hours24 += 12;
  } else if (birthInfo.period === "AM" && hours24 === 12) {
    hours24 = 0; // Midnight
  }
  const mmtInSeconds =
    hours24 * 3600 + birthInfo.minutes * 60 + birthInfo.seconds;

  // 4. Calculate Machine Time (Actual LMT)
  let machineTimeInSeconds: number;
  if (longitudeDecimal < MYANMAR_STANDARD_MERIDIAN) {
    // West: LMT is behind MMT
    machineTimeInSeconds = mmtInSeconds - timeDiffInSeconds;
  } else {
    // East or same: LMT is ahead of MMT
    machineTimeInSeconds = mmtInSeconds + timeDiffInSeconds;
  }

  // 5. Convert Machine Time to Ancient Burmese Time Unit (Takkala)
  // 1 day = 24 hours = 60 Nari. So, 1 hour = 2.5 Nari.
  // Takkala Seconds = Machine Seconds * (60 Nari / 24 hours) = Machine Seconds * 2.5
  const takkalaTimeInSecondsEquivalent = machineTimeInSeconds * 2.5;

  // We need to convert this to our detailed BurmeseTime format.
  // 1 Nari = (24/60) hours = 0.4 hours = 1440 seconds.
  const totalNari = takkalaTimeInSecondsEquivalent / 1440;
  const nari = Math.floor(totalNari);
  const vizanaRemainder = (totalNari - nari) * VIZANA_IN_NARI;
  const vizana = Math.floor(vizanaRemainder);
  const kharaRemainder = (vizanaRemainder - vizana) * KHARA_IN_VIZANA;
  const khara = Math.floor(kharaRemainder);
  // ... and so on for smaller units if precision is needed.

  return {
    nari,
    vizana,
    khara,
    vikhara: 0,
    anukhara: 0,
    pramanukhara: 0,
    tadanukhara: 0,
  };
}
