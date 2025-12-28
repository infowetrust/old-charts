export type AxisLabelStyle = {
  color: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  opacity: number;
};

export type AxisLabelBaseStyle = Omit<AxisLabelStyle, "color">;

export type AxisLabelLayout = {
  side: "left" | "right" | "both";
  tickLen: number;
  textOffset: number;
};

export type LineStyle = {
  stroke: string;
  thinWidth: number;
  thickWidth: number;
  thinOpacity: number;
  thickOpacity: number;
  heavyStep: number;
};

export const HOVER_HIGHLIGHT_MULT = 2;
export const HOVER_DIM_MULT = 0.85;

export function isHeavy(value: number, heavyStep: number): boolean {
  if (!heavyStep) return false;
  return value % heavyStep === 0;
}

export type ShadingConfig = {
  enabled: boolean;
  ambient: number;
  diffuse: number;
  steps: number;
  lightDir: { x: number; y: number; z: number };
  inkColor: string;
  inkAlphaMax: number;
  gamma: number;
  shadowBias: number;
  alphaScale: {
    surface: number;
    backWall: number;
    rightWall: number;
    floor: number;
  };
};
