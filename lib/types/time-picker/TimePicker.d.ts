import { Dayjs } from "dayjs";
import * as React from "react";
import type { PickerProps } from "antd/es/date-picker/generatePicker";
export interface TimePickerProps extends Omit<PickerProps<Dayjs>, "picker"> {
}
declare const TimePicker: React.ForwardRefExoticComponent<TimePickerProps & React.RefAttributes<any>>;
export default TimePicker;
//# sourceMappingURL=TimePicker.d.ts.map