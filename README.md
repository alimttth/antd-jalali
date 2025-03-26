[![npm (scoped with tag)](https://img.shields.io/npm/v/antd-jalali-persian/latest.svg?style=flat-square)](https://npmjs.com/package/antd-jalali-persian)
[![npm](https://img.shields.io/npm/dt/antd-jalali-persian.svg?style=flat-square)](https://npmjs.com/package/antd-jalali-persian)

# Ant-Design Jalali DatePicker

A wrapper for ant-design date picker and calendar to support Jalali calendar type with [Day.js](https://github.com/iamkun/dayjs) and [jalaliday](https://github.com/alibaba-aero/jalaliday)

## Demo

[https://jaali.github.io/antd-jalali-persian/](https://jaali.github.io/antd-jalali-persian/)

## Top Features

- Support Ant Design Version 4 and 5
- Support React 16/17/18
- Fix All RTL Issues

## Installation

### Ant version 5.x.x

```
npm i antd-jalali-persian@v2.x.x
```

### Ant version 4.x.x

```
npm i antd-jalali-persian@v1.4.x
```

## Usage

```ts
import React from "react";
import ReactDOM from "react-dom";
import { DatePicker, ConfigProvider } from "antd";
import { DatePicker as DatePickerJalali, Calendar, JalaliLocaleListener } from "antd-jalali-persian";
import fa_IR from "antd/lib/locale/fa_IR";
import en_US from "antd/lib/locale/en_US";
import "antd/dist/antd.css";
import "./index.css";

ReactDOM.render(
  <div className="App">
    Gregorian: <DatePicker />
    <br />
    <br />
    <ConfigProvider locale={fa_IR} direction="rtl">
      <JalaliLocaleListener />
      Jalali: <DatePickerJalali />
      Jalali RangePicker: <DatePickerJalali.RangePicker />
      <br />
      <br />
      <Calendar />
    </ConfigProvider>
  </div>,
  document.getElementById("root")
);
```

### How to set value

You should pass dayjs object with [jalali calendar](https://github.com/alibaba-aero/jalaliday)

```jsx
import dayjs from 'dayjs'
import { DatePicker as DatePickerJalali, Calendar as CalendarJalali, useJalaliLocaleListener } from "antd-jalali-persian";

// You should call this hook in child component of <ConfigProvider>
// You can also use component helper for this hook <JalaliLocaleListener>
useJalaliLocaleListener();

// If you want to all new instanses of dayjs use jalali calendar (no matter what is the locale),
// you can set default calendar for dayjs and remove useJalaliLocaleListener hook.
dayjs.calendar('jalali');

const date = dayjs("1403-01-01", {jalali:true});

<DatePickerJalali defaultValue={date}/>
<CalendarJalali  value={date}/>
```

also you can create a jalali date without changing default calendar

```js
const date = dayjs();
const jalaliDate = date.calendar("jalali");
```

You can read more information about daysjs jalali on [jalaliday repo](https://github.com/alibaba-aero/jalaliday).

## Contributors

<a href="https://github.com/jaali">
<img src="https://github.com/jaali.png" width="60px;"/></a>
