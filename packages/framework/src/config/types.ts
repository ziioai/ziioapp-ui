export interface ZiioAppConfig {
  packageName: string;
  app: {
    name: string;
    title: string;
    version?: string;
    description: string;
    aboutDescription: string;
    locale: string;
    sourceUrl: string;
  };
  navigation: {
    appMenu: ZiioAppMenu;
    mainMenu: ZiioAppMenu;
  };
  electron: {
    menu: {
      fileLabel: string;
      aboutLabel: string;
      settingsLabel: string;
    };
    windows: {
      main: ZiioAppWindowConfig;
      standalone: ZiioAppWindowConfig;
    };
    standaloneWindows: {
      about: ZiioAppStandaloneWindowConfig;
      settings: ZiioAppStandaloneWindowConfig;
    };
  };
}

export interface ZiioAppMenu {
  label: string;
  items: readonly ZiioAppMenuItem[];
}

export interface ZiioAppMenuItem {
  label: string;
  to: string;
  electronWindow?: "settings" | "about" | string;
}

export interface ZiioAppWindowConfig {
  title?: string;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
}

export interface ZiioAppStandaloneWindowConfig {
  path: string;
  title: string;
}

export type ZiioAppRoutePath = string;
