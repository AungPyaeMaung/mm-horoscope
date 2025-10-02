// lib/types.ts

// Input from the user
export interface BirthInfo {
  date: number;
  month: number;
  year: number;
  hours: number; // 1-12
  minutes: number;
  seconds: number;
  period: "AM" | "PM";
}

export interface LocationInfo {
  latitude: {
    degrees: number;
    minutes: number;
  };
  longitude: {
    degrees: number;
    minutes: number;
  };
}

// Ancient Burmese Time Units
export interface BurmeseTime {
  nari: number;
  vizana: number;
  khara: number;
  vikhara: number;
  anukhara: number;
  pramanukhara: number;
  tadanukhara: number;
}

// Data structure for the first formula (Lagna Ranges)
export interface LagnaRange {
  sign: string;
  from: BurmeseTime;
  to: BurmeseTime;
}

// Data structure for the second formula (Increments)
export interface LagnaIncrement {
  sign: string;
  increment: BurmeseTime;
}

// Final Result
export interface AsuddhaLagna {
  rasi: string;
  amsa: number;
  litta: number;
  vilitta: number;
  anulitta: number;
}
