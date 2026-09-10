// Design tokens translated from the Classical design system
// (_ds/classical-*/styles.css) into plain JS so both the web app (as CSS
// variables) and the React Native app (as StyleSheet values) read from one
// source. Keep these in sync with styles.css if the design changes.

export const fonts = {
  heading: 'Cormorant Garamond', // RN: load via expo-font; web: Google Fonts import
  headingWeight: '600',
  body: 'Lora',
};

export const space = {
  1: 4.6,
  2: 9.2,
  3: 13.8,
  4: 18.4,
  6: 27.6,
  8: 36.8,
};

export const radius = {
  sm: 2,
  md: 4,
  lg: 7,
};

const lightColors = {
  bg: '#f3f2f2',
  surface: '#eae9e9',
  text: '#201f1d',
  accent: '#b68235',
  accent2: '#ac803e',
  divider: 'rgba(32,31,29,0.16)',

  neutral100: '#f8f4f4',
  neutral200: '#eae7e7',
  neutral300: '#d7d3d3',
  neutral400: '#bab6b6',
  neutral500: '#9b9797',
  neutral600: '#7d7979',
  neutral700: '#605d5d',
  neutral800: '#444141',
  neutral900: '#2d2b2b',

  accent100: '#fff3e4',
  accent200: '#ffe3bf',
  accent300: '#facb8d',
  accent700: '#7d5411',
  accent800: '#5a3b0a',

  shadowSm: '0 1px 2px rgba(45,43,43,0.14)',
  shadowMd: '0 3px 10px rgba(45,43,43,0.16)',
  shadowLg: '0 12px 32px rgba(45,43,43,0.22)',
};

const darkColors = {
  bg: '#1c1a17',
  surface: '#272420',
  text: '#f3eee5',
  accent: '#dcb271',
  accent2: '#dcb271',
  divider: 'rgba(243,238,229,0.18)',

  neutral100: '#232019',
  neutral200: '#2d2a23',
  neutral300: '#3c382f',
  neutral400: '#4a463c',
  neutral500: '#726b5c',
  neutral600: '#a49b8b',
  neutral700: '#c0b7a6',
  neutral800: '#ece5d8',
  neutral900: '#f3eee5',

  accent100: '#332718',
  accent200: '#3f311d',
  accent300: '#5c4526',
  accent700: '#eccd97',
  accent800: '#f2dbb1',

  shadowSm: '0 1px 2px rgba(0,0,0,0.5)',
  shadowMd: '0 3px 12px rgba(0,0,0,0.55)',
  shadowLg: '0 12px 32px rgba(0,0,0,0.65)',
};

export type ThemeName = 'light' | 'dark';
export type ThemeColors = typeof lightColors;

export const colors: Record<ThemeName, ThemeColors> = {
  light: lightColors,
  dark: darkColors,
};

export function getTheme(name: ThemeName) {
  return { name, colors: colors[name], fonts, space, radius };
}

export type Theme = ReturnType<typeof getTheme>;
