export function aggMult<T>(array: T[], get: (item: T) => number): number {
  return array.length > 0
    ? array.reduce((mult, current) => (mult *= get(current)), 1)
    : 1;
}

export function aggSum<T>(array: T[], get: (item: T) => number): number {
  return array.length > 0
    ? array.reduce((sum, current) => (sum += get(current)), 0)
    : 1;
}
