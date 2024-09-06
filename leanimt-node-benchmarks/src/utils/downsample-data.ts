const downsampleArray = (arr: number[], rate: number): number[] => {
  return arr.filter((_, index) => index % rate === 0)
}

export function downsampleData(array: any[], downsampleRate: number) {
  // Downsample data for better visualization

  return downsampleArray(array, downsampleRate)
}
