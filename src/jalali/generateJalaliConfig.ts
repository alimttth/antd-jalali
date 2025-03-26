import dayjs, { Dayjs } from "dayjs";
import jalaliday from "jalaliday";
import { noteOnce } from "rc-util/lib/warning";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { default as faLocale } from "./locale";

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(jalaliday);

dayjs.locale(faLocale, undefined, true);

// Add leap year detection
const isLeapYear = (year: number): boolean => {
  const remainder = year % 33;
  return remainder === 1 || remainder === 5 || remainder === 9 || remainder === 13 || remainder === 17 || remainder === 22 || remainder === 26 || remainder === 30;
};

dayjs.extend((o, c) => {
  // todo support Wo (ISO week)
  const proto = c.prototype;
  const oldFormat = proto.format;
  proto.format = function f(formatStr: string) {
    const str = (formatStr || "").replace("Wo", "wo");
    return oldFormat.bind(this)(str);
  };
});

type IlocaleMapObject = { [key: string]: string };
const localeMap: IlocaleMapObject = {
  en_GB: "en-gb",
  en_US: "en",
  zh_CN: "zh-cn",
  zh_TW: "zh-tw",
  fa_IR: "fa",
};

const parseLocale = (locale: string): string => {
  const mapLocale = localeMap[locale];
  return mapLocale || locale.split("_")[0];
};

const parseNoMatchNotice = () => {
  /* istanbul ignore next */
  noteOnce(false, "Not match any format. Please help to fire a issue about this.");
};

const generateJalaliConfig = {
  // get
  getNow: (): Dayjs => dayjs(),
  getFixedDate: (dateString: string): Dayjs => dayjs(dateString, "YYYY-MM-DD"),
  getEndDate: (date: Dayjs): Dayjs => date.endOf("month"),
  getWeekDay: (date?: Dayjs): number => {
    if (!date?.weekday()) {
      date = dayjs();
    }
    const clone = date.locale("en");
    return clone.weekday() + clone.localeData().firstDayOfWeek();
  },
  getYear: (date: Dayjs): number => date.year(),
  getMonth: (date: Dayjs): number => date.month(),
  getDate: (date: Dayjs): number => date.date(),
  getHour: (date: Dayjs): number => date.hour(),
  getMinute: (date: Dayjs): number => date.minute(),
  getSecond: (date: Dayjs): number => date.second(),

  // set
  addYear: (date: Dayjs, diff: number): Dayjs => date.add(diff, "year"),
  addMonth: (date: Dayjs, diff: number): Dayjs => date.add(diff, "month"),
  addDate: (date: Dayjs, diff: number): Dayjs => date.add(diff, "day"),
  setYear: (date: Dayjs, year: number): Dayjs => date.year(year),
  setMonth: (date: Dayjs, month: number): Dayjs => date.month(month),
  setDate: (date: Dayjs, num: number): Dayjs => date.date(num),
  setHour: (date: Dayjs, hour: number): Dayjs => date.hour(hour),
  setMinute: (date: Dayjs, minute: number): Dayjs => date.minute(minute),
  setSecond: (date: Dayjs, second: number): Dayjs => date.second(second),

  getMillisecond: (date: Dayjs): number => date.millisecond(),
  setMillisecond: (date: Dayjs, millisecond: number): Dayjs => date.millisecond(millisecond),

  // Compare
  isAfter: (date1: Dayjs, date2: Dayjs): boolean => date1.isAfter(date2),
  isValidate: (date: Dayjs): boolean => date.isValid(),
  locale: {
    getWeekFirstDate: (locale: string, date: Dayjs): Dayjs => date.locale(parseLocale(locale)).weekday(0),
    getWeekFirstDay: (locale: string): number => dayjs().locale(parseLocale(locale)).localeData().firstDayOfWeek(),
    getWeek: (locale: string, date: Dayjs): number => date.locale(parseLocale(locale)).week(),
    getShortWeekDays: (locale: string): string[] => dayjs().locale(parseLocale(locale)).localeData().weekdaysMin(),
    getShortMonths: (locale: string): string[] => dayjs().locale(parseLocale(locale)).localeData().monthsShort(),
    format: (locale: string, date: Dayjs, format: string): string => {
      return date.locale(parseLocale(locale)).format(format);
    },
    parse: (locale: string, text: string, formats: string[]): Dayjs | null => {
      if (text.length !== 10) return null;

      const localeStr = parseLocale(locale);

      for (let i = 0; i < formats.length; i += 1) {
        const format = formats[i];
        const formatText = text;
        if (format.includes("wo") || format.includes("Wo")) {
          // parse Wo
          const year = formatText.split("-")[0];
          const weekStr = formatText.split("-")[1];
          const firstWeek = dayjs(year, "YYYY").startOf("year").locale(localeStr);
          for (let j = 0; j <= 52; j += 1) {
            const nextWeek = firstWeek.add(j, "week");
            if (nextWeek.format("Wo") === weekStr) {
              return nextWeek;
            }
          }
          parseNoMatchNotice();
          return null;
        }

        const date = dayjs(formatText, {
          format,
          locale: "fa_IR",
          //  @ts-ignore
          jalali: true,
        }).locale(localeStr);

        if (date.isValid()) {
          return date;
        }
      }

      parseNoMatchNotice();
      return null;
    },
  },

  // Add leap year handling
  isLeapYear: (date: Dayjs): boolean => {
    const year = date.year();
    return isLeapYear(year);
  },

  getDaysInMonth: (date: Dayjs): number => {
    const month = date.month();
    const year = date.year();
    const isLeap = isLeapYear(year);
    
    // In Jalali calendar, the first 6 months have 31 days, the next 5 months have 30 days,
    // and the last month (Esfand) has 29 days in common years and 30 days in leap years
    if (month < 6) return 31;
    if (month < 11) return 30;
    return isLeap ? 30 : 29;
  },
};

export default generateJalaliConfig;
