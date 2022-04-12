import { addWeeks, endOfMonth, format, isSameDay, isWeekend, setDay, startOfMonth } from 'date-fns';

export type WeekStarsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Month = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface HolyDay {
  date: Date;
  props?: any;
}

export interface ICreateWeek {
  date: Date;
  baseMonth: Date;
  pattern?: string;
  weekStartsOn: WeekStarsOn;
  holyDays?: HolyDay[];
}

export interface ICreateMonthMatrix {
  year: number;
  month: Month;
  pattern?: string;
  weekStartsOn?: WeekStarsOn;
  holyDays?: HolyDay[];
}

export const createWeek = ({ date, baseMonth, pattern, weekStartsOn, holyDays }: ICreateWeek) => {
  const week = [];
  let dayOfWeek = 0;

  let isFirstWeek = false;
  let isLastWeek = false;

  while (dayOfWeek < 7) {
    const day = setDay(date, dayOfWeek, { weekStartsOn });

    const formattedDate = pattern ? format(day, pattern, { weekStartsOn }) : day;

    const holyDay = holyDays?.find(mapHolyDay => isSameDay(mapHolyDay.date, day));

    const objToAdd = {
      date: formattedDate,
      isWeekend: isWeekend(day),
      ...(holyDays ? { holyDay, isHolyday: !!holyDay } : {}),
    };

    week.push(objToAdd);

    if (!isFirstWeek) isFirstWeek = isSameDay(day, startOfMonth(baseMonth));

    if (!isLastWeek) isLastWeek = isSameDay(day, endOfMonth(baseMonth));

    dayOfWeek++;
  }

  return {
    isFirstWeek,
    isLastWeek,
    week,
  };
};

export const createMonthMatrix = ({
  year,
  month,
  pattern,
  weekStartsOn = 0,
  holyDays,
}: ICreateMonthMatrix) => {
  const matrix = [];
  const baseMonth = new Date(year, month, 1);

  let dateToWeek = baseMonth;
  let isLastWeek = false;

  do {
    const createdWeek = createWeek({
      date: dateToWeek,
      baseMonth,
      pattern,
      weekStartsOn,
      holyDays,
    });

    dateToWeek = addWeeks(dateToWeek, 1);

    matrix.push(createdWeek.week);

    isLastWeek = createdWeek.isLastWeek;
  } while (!isLastWeek);

  return matrix;
};
