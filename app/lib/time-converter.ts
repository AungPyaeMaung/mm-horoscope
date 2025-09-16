// Types for the astrology app
interface BirthInfo {
  date: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  second?: number;
  period: "AM" | "PM";
}

interface CoordinateInput {
  type: "decimal" | "dms"; // decimal or degree-minute-second
  latitude: {
    decimal?: number;
    degrees?: number;
    minutes?: number;
    direction?: "N" | "S";
  };
  longitude: {
    decimal?: number;
    degrees?: number;
    minutes?: number;
    direction?: "E" | "W";
  };
}

interface Location {
  latitude: number;
  longitude: number;
}

interface MachineTime {
  hours: number;
  minutes: number;
  seconds: number;
}

interface AncientBurmeseTime {
  nari: number;
  vizana: number;
  khara: number;
  anukhara?: number;
}

interface LMTOffset {
  hours: number;
  minutes: number;
  seconds: number;
  direction: "ahead" | "behind";
}

interface SunHourUnit {
  nari: number;
  vizana: number;
  khara: number;
}

interface TimeConversionResult {
  originalMMT: string;
  lmtOffset: LMTOffset;
  machineTime: MachineTime;
  ancientTime: AncientBurmeseTime;
  sunHourUnit?: SunHourUnit;
  finalTime?: AncientBurmeseTime;
  description: string;
}

export class MyanmarVedicTimeConverter {
  // Myanmar Standard Time reference longitude
  private static readonly MMT_LONGITUDE = 97.5; // 97°30′E

  /**
   * Convert DMS to decimal degrees
   */
  private dmsToDecimal(
    degrees: number,
    minutes: number,
    direction: "N" | "S" | "E" | "W"
  ): number {
    let decimal = degrees + minutes / 60;
    if (direction === "S" || direction === "W") {
      decimal = -decimal;
    }
    return decimal;
  }

  /**
   * Convert coordinate input to decimal location
   */
  convertCoordinates(coordInput: CoordinateInput): Location {
    let latitude: number;
    let longitude: number;

    if (coordInput.type === "decimal") {
      latitude = coordInput.latitude.decimal || 0;
      longitude = coordInput.longitude.decimal || 0;
    } else {
      latitude = this.dmsToDecimal(
        coordInput.latitude.degrees || 0,
        coordInput.latitude.minutes || 0,
        coordInput.latitude.direction || "N"
      );
      longitude = this.dmsToDecimal(
        coordInput.longitude.degrees || 0,
        coordInput.longitude.minutes || 0,
        coordInput.longitude.direction || "E"
      );
    }

    return { latitude, longitude };
  }

  /**
   * Calculate Local Mean Time offset from Myanmar Standard Time
   * Returns offset in total seconds for precision
   */
  private calculateLMTOffsetSeconds(longitude: number): number {
    const longitudeDifference =
      longitude - MyanmarVedicTimeConverter.MMT_LONGITUDE;
    // 1 degree = 4 minutes = 240 seconds
    return longitudeDifference * 240;
  }

  /**
   * Convert seconds to hours, minutes, seconds format
   */
  private secondsToHMS(totalSeconds: number): {
    hours: number;
    minutes: number;
    seconds: number;
  } {
    const absSeconds = Math.abs(totalSeconds);
    const hours = Math.floor(absSeconds / 3600);
    const minutes = Math.floor((absSeconds % 3600) / 60);
    const seconds = Math.floor(absSeconds % 60);

    return { hours, minutes, seconds };
  }

  /**
   * Convert birth time from MMT to Machine Time (LMT adjusted)
   */
  convertToMachineTime(birthInfo: BirthInfo, location: Location): MachineTime {
    // Convert to 24-hour format first
    let hours = birthInfo.hour;
    if (birthInfo.period === "PM" && hours !== 12) {
      hours += 12;
    } else if (birthInfo.period === "AM" && hours === 12) {
      hours = 0;
    }

    // Calculate LMT offset in seconds
    const lmtOffsetSeconds = this.calculateLMTOffsetSeconds(location.longitude);

    // Convert birth time to total seconds
    let totalSeconds =
      hours * 3600 + birthInfo.minute * 60 + (birthInfo.second || 0);

    // Apply LMT offset
    totalSeconds += lmtOffsetSeconds;

    // Handle day overflow/underflow (86400 seconds in a day)
    while (totalSeconds >= 86400) {
      totalSeconds -= 86400;
    }
    while (totalSeconds < 0) {
      totalSeconds += 86400;
    }

    const machineHours = Math.floor(totalSeconds / 3600);
    const machineMinutes = Math.floor((totalSeconds % 3600) / 60);
    const machineSecondsRemainder = totalSeconds % 60;

    return {
      hours: machineHours,
      minutes: machineMinutes,
      seconds: machineSecondsRemainder,
    };
  }

  /**
   * Convert Machine Time to Ancient Burmese Time Units (Takkala Time)
   * CORRECTED FORMULA: The issue was in the conversion ratio
   */
  convertToAncientBurmeseTime(machineTime: MachineTime): AncientBurmeseTime {
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
   * Get LMT offset in formatted structure
   */
  getLMTOffset(longitude: number): LMTOffset {
    const offsetSeconds = this.calculateLMTOffsetSeconds(longitude);
    const hms = this.secondsToHMS(offsetSeconds);
    const direction = offsetSeconds >= 0 ? "ahead" : "behind";

    return {
      hours: hms.hours,
      minutes: hms.minutes,
      seconds: hms.seconds,
      direction: direction,
    };
  }

  /**
   * Add Sun Hour Unit to Ancient Burmese Time
   */
  addSunHourUnit(
    ancientTime: AncientBurmeseTime,
    sunHour: SunHourUnit
  ): AncientBurmeseTime {
    // Add the units starting from the smallest
    let totalKhara = ancientTime.khara + sunHour.khara;
    let totalVizana = ancientTime.vizana + sunHour.vizana;
    let totalNari = ancientTime.nari + sunHour.nari;

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
    };
  }

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

    let finalTime: AncientBurmeseTime | undefined;
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
      description += `\nSun Hour Unit: ${sunHour.nari} Nari ${sunHour.vizana} Vizana ${sunHour.khara} Khara`;
      description += `\nFinal Time (Ancient + Sun Hour): ${finalTime.nari} Nari ${finalTime.vizana} Vizana ${finalTime.khara} Khara`;
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

export type {
  BirthInfo,
  CoordinateInput,
  Location,
  MachineTime,
  AncientBurmeseTime,
  SunHourUnit,
  LMTOffset,
  TimeConversionResult,
};
