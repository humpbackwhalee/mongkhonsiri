export interface Prayer {
  id: string;
  title: string;
  prayerText: string[];
  audioSrc?: string;
  audioTimings?: number[];
}
