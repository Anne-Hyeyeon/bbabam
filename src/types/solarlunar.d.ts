declare module "solarlunar" {
  export interface SolarLunarResult {
    lYear: number;
    lMonth: number;
    lDay: number;
    animal: string;
    yearCn: string;
    monthCn: string;
    dayCn: string;
    cYear: number;
    cMonth: number;
    cDay: number;
    gzYear: string;
    gzMonth: string;
    gzDay: string;
    isToday: boolean;
    isLeap: boolean;
    nWeek: number;
    ncWeek: string;
    isTerm: boolean;
    term: string;
  }

  interface SolarLunar {
    solar2lunar(y: number, m: number, d: number): SolarLunarResult | -1;
    lunar2solar(y: number, m: number, d: number, isLeap?: boolean): SolarLunarResult | -1;
  }

  const solarLunar: SolarLunar;
  export default solarLunar;
}
