// Re-exports @mihrab/core's plain-JS theme tokens with a couple of RN-only
// helpers (StyleSheet doesn't understand CSS var() references, so screens
// pull colors from theme.colors directly, keyed by the current ThemeName).
import { getTheme, type ThemeName } from '@mihrab/core';
export { getTheme };
export type { ThemeName };
