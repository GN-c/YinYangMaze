namespace Utils {
  export const TWO_PI = 2 * Math.PI;

  export function times(amount: number, callback: (index: number) => void) {
    for (let i = 0; i < amount; i++) callback(i);
  }

  export function timesMap<T>(
    amount: number,
    callback: (index: number) => T
  ): T[] {
    const arr: T[] = [];
    for (let i = 0; i < amount; i++) arr.push(callback(i));
    return arr;
  }

  export function pick<T>(array: T[], index: number): T {
    const len = array.length;
    return array[(len + index) % len];
  }

  export function iterate<T>(
    array: T[] | T[][] | T,
    callback: (element: T) => void
  ): void {
    if (Array.isArray(array)) array.forEach((el) => iterate(el, callback));
    else callback(array);
  }

  export function last<T>(array: T[]) {
    return array[array.length - 1];
  }

  export function average(array: number[]): number {
    return array.reduce((sum, num) => sum + num, 0) / array.length;
  }

  export function shortestAngle(angleA: number, angleB: number) {
    const diff = angleB - angleA;
    if (diff == 0) return 0;

    const t = Math.floor((diff + Math.PI) / TWO_PI);
    return diff - t * TWO_PI;
  }
}

export default Utils;
