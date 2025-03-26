const { DatePicker } = require('antd-jalali-persian');
const dayjs = require('dayjs');
require('dayjs/locale/fa');

// تست سال ۱۴۰۳
const date1403 = dayjs('1403-12-29', { jalali: true });
console.log('Is 1403 leap year?', DatePicker.isLeapYear(date1403));

// تست تعداد روزهای اسفند ۱۴۰۳
const esfand1403 = dayjs('1403-12-01', { jalali: true });
console.log('Days in Esfand 1403:', DatePicker.getDaysInMonth(esfand1403));

// تست سال ۱۴۰۴
const date1404 = dayjs('1404-01-01', { jalali: true });
console.log('First day of 1404:', date1404.format('YYYY-MM-DD')); 