// app/lib/types.ts - All TypeScript interfaces and types

export interface BirthInfo {
  date: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  second?: number;
  period: "AM" | "PM";
}

export interface CoordinateInput {
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

export interface Location {
  latitude: number;
  longitude: number;
}

export interface MachineTime {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface AncientBurmeseTime {
  nari: number;
  vizana: number;
  khara: number;
  anukhara?: number;
}

export interface LMTOffset {
  hours: number;
  minutes: number;
  seconds: number;
  direction: "ahead" | "behind";
}

export interface SunHourUnit {
  nari: number;
  vizana: number;
  khara: number;
  anukhara: number;
}

export interface TimeConversionResult {
  originalMMT: string;
  lmtOffset: LMTOffset;
  machineTime: MachineTime;
  ancientTime: AncientBurmeseTime;
  sunHourUnit?: SunHourUnit;
  finalTime?: AncientBurmeseTime;
  description: string;
}
