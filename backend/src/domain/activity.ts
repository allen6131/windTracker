export const activities = [
  "kitesurfing",
  "windsurfing",
  "sailing",
  "surfing",
  "fishing",
  "boating",
  "paragliding",
  "hiking",
  "general"
] as const;

export type Activity = (typeof activities)[number];

export const requestedFields = [
  "wind",
  "gusts",
  "waves",
  "swell",
  "tides",
  "currents",
  "temperature",
  "precipitation",
  "visibility",
  "alerts",
  "observations"
] as const;

export type RequestedField = (typeof requestedFields)[number];
