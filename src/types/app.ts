export interface AppInfo {
  version: string;
  url: string;
  sha256: string;
  building: boolean;
  progress: number; // 0-1
}
