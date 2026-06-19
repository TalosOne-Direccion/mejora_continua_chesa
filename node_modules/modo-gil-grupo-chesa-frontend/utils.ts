import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function canEditModo(userName?: string): boolean {
  if (!userName) return false;
  return ['Carlos Barrientos', 'Ivonne', 'Armando'].includes(userName);
}

export function canApprovePhase(userName?: string): boolean {
  if (!userName) return false;
  return ['Carlos Barrientos', 'Ivonne', 'Armando'].includes(userName);
}