// app/lib/lagUtils.ts - Lag calculation utilities

import { AncientBurmeseTime } from "./types";
import { AstronomicalPosition, LagStageResult, AyanaAmsa } from "./lagTypes";

export class LagUtils {
  /**
   * Subtract time with proper borrowing including Anuvikhara
   */
  static subtractTimeWithAnuvikhara(
    fromTime: AncientBurmeseTime & { anuvikhara?: number },
    subtractTime: AncientBurmeseTime & { anuvikhara?: number }
  ): AncientBurmeseTime & { anuvikhara?: number } {
    let nari = fromTime.nari;
    let vizana = fromTime.vizana;
    let khara = fromTime.khara;
    let anukhara = fromTime.anukhara || 0;
    let anuvikhara = fromTime.anuvikhara || 0;

    const subNari = subtractTime.nari;
    const subVizana = subtractTime.vizana;
    const subKhara = subtractTime.khara;
    const subAnukhara = subtractTime.anukhara || 0;
    const subAnuvikhara = subtractTime.anuvikhara || 0;

    // Subtract Anuvikhara (60 Anuvikhara = 1 Anukhara)
    if (anuvikhara < subAnuvikhara) {
      anukhara -= 1;
      anuvikhara += 60;
    }
    anuvikhara -= subAnuvikhara;

    // Subtract Anukhara (60 Anukhara = 1 Khara)
    if (anukhara < subAnukhara) {
      khara -= 1;
      anukhara += 60;
    }
    anukhara -= subAnukhara;

    // Subtract Khara (60 Khara = 1 Vizana)
    if (khara < subKhara) {
      vizana -= 1;
      khara += 60;
    }
    khara -= subKhara;

    // Subtract Vizana (60 Vizana = 1 Nari)
    if (vizana < subVizana) {
      nari -= 1;
      vizana += 60;
    }
    vizana -= subVizana;

    // Subtract Nari (handle day borrowing if needed)
    if (nari < subNari) {
      nari += 60; // Borrow from day
    }
    nari -= subNari;

    return {
      nari: Math.max(0, nari),
      vizana: Math.max(0, vizana),
      khara: Math.max(0, khara),
      anukhara: Math.max(0, anukhara),
      anuvikhara: Math.max(0, anuvikhara),
    };
  }

  /**
   * Calculate single lag stage
   */
  static calculateLagStage(
    currentTime: AncientBurmeseTime & { anuvikhara?: number },
    stage: number,
    stageValue: number,
    subtractTime: AncientBurmeseTime & { anuvikhara?: number }
  ): LagStageResult {
    const stageNames = ["", "Rasi", "Amsa", "Litta", "Vilitta", "Anulitta"];
    const stageUnits = ["", "Rasi", "Amsa", "Litta", "Vilitta", "Anulitta"];

    const resultTime = LagUtils.subtractTimeWithAnuvikhara(
      currentTime,
      subtractTime
    );

    return {
      stage,
      stageName: stageNames[stage],
      inputValue: stageValue,
      inputUnit: stageUnits[stage],
      subtractTime,
      resultTime,
    };
  }

  /**
   * Subtract Ayana Amsa from Asuddha Lag to get Suddha Lag
   */
  static subtractAyanaAmsa(
    asuddhaLag: AstronomicalPosition,
    ayanaAmsa: AyanaAmsa
  ): AstronomicalPosition {
    let rasi = asuddhaLag.rasi;
    let amsa = asuddhaLag.amsa;
    let litta = asuddhaLag.litta;
    const vilitta = asuddhaLag.vilitta;
    const anulitta = asuddhaLag.anulitta;

    // Subtract Litta (60 Litta = 1 Amsa)
    if (litta < ayanaAmsa.litta) {
      amsa -= 1;
      litta += 60;
    }
    litta -= ayanaAmsa.litta;

    // Subtract Amsa (30 Amsa = 1 Rasi)
    if (amsa < ayanaAmsa.amsa) {
      rasi -= 1;
      amsa += 30;
    }
    amsa -= ayanaAmsa.amsa;

    return {
      rasi: Math.max(0, rasi),
      amsa: Math.max(0, amsa),
      litta: Math.max(0, litta),
      vilitta,
      anulitta,
    };
  }

  /**
   * Format time display
   */
  static formatTime(
    time: AncientBurmeseTime & { anuvikhara?: number }
  ): string {
    const parts = [];
    if (time.nari > 0) parts.push(`${time.nari}N`);
    if (time.vizana > 0) parts.push(`${time.vizana}V`);
    if (time.khara > 0) parts.push(`${time.khara}K`);
    if ((time.anukhara || 0) > 0) parts.push(`${time.anukhara}A`);
    if ((time.anuvikhara || 0) > 0) parts.push(`${time.anuvikhara}Av`);

    return parts.length > 0 ? parts.join(" ") : "0";
  }

  /**
   * Format astronomical position
   */
  static formatAstronomicalPosition(position: AstronomicalPosition): string {
    return `${position.rasi} Rasi ${position.amsa} Amsa ${position.litta} Litta ${position.vilitta} Vilitta ${position.anulitta} Anulitta`;
  }
}
