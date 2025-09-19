// app/lib/burmeseTimeUtils.ts - Ancient Burmese time conversion utilities

import { MachineTime, AncientBurmeseTime, SunHourUnit } from "./types";

export class BurmeseTimeUtils {
  /**
   * Convert Machine Time to Ancient Burmese Time Units (Takkala Time)
   * CORRECTED FORMULA: The issue was in the conversion ratio
   */
  static convertToAncientBurmeseTime(
    machineTime: MachineTime
  ): AncientBurmeseTime {
    // Convert machine time to total seconds
    const totalMachineSeconds =
      machineTime.hours * 3600 + machineTime.minutes * 60 + machineTime.seconds;

    // Apply the conversion formula: × 5 ÷ 2 = × 2.5
    const convertedSeconds = totalMachineSeconds * 2.5;

    // Ancient Burmese time conversion
    // 1 day = 60 Nari = 86400 standard seconds
    // So 1 Nari = 86400/60 = 1440 standard seconds = 24 standard minutes
    // After conversion: 1 Nari = 1440 * 2.5 = 3600 converted seconds

    const nariInConvertedSeconds = 3600; // 1 Nari = 3600 converted seconds
    const vizanaInConvertedSeconds = nariInConvertedSeconds / 60; // 1 Vizana = 60 converted seconds
    const kharaInConvertedSeconds = vizanaInConvertedSeconds / 60; // 1 Khara = 1 converted second

    const nari = Math.floor(convertedSeconds / nariInConvertedSeconds);
    const remainingAfterNari = convertedSeconds % nariInConvertedSeconds;

    const vizana = Math.floor(remainingAfterNari / vizanaInConvertedSeconds);
    const remainingAfterVizana = remainingAfterNari % vizanaInConvertedSeconds;

    const khara = Math.floor(remainingAfterVizana / kharaInConvertedSeconds);

    return {
      nari: nari,
      vizana: vizana,
      khara: khara,
    };
  }

  /**
   * Add Sun Hour Unit to Ancient Burmese Time (now with 4 units)
   */
  static addSunHourUnit(
    ancientTime: AncientBurmeseTime,
    sunHour: SunHourUnit
  ): AncientBurmeseTime {
    // Add the units starting from the smallest
    let totalAnukhara = (ancientTime.anukhara || 0) + sunHour.anukhara;
    let totalKhara = ancientTime.khara + sunHour.khara;
    let totalVizana = ancientTime.vizana + sunHour.vizana;
    let totalNari = ancientTime.nari + sunHour.nari;

    // Handle Anukhara overflow (60 Anukhara = 1 Khara)
    if (totalAnukhara >= 60) {
      totalKhara += Math.floor(totalAnukhara / 60);
      totalAnukhara = totalAnukhara % 60;
    }

    // Handle Khara overflow (60 Khara = 1 Vizana)
    if (totalKhara >= 60) {
      totalVizana += Math.floor(totalKhara / 60);
      totalKhara = totalKhara % 60;
    }

    // Handle Vizana overflow (60 Vizana = 1 Nari)
    if (totalVizana >= 60) {
      totalNari += Math.floor(totalVizana / 60);
      totalVizana = totalVizana % 60;
    }

    // Handle Nari overflow (60 Nari = 1 day, subtract 60 if >= 60)
    while (totalNari >= 60) {
      totalNari -= 60;
    }

    return {
      nari: totalNari,
      vizana: totalVizana,
      khara: totalKhara,
      anukhara: totalAnukhara,
    };
  }
}
