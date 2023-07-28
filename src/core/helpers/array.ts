export const getArrayFromRange = (end: number, start = 1) => {
  const result = Array.from({ length: (end - start) / 1 + 1 }, (value, i) => start + i);

  return result;
};
