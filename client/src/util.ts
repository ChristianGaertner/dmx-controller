import { Color } from "./types";

export const color2Hex = (color: Color): string => {
  let r = Math.round(color.R * 255).toString(16);
  if (r.length < 2) {
    r = "0" + r;
  }
  let g = Math.round(color.G * 255).toString(16);
  if (g.length < 2) {
    g = "0" + g;
  }
  let b = Math.round(color.B * 255).toString(16);
  if (b.length < 2) {
    b = "0" + b;
  }

  return `#${r}${g}${b}`;
};

export const hex2Color = (hex: string): Color | undefined => {
  const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!res) {
    return undefined;
  }

  return {
    R: parseInt(res[1], 16) / 255,
    G: parseInt(res[2], 16) / 255,
    B: parseInt(res[3], 16) / 255,
  };
};
