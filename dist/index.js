import { isBefore, isAfter, addMonths, addDays, addHours, addMinutes, addSeconds, format, startOfISOWeek, startOfWeek as startOfWeek$1, startOfMonth, startOfDay, endOfISOWeek, endOfWeek as endOfWeek$1, endOfMonth, endOfDay, getDay, getISODay, eachDayOfInterval, isSameYear, isSameMonth, isSameDay, differenceInMilliseconds, getDefaultOptions, setDefaultOptions, addWeeks } from 'date-fns';

var index = {
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
  endOfWeek
};
const registeredLocales = {};

// lookup table for faster conversion
// power-calendar format -> date-fns format (see https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table)
const knownFormats = {
  'YYYY-MM-DD': 'yyyy-MM-dd',
  'MMMM YYYY': 'MMMM yyyy',
  MMMM: 'MMMM',
  YYYY: 'yyyy'
};
function normalizeDateFormat(formatString) {
  if (knownFormats[formatString]) return knownFormats[formatString];

  // In other cases, we just pass the format as we don't know if the developer used the unicode tokens or not.
  // This might be misleading but we can't transform them by default to avoid breaking developer intentions.
  return formatString;
}
function registerLocale(locale) {
  registeredLocales[locale.code] = locale;
}
function getLocale(locale) {
  const dateFnsLocale = registeredLocales[locale];
  if (!dateFnsLocale) {
    throw new Error(`Locale ${locale} was not registered in ember-power-calendar-date-fns!`);
  }
  return dateFnsLocale;
}
function add(date, quantity, unit) {
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
function formatDate(date, format$1, locale = null) {
  const normalizedFormat = normalizeDateFormat(format$1);
  if (locale) {
    return withLocale(locale, () => format(date, normalizedFormat));
  } else {
    return format(date, normalizedFormat);
  }
}
function startOf(date, unit) {
  switch (unit) {
    case 'day':
      return startOfDay(date);
    case 'month':
      return startOfMonth(date);
    case 'week':
      return startOfWeek$1(date);
    case 'isoWeek':
      return startOfISOWeek(date);
    default:
      throw new Error(`startOf: Unit not supported! ${unit}`);
  }
}
function endOf(date, unit) {
  switch (unit) {
    case 'day':
      return endOfDay(date);
    case 'month':
      return endOfMonth(date);
    case 'week':
      return endOfWeek$1(date);
    case 'isoWeek':
      return endOfISOWeek(date);
    default:
      throw new Error(`endOf: Unit not supported! ${unit}`);
  }
}
function weekday(date) {
  return getDay(date);
}
function isoWeekday(date) {
  return getISODay(date);
}
function getWeekdaysShort() {
  const weekStart = new Date(1970, 0, 4);
  const weekEnd = new Date(1970, 0, 10);
  return eachDayOfInterval({
    start: weekStart,
    end: weekEnd
  }).map(date => format(date, 'EEE') // Mon, Tue, Wed, ..., Sun
  );
}
function getWeekdaysMin() {
  const weekStart = new Date(1970, 0, 4);
  const weekEnd = new Date(1970, 0, 10);
  return eachDayOfInterval({
    start: weekStart,
    end: weekEnd
  }).map(date => format(date, 'EEEEEE') // Mo, Tu, We, Th, Fr, Sa, Su
  );
}
function getWeekdays() {
  const weekStart = new Date(1970, 0, 4);
  const weekEnd = new Date(1970, 0, 10);
  return eachDayOfInterval({
    start: weekStart,
    end: weekEnd
  }).map(date => format(date, 'EEEE') // Monday, Tuesday, ..., Sunday
  );
}

// export function isAfter(date1: Date, date2: Date): boolean {
//   return moment(date1).isAfter(date2);
// }

// export function isBefore(date1: Date, date2: Date): boolean {
//   return moment(date1).isBefore(date2);
// }

function isSame(date1, date2, unit) {
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
function isBetween(date, start, end
// unit?: string,
// inclusivity?: string,
) {
  return +start <= +date && +date <= +end;
}
function diff(date1, date2) {
  return differenceInMilliseconds(date1, date2);
}
function normalizeDate(dateOrMoment) {
  if (dateOrMoment instanceof Date) {
    return dateOrMoment;
  }
}
function normalizeRangeActionValue(val) {
  return {
    date: val.date
  };
}
function normalizeMultipleActionValue(val) {
  return {
    date: val.date
  };
}
function normalizeCalendarDay(day) {
  // Nothing todo... we are working only with Date objects
  return day;
}
function withLocale(locale, fn) {
  let returnValue;
  if (locale) {
    const defaultOptions = getDefaultOptions();
    const currentLocale = defaultOptions.locale;
    setDefaultOptions({
      locale: getLocale(locale)
    });
    returnValue = fn();
    setDefaultOptions({
      locale: currentLocale
    });
  } else {
    returnValue = fn();
  }
  return returnValue;
}
function normalizeCalendarValue(value) {
  if (value) {
    return {
      date: value.date
    };
  }
  return {
    date: undefined
  };
}
function normalizeDuration(value) {
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
      case 'days':
        {
          b = addDays(a, quantityNumber);
          break;
        }
      case 'w':
      case 'week':
        {
          b = addWeeks(a, quantityNumber);
          break;
        }
      default:
        throw new Error(`normalizeDuration: Unit not supported! ${units}`);
    }
    return diff(a, b);
  }
}
function getDefaultLocale() {
  const defaultOptions = getDefaultOptions();
  const currentLocale = defaultOptions.locale;
  return currentLocale?.code ?? '';
}
function localeStartOfWeek(locale) {
  const now = new Date();
  const day = withLocale(locale, () => weekday(startOf(now, 'week')));
  return day >= 0 ? day : 0;
}
function startOfWeek(day, startOfWeek) {
  while (isoWeekday(day) % 7 !== startOfWeek) {
    day = add(day, -1, 'day');
  }
  return day;
}
function endOfWeek(day, startOfWeek) {
  const eow = (startOfWeek + 6) % 7;
  while (isoWeekday(day) % 7 !== eow) {
    day = add(day, 1, 'day');
  }
  return day;
}

export { add, index as default, diff, endOf, endOfWeek, formatDate, getDefaultLocale, getWeekdays, getWeekdaysMin, getWeekdaysShort, isBetween, isSame, isoWeekday, localeStartOfWeek, normalizeCalendarDay, normalizeCalendarValue, normalizeDate, normalizeDuration, normalizeMultipleActionValue, normalizeRangeActionValue, registerLocale, startOf, startOfWeek, weekday, withLocale };
//# sourceMappingURL=index.js.map
