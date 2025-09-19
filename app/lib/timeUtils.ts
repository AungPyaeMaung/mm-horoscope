// app/lib/timeUtils.ts - Time conversion utilities

import {
  BirthInfo,
  Location,
  MachineTime,
  AncientBurmeseTime,
  LMTOffset,
  SunHourUnit,
} from "./types";

export class TimeUtils {
  // Myanmar Standard Time reference longitude
  static readonly MMT_LONGITUDE = 97.5; // 97°30′E

  /**
   * Calculate Local Mean Time offset from Myanmar Standard Time
   * Returns offset in total seconds for precision
   */
  static calculateLMTOffsetSeconds(longitude: number): number {
    const longitudeDifference = longitude - TimeUtils.MMT_LONGITUDE;
    // 1 degree = 4 minutes = 240 seconds
    return longitudeDifference * 240;
  }

  /**
   * Convert seconds to hours, minutes, seconds format
   */
  static secondsToHMS(totalSeconds: number): {
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
   * Get LMT offset in formatted structure
   */
  static getLMTOffset(longitude: number): LMTOffset {
    const offsetSeconds = TimeUtils.calculateLMTOffsetSeconds(longitude);
    const hms = TimeUtils.secondsToHMS(offsetSeconds);
    const direction = offsetSeconds >= 0 ? "ahead" : "behind";

    return {
      hours: hms.hours,
      minutes: hms.minutes,
      seconds: hms.seconds,
      direction: direction,
    };
  }

  /**
   * Convert birth time from MMT to Machine Time (LMT adjusted)
   */
  static convertToMachineTime(
    birthInfo: BirthInfo,
    location: Location
  ): MachineTime {
    // Convert to 24-hour format first
    let hours = birthInfo.hour;
    if (birthInfo.period === "PM" && hours !== 12) {
      hours += 12;
    } else if (birthInfo.period === "AM" && hours === 12) {
      hours = 0;
    }

    // Calculate LMT offset in seconds
    const lmtOffsetSeconds = TimeUtils.calculateLMTOffsetSeconds(
      location.longitude
    );

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
}
