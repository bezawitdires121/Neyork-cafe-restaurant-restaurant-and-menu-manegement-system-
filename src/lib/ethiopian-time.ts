function toEthiopianLabel(time12: string): string {
  const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return time12;

  const hour12 = parseInt(match[1]);
  const minute = match[2];
  const meridiem = match[3].toUpperCase();

  let h24 = hour12 % 12;
  if (meridiem === "PM") h24 += 12;

  let ethHour = (h24 - 6 + 24) % 12;
  if (ethHour === 0) ethHour = 12;

  let period: string;
  if (h24 >= 6 && h24 < 12) period = "ጠዋት";
  else if (h24 >= 12 && h24 < 18) period = "ከሰዓት";
  else if (h24 >= 18 && h24 < 24) period = "ማታ";
  else period = "ለሊት";

  return `${ethHour}:${minute} ${period}`;
}

export function toEthiopianRange(range: string): string {
  const parts = range.split(/–|-/).map((s) => s.trim());
  if (parts.length !== 2) return range;
  return `${toEthiopianLabel(parts[0])} - ${toEthiopianLabel(parts[1])}`;
}