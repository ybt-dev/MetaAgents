import { clsx } from 'clsx';
import { twMerge, ClassNameValue } from 'tailwind-merge';

export function tailwindClsx(...inputs: ClassNameValue[]) {
  return twMerge(clsx(inputs));
}
