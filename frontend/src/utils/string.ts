const DEFAULT_TRUNCATE_LENGTH = 10;

export const truncate = (str: string, length = DEFAULT_TRUNCATE_LENGTH) => {
  if (str.length <= length) {
    return str;
  }

  return str.slice(0, length) + '...';
};
