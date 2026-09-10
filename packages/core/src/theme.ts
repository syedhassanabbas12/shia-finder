// Design tokens translated from the Nocturne design system
// (_ds/nocturne-*/styles.css) into plain JS so both the web app (as CSS
// variables) and the React Native app (as StyleSheet values) read from one
// source. Keep these in sync with styles.css if the design changes.

export const fonts = {
  heading: 'Inter', // RN: load via expo-font; web: Google Fonts import
  headingWeight: '500',
  body: 'Inter',
};

export const space = {
  1: 2.8,
  2: 5.6,
  3: 8.4,
  4: 11.2,
  6: 16.8,
  8: 22.4,
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 14,
};

const darkColors = {
  bg: '#161826',
  surface: '#232532',
  text: '#e9e9ed',
  accent: '#9184d9',
  accent2: '#a7a1db',
  divider: 'rgba(233,233,237,0.16)',

  neutral100: '#2b2e3d',
  neutral200: '#333650',
  neutral300: '#3f424d',
  neutral400: '#595d6c',
  neutral500: '#75798c',
  neutral600: '#9397ab',
  neutral700: '#b2b6ca',
  neutral800: '#cfd3e5',
  neutral900: '#f3f5fe',

  accent100: '#2b2741',
  accent200: '#423a6a',
  accent300: '#5d5294',
  accent700: '#b5abfc',
  accent800: '#d2cefd',

  shadowSm: '0 0 0 1px #3f424d',
  shadowMd: '0 0 0 1px #595d6c, 0 6px 18px rgba(0,0,0,0.55)',
  shadowLg: '0 0 0 1px #9397ab, 0 16px 40px rgba(0,0,0,0.65)',
};

const lightColors = {
  bg: '#f3f5fe',
  surface: '#e9ecf8',
  text: '#292b31',
  accent: '#796cbf',
  accent2: '#7972a9',
  divider: 'rgba(41,43,49,0.16)',

  neutral100: '#eef1fa',
  neutral200: '#e4e7f5',
  neutral300: '#cfd3e5',
  neutral400: '#b2b6ca',
  neutral500: '#9397ab',
  neutral600: '#75798c',
  neutral700: '#595d6c',
  neutral800: '#3f424d',
  neutral900: '#292b31',

  accent100: '#e7e5fe',
  accent200: '#d2cefd',
  accent300: '#b5abfc',
  accent700: '#423a6a',
  accent800: '#5d5294',

  shadowSm: '0 1px 2px rgba(41,43,49,.14)',
  shadowMd: '0 4px 14px rgba(41,43,49,.16)',
  shadowLg: '0 14px 36px rgba(41,43,49,.22)',
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
