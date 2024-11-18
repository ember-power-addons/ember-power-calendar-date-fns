import {
  addSeconds,
  addMinutes,
  addHours,
  addDays,
  addMonths,
  format as formatFns,
  startOfDay,
  startOfMonth,
  startOfISOWeek,
  startOfWeek as _startOfWeek,
  endOfMonth,
  endOfWeek as _endOfWeek,
  endOfISOWeek,
  endOfDay,
  getDay,
  getISODay,
  eachDayOfInterval,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isSameYear,
  differenceInMilliseconds,
  addWeeks,
  getDefaultOptions,
  setDefaultOptions,
  type Locale,
} from 'date-fns';
import type {
  NormalizeCalendarValue,
  NormalizeMultipleActionValue,
  NormalizeRangeActionValue,
  PowerCalendarDay,
} from 'ember-power-calendar/utils';

export default {
  add,
  formatDate,
  startOf,
  endOf,
  weekday,
  isoWeekday,
  getWeekdaysShort,
  getWeekdaysMin,
  getWeekdays,
  isAfter,
  isBefore,
  isSame,
  isBetween,
  diff,
  normalizeDate,
  normalizeRangeActionValue,
  normalizeMultipleActionValue,
  normalizeCalendarDay,
  withLocale,
  normalizeCalendarValue,
  normalizeDuration,
  getDefaultLocale,
  localeStartOfWeek,
  startOfWeek,
  endOfWeek,
};

const registeredLocales: Record<string, Locale> = {};

// lookup table for faster conversion
// power-calendar format -> date-fns format (see https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table)
const knownFormats: {
  [key: string]: string;
} = {
  'YYYY-MM-DD': 'yyyy-MM-dd',
  'MMMM YYYY': 'MMMM yyyy',
  MMMM: 'MMMM',
  YYYY: 'yyyy',
};

function normalizeDateFormat(formatString: string): string {
  if (knownFormats[formatString]) return knownFormats[formatString];

  // In other cases, we just pass the format as we don't know if the developer used the unicode tokens or not.
  // This might be misleading but we can't transform them by default to avoid breaking developer intentions.
  return formatString;
}

export function registerLocale(locale: Locale) {
  registeredLocales[locale.code] = locale;
}

function getLocale(locale: string): Locale {
  const dateFnsLocale = registeredLocales[locale];
  if (!dateFnsLocale) {
    throw new Error(`Locale ${locale} was not registered in ember-power-calendar-date-fns!`);
  }

  return dateFnsLocale;
}

export function add(date: Date, quantity: number, unit: string): Date {
  switch (unit) {
    case 'second':
    case 'seconds':
      return addSeconds(date, quantity);
    case 'minute':
    case 'minutes':
      return addMinutes(date, quantity);
    case 'hour':
    case 'hours':
      return addHours(date, quantity);
    case 'day':
    case 'days':
      return addDays(date, quantity);
    case 'month':
    case 'months':
      return addMonths(date, quantity);
    default:
      throw new Error(`add: Unit not supported! ${unit}`);
  }
}

export function formatDate(
  date: Date,
  format: string,
  locale: string | null = null,
): string {
  const normalizedFormat = normalizeDateFormat(format);
  if (locale) {
    return withLocale(locale, () =>
      formatFns(date, normalizedFormat),
    ) as string;
  } else {
    return formatFns(date, normalizedFormat);
  }
}

export function startOf(date: Date, unit: string): Date {
  switch (unit) {
    case 'day':
      return startOfDay(date);
    case 'month':
      return startOfMonth(date);
    case 'week':
      return _startOfWeek(date);
    case 'isoWeek':
      return startOfISOWeek(date);
    default:
      throw new Error(`startOf: Unit not supported! ${unit}`);
  }
}

export function endOf(date: Date, unit: string): Date {
  switch (unit) {
    case 'day':
      return endOfDay(date);
    case 'month':
      return endOfMonth(date);
    case 'week':
      return _endOfWeek(date);
    case 'isoWeek':
      return endOfISOWeek(date);
    default:
      throw new Error(`endOf: Unit not supported! ${unit}`);
  }
}

export function weekday(date: Date): number {
  return getDay(date);
}

export function isoWeekday(date: Date): number {
  return getISODay(date);
}

export function getWeekdaysShort(): string[] {
  const weekStart = new Date(1970, 0, 4);
  const weekEnd = new Date(1970, 0, 10);

  return eachDayOfInterval({ start: weekStart, end: weekEnd }).map(
    (date) => formatFns(date, 'EEE'), // Mon, Tue, Wed, ..., Sun
  );
}

export function getWeekdaysMin(): string[] {
  const weekStart = new Date(1970, 0, 4);
  const weekEnd = new Date(1970, 0, 10);

  return eachDayOfInterval({ start: weekStart, end: weekEnd }).map(
    (date) => formatFns(date, 'EEEEEE'), // Mo, Tu, We, Th, Fr, Sa, Su
  );
}

export function getWeekdays(): string[] {
  const weekStart = new Date(1970, 0, 4);
  const weekEnd = new Date(1970, 0, 10);

  return eachDayOfInterval({ start: weekStart, end: weekEnd }).map(
    (date) => formatFns(date, 'EEEE'), // Monday, Tuesday, ..., Sunday
  );
}

// export function isAfter(date1: Date, date2: Date): boolean {
//   return moment(date1).isAfter(date2);
// }

// export function isBefore(date1: Date, date2: Date): boolean {
//   return moment(date1).isBefore(date2);
// }

export function isSame(date1: Date, date2: Date, unit: string): boolean {
  switch (unit) {
    case 'day':
      return isSameDay(date1, date2);
    case 'month':
      return isSameMonth(date1, date2);
    case 'year':
      return isSameYear(date1, date2);
    default:
      throw new Error(`isSame: Unit not supported! ${unit}`);
  }
}

export function isBetween(
  date: Date,
  start: Date,
  end: Date,
  // unit?: string,
  // inclusivity?: string,
): boolean {
  return +start <= +date && +date <= +end;
}

export function diff(date1: Date, date2: Date): number {
  return differenceInMilliseconds(date1, date2);
}

export function normalizeDate(dateOrMoment?: unknown): Date | undefined {
  if (dateOrMoment instanceof Date) {
    return dateOrMoment;
  }
}

export function normalizeRangeActionValue(val: {
  date: {
    start?: Date | null;
    end?: Date | null;
  };
}): NormalizeRangeActionValue {
  return {
    date: val.date,
  };
}

export function normalizeMultipleActionValue(val: {
  date: Date[];
}): NormalizeMultipleActionValue {
  return {
    date: val.date,
  };
}

export function normalizeCalendarDay(day: PowerCalendarDay): PowerCalendarDay {
  // Nothing todo... we are working only with Date objects
  return day;
}

export function withLocale(locale: string, fn: () => unknown): unknown {
  let returnValue;
  if (locale) {
    const defaultOptions = getDefaultOptions();
    const currentLocale = defaultOptions.locale;
    setDefaultOptions({ locale: getLocale(locale) });
    returnValue = fn();
    setDefaultOptions({ locale: currentLocale });
  } else {
    returnValue = fn();
  }
  return returnValue;
}

export function normalizeCalendarValue(value: {
  date: Date;
}): NormalizeCalendarValue {
  if (value) {
    return {
      date: value.date,
    };
  }
  return { date: undefined };
}

export function normalizeDuration(value: unknown): number | null | undefined {
  if (value === null) {
    return null;
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const matches = value.match(/(\d+)(.*)/) ?? [];
    const quantity = matches[1] ?? '';
    const units = matches[2]?.trim() || 'days';

    const quantityNumber = parseInt(quantity, 10);
    const a = new Date();
    let b;

    switch (units) {
      case 'days': {
        b = addDays(a, quantityNumber);
        break;
      }
      case 'w':
      case 'week': {
        b = addWeeks(a, quantityNumber);
        break;
      }
      default:
        throw new Error(`normalizeDuration: Unit not supported! ${units}`);
    }

    return diff(a, b);
  }
}

export function getDefaultLocale(): string {
  const defaultOptions = getDefaultOptions();
  const currentLocale = defaultOptions.locale;
  return currentLocale?.code ?? '';
}

export function localeStartOfWeek(locale: string): number {
  const now = new Date();
  const day = withLocale(locale, () => weekday(startOf(now, 'week'))) as number;
  return day >= 0 ? day : 0;
}

export function startOfWeek(day: Date, startOfWeek: number): Date {
  while (isoWeekday(day) % 7 !== startOfWeek) {
    day = add(day, -1, 'day');
  }
  return day;
}

export function endOfWeek(day: Date, startOfWeek: number): Date {
  const eow = (startOfWeek + 6) % 7;
  while (isoWeekday(day) % 7 !== eow) {
    day = add(day, 1, 'day');
  }
  return day;
}
