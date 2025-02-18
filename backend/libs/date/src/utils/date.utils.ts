import * as dayjs from 'dayjs';

export const getCurrentUtcDate = () => {
  return dayjs().utc().toDate();
};

export const getCurrentUnixTimestamp = () => {
  return dayjs().utc().unix();
};

export const getNearestHourInUnixTimestamp = () => {
  return dayjs().utc().startOf('hour').unix();
};

export const getUnixTimestampFromDate = (date: Date) => {
  return dayjs(date).utc().unix();
};

export const getHoursDifference = (from: Date, to: Date) => {
  return Math.abs(Math.floor(dayjs(to).diff(dayjs(from), 'hours')));
};

export const minusHoursFromDate = (date: Date, hours: number) => {
  return dayjs(date).subtract(hours, 'hours').toDate();
};

export const getSecondsDifference = (from: Date, to: Date) => {
  return Math.abs(Math.floor(dayjs(to).diff(dayjs(from), 'seconds')));
};

export const addMinutesToDate = (date: Date, minutes: number) => {
  return dayjs(date).add(minutes, 'minutes').toDate();
};

export const addHoursToDate = (date: Date, hours: number) => {
  return dayjs(date).add(hours, 'hours').toDate();
};

export const addDaysToDate = (date: Date, days: number) => {
  return dayjs(date).add(days, 'days').toDate();
};

export const getNextDayStart = (date: Date) => {
  return dayjs(date).utc().add(1, 'days').startOf('day').toDate();
};
