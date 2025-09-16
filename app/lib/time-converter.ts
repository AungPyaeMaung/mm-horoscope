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

interface TimeConversionResult {
  originalMMT: string;
  lmtOffset: number; // in minutes
  machineTime: MachineTime;
  ancientTime: AncientBurmeseTime;
  description: string;
}

export class MyanmarVedicTimeConverter {
  // Myanmar Standard Time reference longitude
  private static readonly MMT_LONGITUDE = 97.5; // 97°30′E

  /**
   * Calculate Local Mean Time offset from Myanmar Standard Time
   * @param longitude - Location longitude in decimal degrees
   * @returns Offset in minutes (positive = ahead of MMT, negative = behind MMT)
   */
  private calculateLMTOffset(longitude: number): number {
    const longitudeDifference =
      longitude - MyanmarVedicTimeConverter.MMT_LONGITUDE;
    // 1 degree = 4 minutes of time
    return longitudeDifference * 4;
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

    // Calculate LMT offset
    const lmtOffsetMinutes = this.calculateLMTOffset(location.longitude);

    // Apply LMT offset
    let totalMinutes = hours * 60 + birthInfo.minute + lmtOffsetMinutes;
    const totalSeconds = birthInfo.second || 0;

    // Handle day overflow/underflow
    while (totalMinutes >= 1440) {
      // 24 * 60
      totalMinutes -= 1440;
    }
    while (totalMinutes < 0) {
      totalMinutes += 1440;
    }

    const machineHours = Math.floor(totalMinutes / 60);
    const machineMinutes = totalMinutes % 60;

    return {
      hours: machineHours,
      minutes: machineMinutes,
      seconds: totalSeconds,
    };
  }

  /**
   * Convert Machine Time to Ancient Burmese Time Units (Takkala Time)
   */
  convertToAncientBurmeseTime(machineTime: MachineTime): AncientBurmeseTime {
    // Convert everything to seconds first
    const totalSeconds =
      machineTime.hours * 3600 + machineTime.minutes * 60 + machineTime.seconds;

    // Apply the conversion formula: × 5 ÷ 2
    const convertedSeconds = (totalSeconds * 5) / 2;

    const nariSeconds = 1440; // 24 minutes × 60 seconds
    const vizanaSeconds = nariSeconds / 60; // 24 seconds
    const kharaSeconds = vizanaSeconds / 60; // 0.4 seconds

    const nari = Math.floor(convertedSeconds / nariSeconds);
    const remainingAfterNari = convertedSeconds % nariSeconds;

    const vizana = Math.floor(remainingAfterNari / vizanaSeconds);
    const remainingAfterVizana = remainingAfterNari % vizanaSeconds;

    const khara = Math.floor(remainingAfterVizana / kharaSeconds);

    return {
      nari: nari,
      vizana: vizana,
      khara: khara,
    };
  }

  /**
   * Complete conversion process
   */
  fullConversion(
    birthInfo: BirthInfo,
    location: Location
  ): TimeConversionResult {
    const lmtOffset = this.calculateLMTOffset(location.longitude);
    const machineTime = this.convertToMachineTime(birthInfo, location);
    const ancientTime = this.convertToAncientBurmeseTime(machineTime);

    const originalTimeStr = `${birthInfo.hour}:${birthInfo.minute
      .toString()
      .padStart(2, "0")}:${(birthInfo.second || 0)
      .toString()
      .padStart(2, "0")} ${birthInfo.period}`;

    let description = `Original MMT: ${originalTimeStr}\n`;
    description += `Longitude: ${location.longitude}° (${
      lmtOffset >= 0 ? "ahead of" : "behind"
    } MMT by ${Math.abs(lmtOffset)} minutes)\n`;
    description += `Machine Time: ${machineTime.hours}:${machineTime.minutes
      .toString()
      .padStart(2, "0")}:${machineTime.seconds.toString().padStart(2, "0")}\n`;
    description += `Ancient Burmese Time: ${ancientTime.nari} Nari ${ancientTime.vizana} Vizana ${ancientTime.khara} Khara`;

    return {
      originalMMT: originalTimeStr,
      lmtOffset: lmtOffset,
      machineTime: machineTime,
      ancientTime: ancientTime,
      description: description,
    };
  }
}

export type {
  BirthInfo,
  Location,
  MachineTime,
  AncientBurmeseTime,
  TimeConversionResult,
};
