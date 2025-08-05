import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { humanId } from 'human-id';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function generateSlug() {
  return humanId({
    separator: '-',
    capitalize: false,
    addAdverb: true,
  }) + '-' + Math.floor(Math.random() * 100000);
}