import { CapacitorConfig } from '@capacitor/cli'
import 'dotenv/config'

const config: CapacitorConfig = {
  appId: 'com.honeylabs.app',
  appName: 'HoneyLabs',
  webDir: 'out',
  plugins: {
    Capgo: {
      appId: 'honeylabs',
      liveUpdates: true,
      channel: 'prod',
      publicKey: process.env.COSIGN_PUBLIC_KEY || '',
    },
  },
}

export default config
