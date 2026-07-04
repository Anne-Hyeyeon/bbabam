export interface DdaySnapshot {
  /** Days until the due date; negative once the due date has passed. */
  daysLeft: number;
  /** Current pregnancy week (clamped to 0–42). */
  week: number;
  trimester: 1 | 2 | 3;
  /** How far along the 280-day journey is, 0–100. */
  progressPct: number;
}
