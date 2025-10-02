// lib/types.ts

export interface BirthInfo {
  year: number;
  month: number;
  date: number;
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

export interface BurmeseTime {
  nari: number;
  vizana: number;
  khara: number;
  vikhara: number;
  anukhara: number;
  pramanukhara: number;
  tadanukhara: number;
}

export interface AsuddhaLagna {
  rasi: string;
  amsa: number;
  litta: number;
  vilitta: number;
  anulitta: number;
}

export interface LagnaRangeData {
  lat: number;
  endTimes: { [key: string]: number }; // Sign -> total vizanas
}

export interface LagnaIncrementData {
  lat: number;
  increments: { [key: string]: number }; // Sign -> total kharas
}
