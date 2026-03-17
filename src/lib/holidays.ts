import { isWeekend, format, differenceInCalendarDays } from "date-fns";

// Array con los Días y Meses de Feriados en formato MM-dd
export const NATIONAL_HOLIDAYS_ARGENTINA = [
    "03-20",
    "03-23",
    "03-24",
    "04-02",
    "04-03",
    "04-08",
    "04-09",
    "04-24",
    "05-01",
    "05-25",
    "05-27",
    "06-15",
    "06-17",
    "06-20",
    "07-09",
    "07-10",
    "08-17",
    "09-12",
    "09-13",
    "09-21",
    "10-12",
    "10-21",
    "11-23",
    "12-07",
    "12-08",
    "12-25"
];

export function isHoliday(date: Date): boolean {
    const monthDay = format(date, "MM-dd");
    return NATIONAL_HOLIDAYS_ARGENTINA.includes(monthDay);
}

export function isBusinessDay(date: Date): boolean {
    return !isWeekend(date) && !isHoliday(date);
}

export function calculateVacationDays(startDate: Date, endDate: Date): number {
    return differenceInCalendarDays(endDate, startDate) + 1;
}

// Para Días Especiales: Días que pasan, excluyendo findes y feriados
export function calculateSpecialDays(startDate: Date, endDate: Date): number {
    let days = 0;
    const curDate = new Date(startDate);
    curDate.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    while (curDate <= end) {
        if (isBusinessDay(curDate)) {
            days++;
        }
        curDate.setDate(curDate.getDate() + 1);
    }
    return days;
}
