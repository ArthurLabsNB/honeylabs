import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.honeylabs.app',
  appName: 'HoneyLabs',
  webDir: 'out',
  plugins: {
    Capgo: {
      appId: 'honeylabs',
      liveUpdates: true,
      channel: 'prod',
    },
  },
}

export default config
