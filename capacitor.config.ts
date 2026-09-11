import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pahamtukang.app',
  appName: 'PahamTukang',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Haptics: {},
    Camera: {}
  }
};

export default config;
