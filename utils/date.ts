/**
 * Comprehensive date utility functions for handling dates throughout the application
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
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 */
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  } else if (diffInDays < 0) {
    const absDays = Math.abs(diffInDays);
    if (absDays === 1) return "Tomorrow";
    if (absDays < 7) return `In ${absDays} days`;
    if (absDays < 30) return `In ${Math.floor(absDays / 7)} weeks`;
    if (absDays < 365) return `In ${Math.floor(absDays / 30)} months`;
    return `In ${Math.floor(absDays / 365)} years`;
  } else {
    if (diffInHours > 0) {
      if (diffInHours === 1) return "1 hour ago";
      return `${diffInHours} hours ago`;
    } else if (diffInMinutes > 0) {
      if (diffInMinutes === 1) return "1 minute ago";
      return `${diffInMinutes} minutes ago`;
    } else {
      return "Just now";
    }
  }
}

/**
 * Format a date string or Date object to a readable format
 * @param date - Date string or Date object
 * @param format - Format type: 'short', 'long', 'relative', 'time', 'datetime'
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date | undefined | null,
  format: "short" | "long" | "relative" | "time" | "datetime" = "short"
): string => {
  if (!date) return "No date set";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "Invalid date";

  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  switch (format) {
    case "short":
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

    case "long":
      return dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    case "relative":
      if (diffInDays === 0) return "Today";
      if (diffInDays === 1) return "Yesterday";
      if (diffInDays === -1) return "Tomorrow";
      if (diffInDays > 0 && diffInDays < 7) return `${diffInDays} days ago`;
      if (diffInDays < 0 && diffInDays > -7)
        return `In ${Math.abs(diffInDays)} days`;
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

    case "time":
      return dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

    case "datetime":
      return dateObj.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

    default:
      return dateObj.toLocaleDateString();
  }
};

/**
 * Check if a date is in the past
 * @param date - Date string or Date object
 * @returns boolean
 */
export const isDatePast = (date: string | Date | undefined | null): boolean => {
  if (!date) return false;
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj < new Date();
};

/**
 * Check if a date is today
 * @param date - Date string or Date object
 * @returns boolean
 */
export const isDateToday = (
  date: string | Date | undefined | null
): boolean => {
  if (!date) return false;
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Check if a date is tomorrow
 * @param date - Date string or Date object
 * @returns boolean
 */
export const isDateTomorrow = (
  date: string | Date | undefined | null
): boolean => {
  if (!date) return false;
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return dateObj.toDateString() === tomorrow.toDateString();
};

/**
 * Get the number of days until a date
 * @param date - Date string or Date object
 * @returns number of days (negative if past)
 */
export const getDaysUntil = (
  date: string | Date | undefined | null
): number => {
  if (!date) return 0;
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInMs = dateObj.getTime() - now.getTime();
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
};

/**
 * Format a deadline with urgency indicators
 * @param deadline - Deadline date string or Date object
 * @returns Formatted deadline string with urgency context
 */
export const formatDeadline = (
  deadline: string | Date | undefined | null
): string => {
  if (!deadline) return "No deadline set";

  const dateObj = typeof deadline === "string" ? new Date(deadline) : deadline;
  const daysUntil = getDaysUntil(deadline);

  if (isDatePast(deadline)) {
    return `${formatDate(deadline, "short")} (Overdue)`;
  }

  if (isDateToday(deadline)) {
    return `${formatDate(deadline, "short")} (Due today)`;
  }

  if (isDateTomorrow(deadline)) {
    return `${formatDate(deadline, "short")} (Due tomorrow)`;
  }

  if (daysUntil <= 7) {
    return `${formatDate(deadline, "short")} (Due in ${daysUntil} days)`;
  }

  return formatDate(deadline, "short");
};

/**
 * Get CSS classes for deadline urgency styling
 * @param deadline - Deadline date string or Date object
 * @returns Object with CSS classes for different urgency levels
 */
export const getDeadlineClasses = (
  deadline: string | Date | undefined | null
) => {
  if (!deadline) return { text: "text-zinc-400", bg: "bg-zinc-800/50" };

  const dateObj = typeof deadline === "string" ? new Date(deadline) : deadline;
  const daysUntil = getDaysUntil(deadline);

  if (isDatePast(dateObj)) {
    return { text: "text-red-400", bg: "bg-red-900/20" };
  }

  if (isDateToday(dateObj)) {
    return { text: "text-orange-400", bg: "bg-orange-900/20" };
  }

  if (isDateTomorrow(dateObj)) {
    return { text: "text-yellow-400", bg: "bg-yellow-900/20" };
  }

  if (daysUntil <= 7) {
    return { text: "text-blue-400", bg: "bg-blue-900/20" };
  }

  return { text: "text-green-400", bg: "bg-green-900/20" };
};

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
 * Get day of week (0-6, where 0 is Sunday)
 */
export function getDayOfWeek(dateString: string): number {
  const date = new Date(dateString);
  return date.getDay();
}

/**
 * Get week number of the year
 */
export function getWeekNumber(dateString: string): number {
  const date = new Date(dateString);
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Check if the date falls on a weekend
 */
export function isWeekend(dateString: string): boolean {
  const dayOfWeek = getDayOfWeek(dateString);
  return dayOfWeek === 0 || dayOfWeek === 6;
}

/**
 * Get timezone offset in minutes
 */
export function getTimezoneOffset(dateString: string): number {
  const date = new Date(dateString);
  return date.getTimezoneOffset();
}

/**
 * Convert date to a specific timezone
 */
export function convertToTimezone(
  dateString: string,
  timezone: string
): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", { timeZone: timezone });
}
