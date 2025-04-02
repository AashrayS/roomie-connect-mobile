
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c5e44fa0bde540f8af985970ee6361ef',
  appName: 'roomie-connect-mobile',
  webDir: 'dist',
  server: {
    url: 'https://c5e44fa0-bde5-40f8-af98-5970ee6361ef.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
    },
  },
};

export default config;
