export const sizes = {
  xxxs: 20,
  xxs: 24,
  xs: 28,
  sm: 32,
  md: 36,
  lg: 40,
  xxl: 50,
  full: '100%',
} as const;

export type Size = keyof typeof sizes;
