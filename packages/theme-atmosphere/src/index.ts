export const atmosphereThemes = [
  {
    name: "atmosphere-sakura",
    label: "樱花",
    group: "氛围",
    package: "@ziioapp/theme-atmosphere",
  },
  {
    name: "atmosphere-coffee",
    label: "咖啡",
    group: "氛围",
    package: "@ziioapp/theme-atmosphere",
  },
  {
    name: "atmosphere-halloween",
    label: "万圣节",
    group: "氛围",
    package: "@ziioapp/theme-atmosphere",
  },
  {
    name: "atmosphere-literary",
    label: "人文",
    group: "氛围",
    package: "@ziioapp/theme-atmosphere",
  },
] as const;

export type AtmosphereThemeName = (typeof atmosphereThemes)[number]["name"];
