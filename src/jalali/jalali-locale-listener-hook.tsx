import { useEffect } from "react";
import dayjs from "dayjs";
import { useLocale } from "antd/lib/locale";

/**
 * Subscribes to the ConfigProvider locale changes and updates the dayjs calendar based on current locale.
 */
const JalaliLocaleListener = () => {
  const { locale } = useLocale();

  useEffect(() => {
    if (locale?.locale === "fa_IR") {
      // @ts-ignore
      dayjs["calendar"]?.("jalali");
    } else {
      // @ts-ignore
      dayjs["calendar"]?.(undefined);
    }
  }, [locale]);

  return null;
};

export default JalaliLocaleListener;
