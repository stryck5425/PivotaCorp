import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScrollDistance(pixels: number): string {
  if (pixels < 100) {
    return `${pixels.toFixed(0)} px`;
  } else if (pixels < 1000) {
    const cm = pixels / 100;
    return `${cm.toFixed(1)} cm`;
  } else if (pixels < 10000) {
    const dm = pixels / 1000;
    return `${dm.toFixed(1)} dm`;
  } else if (pixels < 100000) {
    const m = pixels / 10000;
    return `${m.toFixed(1)} m`;
  } else {
    const km = pixels / 100000;
    return `${km.toFixed(1)} km`;
  }
}