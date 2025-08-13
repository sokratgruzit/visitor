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

function parseValue(val: string | number, pos: string): number {
  if(val === undefined) return 0;

  let size = window.innerWidth;

  if (pos === "top") size = window.innerHeight;

  if (typeof val === "number") return val;

  if (val.startsWith("half-")) {
    const offset = Number(val.split("-")[1]);
    return size / 2 - offset;
  }

  if (val.startsWith("full-")) {
    const offset = Number(val.split("-")[1]);
    return size - offset;
  }

  return Number(val);
}

export const parseCircleConfig = (conf: any): any => ({
  left: parseValue(conf.left, "left"),
  top: parseValue(conf.top, "top"),
  width: conf.width,
  height: conf.height,
  rotate: conf.rotate
});

export function getPositionConfig(width: number, config: any, type: string): { 
  s?: number; 
  dist?: number; 
  pos?: { left: number; top: number; rotate: number };
  width?: number | string; 
  height?: number | string;
  left?: number | string;
  top?: number | string;
  rotate?: number | string;
} {
  let s = config.s || 1;
  let dist = config.dist || 3;
  let left = config.left || 0;
  let top = config.top || 0;
  let rotate = config.rotate || 0;
  let w = config.width || 0;
  let h = config.height || 0;
  let r = config.rotate || 0;

  const bpts = type === "circle" ? config : config.breakpoints;

  // Применяем брейкпоинты
  if (bpts.length === 5) {
    let bp = bpts[4];

    if (width <= 440) bp = bpts[0];
    if (width > 440 && width <= 768) bp = bpts[1];
    if (width > 768 && width <= 1150) bp = bpts[2];
    if (width > 1150 && width <= 1280) bp = bpts[3];

    if (bp.s !== undefined) s = bp.s;
    if (bp.dist !== undefined) dist = bp.dist;

    if (bp.left !== undefined) left = parseValue(bp.left, "left");
    if (bp.top !== undefined) top = parseValue(bp.top, "top");
    if (bp.width !== undefined) w = bp.width;
    if (bp.height !== undefined) h = bp.height;
    if (bp.rotate !== undefined) r = bp.rotate;
  }

  interface Result { 
    s?: number; 
    dist?: number; 
    width?: number | string; 
    height?: number | string;
    left?: number | string;
    top?: number | string;
    rotate?: number | string;
  }

  let result: Result = {
    s,
    dist,
    left: left,
    top: top,
    rotate: rotate || 0
  };

  if (type === "circle") {
    result = {
      width: w,
      height: h,
      left,
      top,
      rotate: r
    };
  }

  return result;
}

export const invertHexColor = (hex: string): string => {
  // Убираем # если есть
  hex = hex.replace("#", "");

  // Если короткий формат, например 'abc', расширяем до 'aabbcc'
  if (hex.length === 3) {
    hex = hex.split("").map((c) => c + c).join("");
  }

  // Парсим цвет в число
  const r = 255 - parseInt(hex.slice(0, 2), 16);
  const g = 255 - parseInt(hex.slice(2, 4), 16);
  const b = 255 - parseInt(hex.slice(4, 6), 16);

  // Формируем обратно HEX с ведущими нулями
  const inverted = "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("");

  return inverted;
}

