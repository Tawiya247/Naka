import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.naka.client",
  appName: "NAKA",
  webDir: "dist",
  android: {
    allowMixedContent: false,
  },
};

export default config;
