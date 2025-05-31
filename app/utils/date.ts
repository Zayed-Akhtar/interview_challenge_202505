const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const RELATIVE_FORMATTER = new Intl.RelativeTimeFormat("en-US", {
  numeric: "auto",
});

/**
 * Format a date to a readable string (e.g., "Jan 15, 2024, 3:30 PM").
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return DATE_FORMATTER.format(dateObj);
}

/**
 * Format a date to a relative string (e.g., "2 days ago", "just now").
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();

  // 1) Calculate total difference in seconds (always positive for past dates).
  const deltaSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  // If the date is in the future, treat it as “just now.”
  if (deltaSeconds < 0) {
    return "just now";
  }

  // 2) If it’s more than 30 days old, just return the full date.
  const secondsPerDay = 60 * 60 * 24;
  if (deltaSeconds > 30 * secondsPerDay) {
    return formatDate(dateObj);
  }

  const deltaDays    = Math.floor(deltaSeconds / secondsPerDay);
  const deltaHours   = Math.floor(deltaSeconds / 3600);
  const deltaMinutes = Math.floor(deltaSeconds / 60);

  if (deltaDays > 0) {
    // Pass a negative number so Intl.RelativeTimeFormat knows it's "in the past"
    return RELATIVE_FORMATTER.format(-deltaDays, "day");
  }

  if (deltaHours > 0) {
    return RELATIVE_FORMATTER.format(-deltaHours, "hour");
  }

  if (deltaMinutes > 0) {
    return RELATIVE_FORMATTER.format(-deltaMinutes, "minute");
  }

  return "just now";
}
