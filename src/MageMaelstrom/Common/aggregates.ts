export function aggMult<T>(array: T[], get: (item: T) => number): number {
  return array.length > 0
    ? array.reduce((mult, current) => (mult *= get(current)), 1)
    : 1;
}

export function aggSum<T>(array: T[], get: (item: T) => number): number {
  return array.length > 0
    ? array.reduce((sum, current) => (sum += get(current)), 0)
    : 0;
}

export function aggMax<T>(
  array: T[],
  get: (item: T) => number,
  min: number
): number {
  return array.length > 0
    ? array.reduce(
        (max, current) => (max < get(current) ? get(current) : max),
        min
      )
    : min;
}
