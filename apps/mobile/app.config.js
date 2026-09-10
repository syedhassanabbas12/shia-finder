module.exports = {
  expo: {
    name: 'Mihrab',
    slug: 'mihrab',
    scheme: 'mihrab',
    version: '0.1.0',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    icon: './assets/icon.png',
    ios: {
      bundleIdentifier: 'org.mihrab.app',
      supportsTablet: true,
      config: { usesNonExemptEncryption: false },
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "Mihrab uses your location to show the nearest mosque and how long the walk is. You can decline and search by city instead.",
      },
      splash: {
        backgroundColor: '#161826',
        image: './assets/splash-icon-dark.png',
        resizeMode: 'contain',
      },
    },
    android: {
      package: 'org.mihrab.app',
      permissions: ['ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION'],
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY_ANDROID,
        },
      },
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon-foreground.png',
        monochromeImage: './assets/adaptive-icon-monochrome.png',
        backgroundColor: '#161826',
      },
      splash: {
        backgroundColor: '#f3f5fe',
        image: './assets/splash-icon-light.png',
        resizeMode: 'contain',
        dark: {
          backgroundColor: '#161826',
          image: './assets/splash-icon-dark.png',
        },
      },
    },
    plugins: [
      [
        'expo-location',
        {
          locationWhenInUsePermission:
            'Mihrab uses your location to show the nearest mosque and how long the walk is.',
        },
      ],
      'expo-splash-screen',
    ],
  },
};
