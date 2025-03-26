import dayjs, { Dayjs } from "dayjs";
import jalaliday from "jalali-plugin-dayjs";
import { noteOnce } from "rc-util/lib/warning";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { default as faLocale } from "./locale";

// Add leap year detection
const isLeapYear = (year: number): boolean => {
  const remainder = year % 33;
  return remainder === 1 || remainder === 5 || remainder === 9 || remainder === 13 || remainder === 17 || remainder === 22 || remainder === 26 || remainder === 30;
};

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(jalaliday);

dayjs.locale(faLocale, undefined, true);

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

const parseLocale = (locale: string) => {
  const mapLocale = localeMap[locale];
  return mapLocale || locale.split("_")[0];
};

const parseNoMatchNotice = () => {
  /* istanbul ignore next */
  noteOnce(false, "Not match any format. Please help to fire a issue about this.");
};

const generateJalaliConfig = {
  // get
  getNow: () => dayjs(),
  getFixedDate: (string) => dayjs(string, "YYYY-MM-DD"),
  getEndDate: (date) => date.endOf("month"),
  getWeekDay: (date) => {
    if (!date?.weekday()) {
      date = dayjs();
    }
    const clone = date.locale("en");
    return clone.weekday() + clone.localeData().firstDayOfWeek();
  },
  getYear: (date) => date.year(),
  getMonth: (date) => date.month(),
  getDate: (date) => date.date(),
  getHour: (date) => date.hour(),
  getMinute: (date) => date.minute(),
  getSecond: (date) => date.second(),

  // set
  addYear: (date, diff) => date.add(diff, "year"),
  addMonth: (date, diff) => date.add(diff, "month"),
  addDate: (date, diff) => date.add(diff, "day"),
  setYear: (date, year) => date.year(year),
  setMonth: (date, month) => date.month(month),
  setDate: (date, num) => date.date(num),
  setHour: (date, hour) => date.hour(hour),
  setMinute: (date, minute) => date.minute(minute),
  setSecond: (date, second) => date.second(second),

  getMillisecond: (date) => date.millisecond(),
  setMillisecond: (date, second) => date.millisecond(second),

  // Compare
  isAfter: (date1, date2) => date1.isAfter(date2),
  isValidate: (date) => date.isValid(),
  locale: {
    getWeekFirstDate: (locale, date) => date.locale(parseLocale(locale)).weekday(0),
    getWeekFirstDay: (locale) => dayjs().locale(parseLocale(locale)).localeData().firstDayOfWeek(),
    getWeek: (locale, date) => date.locale(parseLocale(locale)).week(),
    getShortWeekDays: (locale) => dayjs().locale(parseLocale(locale)).localeData().weekdaysMin(),
    getShortMonths: (locale) => dayjs().locale(parseLocale(locale)).localeData().monthsShort(),
    format: (locale, date, format) => {
      return date.locale(parseLocale(locale)).format(format);
    },
    parse: (locale, text, formats) => {
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
  isLeapYear: (date: Dayjs) => {
    const year = date.year();
    return isLeapYear(year);
  },

  getDaysInMonth: (date: Dayjs) => {
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
