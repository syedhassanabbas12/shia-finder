export function isStale(checkedIso: string, verified: boolean): boolean {
  if (!verified) return true;
  const checked = new Date(checkedIso).getTime();
  const oneYearMs = 365 * 24 * 60 * 60 * 1000;
  return Date.now() - checked > oneYearMs;
}

export function formatCheckedLine(checkedIso: string, checkedBy: string, verified: boolean): string {
  const date = new Date(checkedIso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  return `${verified ? 'Checked' : 'Last checked'} ${date} by ${checkedBy}`;
}
