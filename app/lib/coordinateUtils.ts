// app/lib/coordinateUtils.ts - Coordinate conversion utilities

import { CoordinateInput, Location } from "./types";

export class CoordinateUtils {
  /**
   * Convert DMS to decimal degrees
   */
  static dmsToDecimal(
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
  static convertCoordinates(coordInput: CoordinateInput): Location {
    let latitude: number;
    let longitude: number;

    if (coordInput.type === "decimal") {
      latitude = coordInput.latitude.decimal || 0;
      longitude = coordInput.longitude.decimal || 0;
    } else {
      latitude = CoordinateUtils.dmsToDecimal(
        coordInput.latitude.degrees || 0,
        coordInput.latitude.minutes || 0,
        coordInput.latitude.direction || "N"
      );
      longitude = CoordinateUtils.dmsToDecimal(
        coordInput.longitude.degrees || 0,
        coordInput.longitude.minutes || 0,
        coordInput.longitude.direction || "E"
      );
    }

    return { latitude, longitude };
  }
}
