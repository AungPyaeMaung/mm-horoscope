// app/lib/time-converter.ts (Refactored - Main converter class)

import {
  BirthInfo,
  Location,
  SunHourUnit,
  TimeConversionResult,
} from "./types";
import { TimeUtils } from "./timeUtils";
import { BurmeseTimeUtils } from "./burmeseTimeUtils";
import { CoordinateUtils } from "./CoordinateUtils";

export class MyanmarVedicTimeConverter {
  /**
   * Convert coordinate input to decimal location
   */
  convertCoordinates = CoordinateUtils.convertCoordinates;

  /**
   * Get LMT offset in formatted structure
   */
  getLMTOffset = TimeUtils.getLMTOffset;

  /**
   * Convert birth time from MMT to Machine Time (LMT adjusted)
   */
  convertToMachineTime = TimeUtils.convertToMachineTime;

  /**
   * Convert Machine Time to Ancient Burmese Time Units
   */
  convertToAncientBurmeseTime = BurmeseTimeUtils.convertToAncientBurmeseTime;

  /**
   * Add Sun Hour Unit to Ancient Burmese Time
   */
  addSunHourUnit = BurmeseTimeUtils.addSunHourUnit;

  /**
   * Complete conversion process with optional Sun Hour Unit
   */
  fullConversion(
    birthInfo: BirthInfo,
    location: Location,
    sunHour?: SunHourUnit
  ): TimeConversionResult {
    const lmtOffset = this.getLMTOffset(location.longitude);
    const machineTime = this.convertToMachineTime(birthInfo, location);
    const ancientTime = this.convertToAncientBurmeseTime(machineTime);

    let finalTime;
    if (sunHour) {
      finalTime = this.addSunHourUnit(ancientTime, sunHour);
    }

    const originalTimeStr = `${birthInfo.hour}:${birthInfo.minute
      .toString()
      .padStart(2, "0")}:${(birthInfo.second || 0)
      .toString()
      .padStart(2, "0")} ${birthInfo.period}`;

    let description = `Original MMT: ${originalTimeStr}\n`;
    description += `LMT Offset: ${lmtOffset.hours}h ${lmtOffset.minutes}m ${lmtOffset.seconds}s ${lmtOffset.direction} of MMT\n`;
    description += `Machine Time: ${machineTime.hours}:${machineTime.minutes
      .toString()
      .padStart(2, "0")}:${machineTime.seconds.toString().padStart(2, "0")}\n`;
    description += `Ancient Burmese Time: ${ancientTime.nari} Nari ${ancientTime.vizana} Vizana ${ancientTime.khara} Khara`;

    if (sunHour && finalTime) {
      description += `\nSun Hour Unit: ${sunHour.nari} Nari ${sunHour.vizana} Vizana ${sunHour.khara} Khara ${sunHour.anukhara} Anukhara`;
      description += `\nFinal Time (Ancient + Sun Hour): ${
        finalTime.nari
      } Nari ${finalTime.vizana} Vizana ${finalTime.khara} Khara ${
        finalTime.anukhara || 0
      } Anukhara`;
    }

    return {
      originalMMT: originalTimeStr,
      lmtOffset: lmtOffset,
      machineTime: machineTime,
      ancientTime: ancientTime,
      sunHourUnit: sunHour,
      finalTime: finalTime,
      description: description,
    };
  }
}

// Re-export all types for convenience
export * from "./types";

// // app/lib/time-converter.ts

// // Types for the astrology app
// interface BirthInfo {
//   date: number;
//   month: number;
//   year: number;
//   hour: number;
//   minute: number;
//   second?: number;
//   period: "AM" | "PM";
// }

// interface CoordinateInput {
//   type: "decimal" | "dms"; // decimal or degree-minute-second
//   latitude: {
//     decimal?: number;
//     degrees?: number;
//     minutes?: number;
//     direction?: "N" | "S";
//   };
//   longitude: {
//     decimal?: number;
//     degrees?: number;
//     minutes?: number;
//     direction?: "E" | "W";
//   };
// }

// interface Location {
//   latitude: number;
//   longitude: number;
// }

// interface MachineTime {
//   hours: number;
//   minutes: number;
//   seconds: number;
// }

// interface AncientBurmeseTime {
//   nari: number;
//   vizana: number;
//   khara: number;
//   anukhara?: number;
// }

// interface SunHourUnit {
//   nari: number;
//   vizana: number;
//   khara: number;
//   anukhara: number;
// }

// interface AstronomicalPosition {
//   rasi: number;
//   amsa: number;
//   litta: number;
//   vilitta: number;
//   anulitta: number;
// }

// interface LocalLagStage {
//   stage: number;
//   stageName: string;
//   inputValue: number;
//   inputUnit: string;
//   subtractTime: AncientBurmeseTime;
//   resultTime: AncientBurmeseTime;
// }

// interface AyanaAmsa {
//   amsa: number;
//   litta: number;
// }

// interface LagCalculationResult {
//   finalTime: AncientBurmeseTime;
//   localLagStages: LocalLagStage[];
//   asuddhaLag: AstronomicalPosition;
//   ayanaAmsa?: AyanaAmsa;
//   suddhaLag?: AstronomicalPosition;
// }

// interface LMTOffset {
//   hours: number;
//   minutes: number;
//   seconds: number;
//   direction: "ahead" | "behind";
// }

// interface TimeConversionResult {
//   originalMMT: string;
//   lmtOffset: LMTOffset;
//   machineTime: MachineTime;
//   ancientTime: AncientBurmeseTime;
//   sunHourUnit?: SunHourUnit;
//   finalTime?: AncientBurmeseTime;
//   lagCalculation?: LagCalculationResult;
//   description: string;
// }

// export class MyanmarVedicTimeConverter {
//   // Myanmar Standard Time reference longitude
//   private static readonly MMT_LONGITUDE = 97.5; // 97°30′E

//   /**
//    * Convert DMS to decimal degrees
//    */
//   private dmsToDecimal(
//     degrees: number,
//     minutes: number,
//     direction: "N" | "S" | "E" | "W"
//   ): number {
//     let decimal = degrees + minutes / 60;
//     if (direction === "S" || direction === "W") {
//       decimal = -decimal;
//     }
//     return decimal;
//   }

//   /**
//    * Convert coordinate input to decimal location
//    */
//   convertCoordinates(coordInput: CoordinateInput): Location {
//     let latitude: number;
//     let longitude: number;

//     if (coordInput.type === "decimal") {
//       latitude = coordInput.latitude.decimal || 0;
//       longitude = coordInput.longitude.decimal || 0;
//     } else {
//       latitude = this.dmsToDecimal(
//         coordInput.latitude.degrees || 0,
//         coordInput.latitude.minutes || 0,
//         coordInput.latitude.direction || "N"
//       );
//       longitude = this.dmsToDecimal(
//         coordInput.longitude.degrees || 0,
//         coordInput.longitude.minutes || 0,
//         coordInput.longitude.direction || "E"
//       );
//     }

//     return { latitude, longitude };
//   }

//   /**
//    * Calculate Local Mean Time offset from Myanmar Standard Time
//    * Returns offset in total seconds for precision
//    */
//   private calculateLMTOffsetSeconds(longitude: number): number {
//     const longitudeDifference =
//       longitude - MyanmarVedicTimeConverter.MMT_LONGITUDE;
//     // 1 degree = 4 minutes = 240 seconds
//     return longitudeDifference * 240;
//   }

//   /**
//    * Convert seconds to hours, minutes, seconds format
//    */
//   private secondsToHMS(totalSeconds: number): {
//     hours: number;
//     minutes: number;
//     seconds: number;
//   } {
//     const absSeconds = Math.abs(totalSeconds);
//     const hours = Math.floor(absSeconds / 3600);
//     const minutes = Math.floor((absSeconds % 3600) / 60);
//     const seconds = Math.floor(absSeconds % 60);

//     return { hours, minutes, seconds };
//   }

//   /**
//    * Convert birth time from MMT to Machine Time (LMT adjusted)
//    */
//   convertToMachineTime(birthInfo: BirthInfo, location: Location): MachineTime {
//     // Convert to 24-hour format first
//     let hours = birthInfo.hour;
//     if (birthInfo.period === "PM" && hours !== 12) {
//       hours += 12;
//     } else if (birthInfo.period === "AM" && hours === 12) {
//       hours = 0;
//     }

//     // Calculate LMT offset in seconds
//     const lmtOffsetSeconds = this.calculateLMTOffsetSeconds(location.longitude);

//     // Convert birth time to total seconds
//     let totalSeconds =
//       hours * 3600 + birthInfo.minute * 60 + (birthInfo.second || 0);

//     // Apply LMT offset
//     totalSeconds += lmtOffsetSeconds;

//     // Handle day overflow/underflow (86400 seconds in a day)
//     while (totalSeconds >= 86400) {
//       totalSeconds -= 86400;
//     }
//     while (totalSeconds < 0) {
//       totalSeconds += 86400;
//     }

//     const machineHours = Math.floor(totalSeconds / 3600);
//     const machineMinutes = Math.floor((totalSeconds % 3600) / 60);
//     const machineSecondsRemainder = totalSeconds % 60;

//     return {
//       hours: machineHours,
//       minutes: machineMinutes,
//       seconds: machineSecondsRemainder,
//     };
//   }

//   /**
//    * Convert Machine Time to Ancient Burmese Time Units (Takkala Time)
//    * CORRECTED FORMULA: The issue was in the conversion ratio
//    */
//   convertToAncientBurmeseTime(machineTime: MachineTime): AncientBurmeseTime {
//     // Convert machine time to total seconds
//     const totalMachineSeconds =
//       machineTime.hours * 3600 + machineTime.minutes * 60 + machineTime.seconds;

//     // Apply the conversion formula: × 5 ÷ 2 = × 2.5
//     const convertedSeconds = totalMachineSeconds * 2.5;

//     // Ancient Burmese time conversion
//     // 1 day = 60 Nari = 86400 standard seconds
//     // So 1 Nari = 86400/60 = 1440 standard seconds = 24 standard minutes
//     // After conversion: 1 Nari = 1440 * 2.5 = 3600 converted seconds

//     const nariInConvertedSeconds = 3600; // 1 Nari = 3600 converted seconds
//     const vizanaInConvertedSeconds = nariInConvertedSeconds / 60; // 1 Vizana = 60 converted seconds
//     const kharaInConvertedSeconds = vizanaInConvertedSeconds / 60; // 1 Khara = 1 converted second

//     const nari = Math.floor(convertedSeconds / nariInConvertedSeconds);
//     const remainingAfterNari = convertedSeconds % nariInConvertedSeconds;

//     const vizana = Math.floor(remainingAfterNari / vizanaInConvertedSeconds);
//     const remainingAfterVizana = remainingAfterNari % vizanaInConvertedSeconds;

//     const khara = Math.floor(remainingAfterVizana / kharaInConvertedSeconds);

//     return {
//       nari: nari,
//       vizana: vizana,
//       khara: khara,
//       anukhara: 0,
//     };
//   }

//   /**
//    * Get LMT offset in formatted structure
//    */
//   getLMTOffset(longitude: number): LMTOffset {
//     const offsetSeconds = this.calculateLMTOffsetSeconds(longitude);
//     const hms = this.secondsToHMS(offsetSeconds);
//     const direction = offsetSeconds >= 0 ? "ahead" : "behind";

//     return {
//       hours: hms.hours,
//       minutes: hms.minutes,
//       seconds: hms.seconds,
//       direction: direction,
//     };
//   }

//   /**
//    * Add Sun Hour Unit to Ancient Burmese Time (now with 4 units)
//    */
//   addSunHourUnit(
//     ancientTime: AncientBurmeseTime,
//     sunHour: SunHourUnit
//   ): AncientBurmeseTime {
//     // Add the units starting from the smallest
//     let totalAnukhara = (ancientTime.anukhara || 0) + sunHour.anukhara;
//     let totalKhara = ancientTime.khara + sunHour.khara;
//     let totalVizana = ancientTime.vizana + sunHour.vizana;
//     let totalNari = ancientTime.nari + sunHour.nari;

//     // Handle Anukhara overflow (60 Anukhara = 1 Khara)
//     if (totalAnukhara >= 60) {
//       totalKhara += Math.floor(totalAnukhara / 60);
//       totalAnukhara = totalAnukhara % 60;
//     }

//     // Handle Khara overflow (60 Khara = 1 Vizana)
//     if (totalKhara >= 60) {
//       totalVizana += Math.floor(totalKhara / 60);
//       totalKhara = totalKhara % 60;
//     }

//     // Handle Vizana overflow (60 Vizana = 1 Nari)
//     if (totalVizana >= 60) {
//       totalNari += Math.floor(totalVizana / 60);
//       totalVizana = totalVizana % 60;
//     }

//     // Handle Nari overflow (60 Nari = 1 day, subtract 60 if >= 60)
//     while (totalNari >= 60) {
//       totalNari -= 60;
//     }

//     return {
//       nari: totalNari,
//       vizana: totalVizana,
//       khara: totalKhara,
//       anukhara: totalAnukhara,
//     };
//   }

//   /**
//    * Subtract time units with proper borrowing
//    */
//   private subtractTime(
//     fromTime: AncientBurmeseTime,
//     subtractTime: AncientBurmeseTime
//   ): AncientBurmeseTime {
//     let nari = fromTime.nari;
//     let vizana = fromTime.vizana;
//     let khara = fromTime.khara;
//     let anukhara = fromTime.anukhara || 0;

//     let subNari = subtractTime.nari;
//     let subVizana = subtractTime.vizana;
//     let subKhara = subtractTime.khara;
//     let subAnukhara = subtractTime.anukhara || 0;

//     // Subtract Anukhara
//     if (anukhara < subAnukhara) {
//       khara -= 1;
//       anukhara += 60;
//     }
//     anukhara -= subAnukhara;

//     // Subtract Khara
//     if (khara < subKhara) {
//       vizana -= 1;
//       khara += 60;
//     }
//     khara -= subKhara;

//     // Subtract Vizana
//     if (vizana < subVizana) {
//       nari -= 1;
//       vizana += 60;
//     }
//     vizana -= subVizana;

//     // Subtract Nari
//     if (nari < subNari) {
//       // Borrow from next day
//       nari += 60;
//     }
//     nari -= subNari;

//     return {
//       nari: Math.max(0, nari),
//       vizana: Math.max(0, vizana),
//       khara: Math.max(0, khara),
//       anukhara: Math.max(0, anukhara),
//     };
//   }

//   /**
//    * Subtract Ayana Amsa from Asuddha Lag to get Suddha Lag
//    */
//   private subtractAyanaAmsa(
//     asuddhaLag: AstronomicalPosition,
//     ayanaAmsa: AyanaAmsa
//   ): AstronomicalPosition {
//     let rasi = asuddhaLag.rasi;
//     let amsa = asuddhaLag.amsa;
//     let litta = asuddhaLag.litta;
//     let vilitta = asuddhaLag.vilitta;
//     let anulitta = asuddhaLag.anulitta;

//     // Subtract Litta
//     if (litta < ayanaAmsa.litta) {
//       amsa -= 1;
//       litta += 60;
//     }
//     litta -= ayanaAmsa.litta;

//     // Subtract Amsa
//     if (amsa < ayanaAmsa.amsa) {
//       rasi -= 1;
//       amsa += 30; // 1 Rasi = 30 Amsa
//     }
//     amsa -= ayanaAmsa.amsa;

//     return {
//       rasi: Math.max(0, rasi),
//       amsa: Math.max(0, amsa),
//       litta,
//       vilitta,
//       anulitta,
//     };
//   }

//   /**
//    * Calculate Lag (Ascendant) with all stages
//    */
//   calculateLag(
//     finalTime: AncientBurmeseTime,
//     localLagData: any,
//     ayanaAmsa?: AyanaAmsa
//   ): LagCalculationResult {
//     const stages: LocalLagStage[] = [];
//     let currentTime = { ...finalTime };

//     // Stage 1: Rasi subtraction
//     const stage1SubtractTime = {
//       nari: localLagData.rasiNari,
//       vizana: localLagData.rasiVizana,
//       khara: 0,
//       anukhara: 0,
//     };
//     currentTime = this.subtractTime(currentTime, stage1SubtractTime);
//     stages.push({
//       stage: 1,
//       stageName: "Rasi",
//       inputValue: localLagData.rasi,
//       inputUnit: "Rasi",
//       subtractTime: stage1SubtractTime,
//       resultTime: { ...currentTime },
//     });

//     // Stage 2: Amsa subtraction
//     const stage2SubtractTime = {
//       nari: localLagData.amsaNari,
//       vizana: localLagData.amsaVizana,
//       khara: localLagData.amsaKhara,
//       anukhara: 0,
//     };
//     currentTime = this.subtractTime(currentTime, stage2SubtractTime);
//     stages.push({
//       stage: 2,
//       stageName: "Amsa",
//       inputValue: localLagData.amsa,
//       inputUnit: "Amsa",
//       subtractTime: stage2SubtractTime,
//       resultTime: { ...currentTime },
//     });

//     // Stage 3: Litta subtraction
//     const stage3SubtractTime = {
//       nari: 0,
//       vizana: localLagData.littaVizana,
//       khara: localLagData.littaKhara,
//       anukhara: localLagData.littaAnukhara,
//     };
//     currentTime = this.subtractTime(currentTime, stage3SubtractTime);
//     stages.push({
//       stage: 3,
//       stageName: "Litta",
//       inputValue: localLagData.litta,
//       inputUnit: "Litta",
//       subtractTime: stage3SubtractTime,
//       resultTime: { ...currentTime },
//     });

//     // Stage 4: Vilitta subtraction
//     const stage4SubtractTime = {
//       nari: 0,
//       vizana: 0,
//       khara: localLagData.vilittaKhara,
//       anukhara: localLagData.vilittaAnukhara,
//     };
//     currentTime = this.subtractTime(currentTime, stage4SubtractTime);
//     stages.push({
//       stage: 4,
//       stageName: "Vilitta",
//       inputValue: localLagData.vilitta,
//       inputUnit: "Vilitta",
//       subtractTime: stage4SubtractTime,
//       resultTime: { ...currentTime },
//     });

//     // Stage 5: Anulitta subtraction
//     const stage5SubtractTime = {
//       nari: 0,
//       vizana: 0,
//       khara: 0,
//       anukhara: localLagData.anulittaAnukhara,
//     };
//     currentTime = this.subtractTime(currentTime, stage5SubtractTime);
//     stages.push({
//       stage: 5,
//       stageName: "Anulitta",
//       inputValue: localLagData.anulitta,
//       inputUnit: "Anulitta",
//       subtractTime: stage5SubtractTime,
//       resultTime: { ...currentTime },
//     });

//     // Calculate Asuddha Lag
//     const asuddhaLag: AstronomicalPosition = {
//       rasi: localLagData.rasi,
//       amsa: localLagData.amsa,
//       litta: localLagData.litta,
//       vilitta: localLagData.vilitta,
//       anulitta: localLagData.anulitta,
//     };

//     // Calculate Suddha Lag if Ayana Amsa is provided
//     let suddhaLag: AstronomicalPosition | undefined;
//     if (ayanaAmsa) {
//       suddhaLag = this.subtractAyanaAmsa(asuddhaLag, ayanaAmsa);
//     }

//     return {
//       finalTime,
//       localLagStages: stages,
//       asuddhaLag,
//       ayanaAmsa,
//       suddhaLag,
//     };
//   }

//   /**
//    * Complete conversion process with optional Sun Hour Unit and Lag calculation
//    */
//   fullConversion(
//     birthInfo: BirthInfo,
//     location: Location,
//     sunHour?: SunHourUnit,
//     localLagData?: any,
//     ayanaAmsa?: AyanaAmsa
//   ): TimeConversionResult {
//     const lmtOffset = this.getLMTOffset(location.longitude);
//     const machineTime = this.convertToMachineTime(birthInfo, location);
//     const ancientTime = this.convertToAncientBurmeseTime(machineTime);

//     let finalTime: AncientBurmeseTime | undefined;
//     if (sunHour) {
//       finalTime = this.addSunHourUnit(ancientTime, sunHour);
//     }

//     let lagCalculation: LagCalculationResult | undefined;
//     if (finalTime && localLagData) {
//       lagCalculation = this.calculateLag(finalTime, localLagData, ayanaAmsa);
//     }

//     const originalTimeStr = `${birthInfo.hour}:${birthInfo.minute
//       .toString()
//       .padStart(2, "0")}:${(birthInfo.second || 0)
//       .toString()
//       .padStart(2, "0")} ${birthInfo.period}`;

//     let description = `Original MMT: ${originalTimeStr}\n`;
//     description += `LMT Offset: ${lmtOffset.hours}h ${lmtOffset.minutes}m ${lmtOffset.seconds}s ${lmtOffset.direction} of MMT\n`;
//     description += `Machine Time: ${machineTime.hours}:${machineTime.minutes
//       .toString()
//       .padStart(2, "0")}:${machineTime.seconds.toString().padStart(2, "0")}\n`;
//     description += `Ancient Burmese Time: ${ancientTime.nari} Nari ${ancientTime.vizana} Vizana ${ancientTime.khara} Khara`;

//     if (sunHour && finalTime) {
//       description += `\nSun Hour Unit: ${sunHour.nari} Nari ${sunHour.vizana} Vizana ${sunHour.khara} Khara ${sunHour.anukhara} Anukhara`;
//       description += `\nFinal Time (Ancient + Sun Hour): ${
//         finalTime.nari
//       } Nari ${finalTime.vizana} Vizana ${finalTime.khara} Khara ${
//         finalTime.anukhara || 0
//       } Anukhara`;
//     }

//     if (lagCalculation) {
//       description += `\nAsuddha Lag: ${lagCalculation.asuddhaLag.rasi} Rasi ${lagCalculation.asuddhaLag.amsa} Amsa ${lagCalculation.asuddhaLag.litta} Litta ${lagCalculation.asuddhaLag.vilitta} Vilitta ${lagCalculation.asuddhaLag.anulitta} Anulitta`;
//       if (lagCalculation.suddhaLag) {
//         description += `\nSuddha Lag: ${lagCalculation.suddhaLag.rasi} Rasi ${lagCalculation.suddhaLag.amsa} Amsa ${lagCalculation.suddhaLag.litta} Litta ${lagCalculation.suddhaLag.vilitta} Vilitta ${lagCalculation.suddhaLag.anulitta} Anulitta`;
//       }
//     }

//     return {
//       originalMMT: originalTimeStr,
//       lmtOffset: lmtOffset,
//       machineTime: machineTime,
//       ancientTime: ancientTime,
//       sunHourUnit: sunHour,
//       finalTime: finalTime,
//       lagCalculation: lagCalculation,
//       description: description,
//     };
//   }
// }

// export type {
//   BirthInfo,
//   CoordinateInput,
//   Location,
//   MachineTime,
//   AncientBurmeseTime,
//   SunHourUnit,
//   AstronomicalPosition,
//   LocalLagStage,
//   AyanaAmsa,
//   LagCalculationResult,
//   LMTOffset,
//   TimeConversionResult,
// };
