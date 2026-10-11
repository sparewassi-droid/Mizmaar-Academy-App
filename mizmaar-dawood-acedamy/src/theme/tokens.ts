export const COLOR_TOKENS = {
  lapis: '#2A5CAA',
  lapisDark: '#1F4580',
  lapisDeep: '#163461',
  sky: '#CFE6FA',
  skyDeep: '#A9CFEF',
  sand: '#F2E8D5',
  sandLight: '#FAF5EA',
  sandDeep: '#E4D6BA',
  white: '#FFFFFF',
  brass: '#B8892B',
  brassLight: '#EBD9A8',
  ink: '#1B2A41',
  slate: '#5B6B7B',
  correct: '#2E9E5B',
  correctLight: '#D6EFDF',
  amber: '#E89B3C',
  amberLight: '#FBE6C8',
  clay: '#B5664A',
  clayLight: '#F0D5C9',
  teal: '#2F7F9E',
  tealLight: '#CDE7EE',
  sage: '#5F7F66',
  sageLight: '#D5E5DA',
  blush: '#F2D3C6',
} as const;

export const MOTION = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
  springThemeA: { type: 'spring', stiffness: 300, damping: 24 },
  springThemeB: { type: 'spring', stiffness: 420, damping: 32 },
  easeOutCubic: [0.215, 0.61, 0.355, 1],
};

export const TYPOGRAPHY = {
  themeA: {
    headingFont: 'font-nunito font-bold',
    labelFont: 'font-nunito font-semibold',
    bodyFont: 'font-nunito font-normal',
  },
  themeB: {
    headingFont: 'font-fraunces font-semibold',
    labelFont: 'font-dm-sans font-medium',
    bodyFont: 'font-dm-sans font-normal',
  },
  arabicFont: 'font-arabic',
};
