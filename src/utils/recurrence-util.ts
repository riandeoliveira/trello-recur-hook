import dayjs from "dayjs";

// biome-ignore lint/complexity/noStaticOnlyClass: static utility class
export abstract class RecurrenceUtil {
  public static nextDue(
    currentDue: string,
    rule: RecurrenceRule,
  ): string | null {
    let date = dayjs(currentDue);

    if (rule.type === "EVERY_X_MONTHS") {
      return date.add(rule.value, "month").toISOString();
    }

    if (rule.type === "MONTH_DAYS") {
      const days = [...rule.value].sort((a, b) => a - b);
      const currentDay = date.date();
      const nextDay = days.find((d) => d > currentDay) ?? days[0];

      if (nextDay <= currentDay) {
        date = date.add(1, "month");
      }

      date = date.date(nextDay);

      return date.toISOString();
    }

    if (rule.type === "WEEK_DAYS") {
      const weekdays = rule.value
        .map((d) => WEEKDAY_MAP[d])
        .sort((a, b) => a - b);

      const currentWeekday = date.day();

      const nextWeekday =
        weekdays.find((d) => d > currentWeekday) ?? weekdays[0];

      if (nextWeekday <= currentWeekday) {
        date = date.add(1, "week");
      }

      date = date.day(nextWeekday);

      return date.toISOString();
    }

    return null;
  }

  public static parse(cardDesc: string): RecurrenceRule | null {
    try {
      const normalized = cardDesc
        .replace(/^```json\s*/i, "")
        .replace(/```$/i, "")
        .trim();

      const rule = JSON.parse(normalized);

      if (!rule.type || !rule.value) return null;

      return rule;
    } catch (error) {
      console.log("Error trying to parse card description:", error);

      return null;
    }
  }
}

type RecurrenceRule =
  | { type: "EVERY_X_MONTHS"; value: number }
  | { type: "MONTH_DAYS"; value: number[] }
  | { type: "WEEK_DAYS"; value: Weekday[] };

const WEEKDAY_MAP = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
} as const;

type Weekday = keyof typeof WEEKDAY_MAP;
