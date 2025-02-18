import dayjs from 'dayjs';

export const format = (date: Date, format: string) => {
  return dayjs(date).format(format);
};
