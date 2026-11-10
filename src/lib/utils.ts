import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = "Kč"): string {
  // Czech formatting: 1 000 000 Kč
  return amount.toLocaleString("cs-CZ").replace(/\s/g, "\u00A0") + "\u00A0" + currency
}

export function formatNumber(val: number): string {
  return val.toLocaleString("cs-CZ").replace(/\s/g, "\u00A0")
}
