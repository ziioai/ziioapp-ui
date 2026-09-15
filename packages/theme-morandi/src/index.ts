export const morandiThemes = [
  {
    name: "morandi-sage",
    label: "鼠尾草",
    group: "莫兰迪",
    package: "@ziioapp/theme-morandi",
  },
  {
    name: "morandi-dust",
    label: "尘粉",
    group: "莫兰迪",
    package: "@ziioapp/theme-morandi",
  },
  {
    name: "morandi-fog",
    label: "雾蓝",
    group: "莫兰迪",
    package: "@ziioapp/theme-morandi",
  },
] as const;

export type MorandiThemeName = (typeof morandiThemes)[number]["name"];
