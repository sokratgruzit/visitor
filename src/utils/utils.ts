export function parseColor(hex: string) {
  if (hex[0] === "#") hex = hex.slice(1);
  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

export function clamp(num: number, min: number, max: number) {
  return num < min ? min : num > max ? max : num;
}

export function randomPhase() {
  return Math.random() * 2 * Math.PI;
}

