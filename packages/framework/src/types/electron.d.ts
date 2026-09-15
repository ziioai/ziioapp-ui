interface ElectronAPI {
  getAppInfo: () => Promise<{
    version: string;
    name: string;
    platform: string;
    electronVersion: string;
    nodeVersion: string;
  }>;
  platform: string;
  minimizeWindow: () => void;
  toggleMaximizeWindow: () => Promise<boolean>;
  closeWindow: () => void;
  onMaximizeChange: (callback: (isMaximized: boolean) => void) => () => void;
  getZoomFactor: () => number;
  openSettingsWindow: () => Promise<void>;
  openAboutWindow: () => Promise<void>;
  openStandaloneWindow: (route: string, title: string) => Promise<void>;
  onZoomFactorChange: (callback: (factor: number) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
