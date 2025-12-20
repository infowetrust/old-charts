import type { Point3D } from "../core/types";

type Vec3 = { x: number; y: number; z: number };

export function normalize3(v: Vec3): Vec3 {
  const mag = Math.hypot(v.x, v.y, v.z);
  if (mag === 0) return { x: 0, y: 0, z: 0 };
  return { x: v.x / mag, y: v.y / mag, z: v.z / mag };
}

export function quadNormal(p00: Point3D, p10: Point3D, p01: Point3D): Vec3 {
  const u = {
    x: p10.x - p00.x,
    y: p10.y - p00.y,
    z: p10.z - p00.z,
  };
  const v = {
    x: p01.x - p00.x,
    y: p01.y - p00.y,
    z: p01.z - p00.z,
  };

  const normal = {
    x: u.y * v.z - u.z * v.y,
    y: u.z * v.x - u.x * v.z,
    z: u.x * v.y - u.y * v.x,
  };

  return normalize3(normal);
}

export function lambert(
  normal: Vec3,
  lightDir: Vec3,
  ambient: number,
  diffuse: number
): number {
  const n = normalize3(normal);
  const l = normalize3(lightDir);
  const dot = Math.max(0, n.x * l.x + n.y * l.y + n.z * l.z);
  const brightness = ambient + diffuse * dot;
  return Math.min(1, Math.max(0, brightness));
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  const value = parseInt(
    clean.length === 3
      ? clean
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : clean,
    16
  );
  const r = (value >> 16) & 0xff;
  const g = (value >> 8) & 0xff;
  const b = value & 0xff;
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const value = (clamp(r) << 16) | (clamp(g) << 8) | clamp(b);
  return `#${value.toString(16).padStart(6, "0")}`;
}

export function makeRamp(
  lightHex: string,
  darkHex: string,
  steps: number
): string[] {
  const ramp: string[] = [];
  const light = hexToRgb(lightHex);
  const dark = hexToRgb(darkHex);
  const count = Math.max(2, steps);
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1);
    const r = light.r + t * (dark.r - light.r);
    const g = light.g + t * (dark.g - light.g);
    const b = light.b + t * (dark.b - light.b);
    ramp.push(rgbToHex(r, g, b));
  }
  return ramp;
}

export function pickRampColor(ramp: string[], brightness: number): string {
  if (ramp.length === 0) return "#000000";
  const clamped = Math.max(0, Math.min(1, brightness));
  const index = Math.min(
    ramp.length - 1,
    Math.floor((1 - clamped) * (ramp.length - 1))
  );
  return ramp[index];
}

export function quantize01(t: number, steps: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  if (steps < 2) return clamped;
  const quantized = Math.round(clamped * (steps - 1)) / (steps - 1);
  return Math.max(0, Math.min(1, quantized));
}

type InkAlphaArgs = {
  brightness: number;
  ambient: number;
  diffuse: number;
  steps: number;
  inkAlphaMax: number;
  gamma: number;
  shadowBias: number;
  alphaScale?: number;
};

export function inkAlphaFromBrightness({
  brightness,
  ambient,
  diffuse,
  steps,
  inkAlphaMax,
  gamma,
  shadowBias,
  alphaScale = 1,
}: InkAlphaArgs): number {
  const minB = Math.max(0, Math.min(1, ambient));
  const maxB = Math.max(minB, Math.min(1, ambient + diffuse));
  const range = maxB - minB;
  if (range <= 1e-6) return 0;

  let shadow = (maxB - brightness) / range;
  shadow = Math.max(0, Math.min(1, shadow));

  const bias = Math.max(0, Math.min(0.99, shadowBias));
  if (bias > 0) {
    shadow = (shadow - bias) / (1 - bias);
  }
  shadow = Math.max(0, Math.min(1, shadow));

  const gammaSafe = Math.max(0.01, gamma);
  shadow = Math.pow(shadow, gammaSafe);

  const quantSteps = Math.max(2, steps);
  if (quantSteps > 1) {
    shadow =
      Math.floor(shadow * (quantSteps - 1) + 1e-9) / (quantSteps - 1);
  }

  const alpha = inkAlphaMax * shadow * alphaScale;
  return Math.max(0, Math.min(inkAlphaMax * alphaScale, alpha));
}
