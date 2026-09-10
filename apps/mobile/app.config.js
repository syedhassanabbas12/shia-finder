module.exports = {
  expo: {
    name: 'Mihrab',
    slug: 'mihrab',
    scheme: 'mihrab',
    version: '0.1.0',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    ios: {
      bundleIdentifier: 'org.mihrab.app',
      supportsTablet: true,
      config: { usesNonExemptEncryption: false },
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "Mihrab uses your location to show the nearest mosque and how long the walk is. You can decline and search by city instead.",
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
      splash: {
        backgroundColor: '#f3f2f2',
        resizeMode: 'contain',
        dark: {
          backgroundColor: '#1c1a17',
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
