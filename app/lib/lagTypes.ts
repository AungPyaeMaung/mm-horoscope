// app/lib/lagTypes.ts - Lag calculation specific types

import { AncientBurmeseTime } from "./types";

export interface AstronomicalPosition {
  rasi: number;
  amsa: number;
  litta: number;
  vilitta: number;
  anulitta: number;
}

export interface LagStageData {
  stage1: {
    rasi: number;
    nari: number;
    vizana: number;
  };
  stage2: {
    amsa: number;
    nari: number;
    vizana: number;
    khara: number;
  };
  stage3: {
    litta: number;
    vizana: number;
    khara: number;
    anukhara: number;
  };
  stage4: {
    vilitta: number;
    khara: number;
    anukhara: number;
    anuvikhara: number;
  };
  stage5: {
    anulitta: number;
    anukhara: number;
    anuvikhara: number;
  };
}

export interface LagStageResult {
  stage: number;
  stageName: string;
  inputValue: number;
  inputUnit: string;
  subtractTime: AncientBurmeseTime & { anuvikhara?: number };
  resultTime: AncientBurmeseTime & { anuvikhara?: number };
}

export interface AyanaAmsa {
  amsa: number;
  litta: number;
}

export interface LagCalculationResult {
  stages: LagStageResult[];
  asuddhaLag: AstronomicalPosition;
  ayanaAmsa?: AyanaAmsa;
  suddhaLag?: AstronomicalPosition;
}
