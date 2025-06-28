/**
 * Comprehensive date utility functions for handling ISO date strings
 * Format: 2025-06-27T21:27:21.270Z
 */

export interface DateProperties {
  originalString: string;
  dateObject: Date;
  year: number;
  month: number;
  monthName: string;
  monthNameShort: string;
  day: number;
  dayName: string;
  dayNameShort: string;
  hour24: number;
  hour12: number;
  minute: number;
  second: number;
  millisecond: number;
  amPm: "AM" | "PM";
  timezone: string;
  timestamp: number;
  iso: string;
  dateOnly: string;
  timeOnly: string;
  time12Hour: string;
  time24Hour: string;
  formatted: {
    short: string; // 6/27/2025
    medium: string; // Jun 27, 2025
    long: string; // June 27, 2025
    full: string; // Friday, June 27, 2025
    datetime: string; // June 27, 2025 at 9:27 PM
    relative: string; // "2 hours ago", "in 3 days", etc.
  };
}

/**
 * Parse an ISO date string and return all useful properties
 */
export function parseDateString(dateString: string): DateProperties {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthNamesShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();
  const hour24 = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const millisecond = date.getMilliseconds();

  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const amPm: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";

  // Format helpers
  const pad = (num: number, length: number = 2): string =>
    num.toString().padStart(length, "0");

  return {
    originalString: dateString,
    dateObject: date,
    year,
    month,
    monthName: monthNames[date.getMonth()],
    monthNameShort: monthNamesShort[date.getMonth()],
    day,
    dayName: dayNames[date.getDay()],
    dayNameShort: dayNamesShort[date.getDay()],
    hour24,
    hour12,
    minute,
    second,
    millisecond,
    amPm,
    timezone: date.toTimeString().split(" ")[1] || "UTC",
    timestamp: date.getTime(),
    iso: date.toISOString(),
    dateOnly: `${year}-${pad(month)}-${pad(day)}`,
    timeOnly: `${pad(hour24)}:${pad(minute)}:${pad(second)}`,
    time12Hour: `${hour12}:${pad(minute)} ${amPm}`,
    time24Hour: `${pad(hour24)}:${pad(minute)}`,
    formatted: {
      short: `${month}/${day}/${year}`,
      medium: `${monthNamesShort[date.getMonth()]} ${day}, ${year}`,
      long: `${monthNames[date.getMonth()]} ${day}, ${year}`,
      full: `${dayNames[date.getDay()]}, ${
        monthNames[date.getMonth()]
      } ${day}, ${year}`,
      datetime: `${
        monthNames[date.getMonth()]
      } ${day}, ${year} at ${hour12}:${pad(minute)} ${amPm}`,
      relative: getRelativeTime(date),
    },
  };
}

/**
 * Get just the date part (YYYY-MM-DD)
 */
export function getDateOnly(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
}

/**
 * Get just the time part in 12-hour format
 */
export function getTime12Hour(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Get just the time part in 24-hour format
 */
export function getTime24Hour(dateString: string): string {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Check if the date is today
 */
export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Check if the date is yesterday
 */
export function isYesterday(dateString: string): boolean {
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}

/**
 * Check if the date is tomorrow
 */
export function isTomorrow(dateString: string): boolean {
  const date = new Date(dateString);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
}

/**
 * Get relative time description (e.g., "2 hours ago", "in 3 days")
 */
export function getRelativeTime(date: Date | string): string {
  const targetDate = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  const diffSeconds = Math.floor(Math.abs(diffMs) / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  const isPast = diffMs < 0;
  const prefix = isPast ? "" : "in ";
  const suffix = isPast ? " ago" : "";

  if (diffSeconds < 60) {
    return isPast ? "just now" : "in a moment";
  } else if (diffMinutes < 60) {
    const unit = diffMinutes === 1 ? "minute" : "minutes";
    return `${prefix}${diffMinutes} ${unit}${suffix}`;
  } else if (diffHours < 24) {
    const unit = diffHours === 1 ? "hour" : "hours";
    return `${prefix}${diffHours} ${unit}${suffix}`;
  } else if (diffDays < 7) {
    const unit = diffDays === 1 ? "day" : "days";
    return `${prefix}${diffDays} ${unit}${suffix}`;
  } else if (diffWeeks < 4) {
    const unit = diffWeeks === 1 ? "week" : "weeks";
    return `${prefix}${diffWeeks} ${unit}${suffix}`;
  } else if (diffMonths < 12) {
    const unit = diffMonths === 1 ? "month" : "months";
    return `${prefix}${diffMonths} ${unit}${suffix}`;
  } else {
    const unit = diffYears === 1 ? "year" : "years";
    return `${prefix}${diffYears} ${unit}${suffix}`;
  }
}

/**
 * Format date for display in different styles
 */
export function formatDate(
  dateString: string,
  style: "short" | "medium" | "long" | "full" = "medium"
): string {
  const parsed = parseDateString(dateString);
  return parsed.formatted[style];
}

/**
 * Get day of week (0 = Sunday, 6 = Saturday)
 */
export function getDayOfWeek(dateString: string): number {
  return new Date(dateString).getDay();
}

/**
 * Get week number of the year
 */
export function getWeekNumber(dateString: string): number {
  const date = new Date(dateString);
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDay.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDay.getDay() + 1) / 7);
}

/**
 * Check if it's a weekend
 */
export function isWeekend(dateString: string): boolean {
  const dayOfWeek = getDayOfWeek(dateString);
  return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
}

/**
 * Get timezone offset in minutes
 */
export function getTimezoneOffset(dateString: string): number {
  return new Date(dateString).getTimezoneOffset();
}

/**
 * Convert to different timezone (returns new ISO string)
 */
export function convertToTimezone(
  dateString: string,
  timezone: string
): string {
  const date = new Date(dateString);
  return (
    new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
      .format(date)
      .replace(/[^\d]/g, (match) => (match === " " ? "T" : match)) + ".000Z"
  );
}

// Example usage:
/*
const dateStr = "2025-06-27T21:27:21.270Z";
const parsed = parseDateString(dateStr);

console.log(parsed.dateOnly);        // "2025-06-27"
console.log(parsed.time12Hour);      // "9:27 PM"
console.log(parsed.formatted.long);  // "June 27, 2025"
console.log(parsed.dayName);         // "Friday"
console.log(isToday(dateStr));       // false
console.log(getRelativeTime(dateStr)); // "in 2 days" (example)
*/
