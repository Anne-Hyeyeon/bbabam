// Pure: parse YYYY-MM-DD into a local Date (avoids UTC off-by-one shifts).
export const parseIsoDate = (iso: string): Date | null => {
  const [year, month, day] = iso.split("-").map(Number);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }
  return new Date(year, month - 1, day);
};
