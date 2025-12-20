import { projectIso, type ProjectionOptions } from "../../core/geometry";
import { type Frame3D } from "../../core/frame3d";
import type { Point2D, Point3D } from "../../core/types";
import {
  normalize3,
  quadNormal,
  lambert,
  inkAlphaFromBrightness,
} from "../shading";

type WallStyle = {
  wallFill: string;
  wallStroke: string;
  ageStroke: string;
  ageThin: number;
  ageThick: number;
  ageHeavyStep: number;
  ageThinOpacity: number;
  ageThickOpacity: number;
  valueStroke: string;
  valueThin: number;
  valueThick: number;
  valueHeavyStep: number;
  valueThinOpacity: number;
  valueThickOpacity: number;
  surfaceFill: string;
  surfaceStroke?: string;
  surfaceStrokeWidth?: number;
};

type RightWallProps = {
  surfacePoints: Point3D[];
  rows: number;
  cols: number;
  projection: ProjectionOptions;
  floorZ: number;
  ages: number[];
  maxSurvivors: number;
  valueStep: number;
  frame: Frame3D;
  shading?: {
    enabled: boolean;
    ambient: number;
    diffuse: number;
    steps: number;
    lightDir: { x: number; y: number; z: number };
    inkColor: string;
    inkAlphaMax: number;
    gamma: number;
    shadowBias: number;
    alphaScale?: {
      surface?: number;
      backWall?: number;
      rightWall?: number;
      floor?: number;
    };
  };
  style: WallStyle;
};

export default function RightWall({
  surfacePoints,
  rows,
  cols,
  projection,
  floorZ,
  ages,
  maxSurvivors,
  valueStep,
  frame,
  shading,
  style,
}: RightWallProps) {
  if (rows <= 0 || cols <= 0 || surfacePoints.length === 0) {
    return null;
  }

  void valueStep;

  const colMax = cols - 1;
  const yearMax = frame.maxYear;
  const ageStart = ages[0] ?? 0;
  const ageEnd = ages[ages.length - 1] ?? ageStart;
  const shadingConfig = shading && shading.enabled ? shading : null;
  const lightVec = shadingConfig ? normalize3(shadingConfig.lightDir) : null;
  const wallNormal =
    shadingConfig && lightVec
      ? quadNormal(
        frame.point(yearMax, ageStart, 0),
        frame.point(yearMax, ageEnd, 0),
        frame.point(yearMax, ageStart, maxSurvivors)
      )
      : null;
  const wallAlpha =
    shadingConfig && lightVec && wallNormal
      ? inkAlphaFromBrightness({
        brightness: lambert(
          wallNormal,
          lightVec,
          shadingConfig.ambient,
          shadingConfig.diffuse
        ),
        ambient: shadingConfig.ambient,
        diffuse: shadingConfig.diffuse,
        steps: shadingConfig.steps,
        inkAlphaMax: shadingConfig.inkAlphaMax,
        gamma: shadingConfig.gamma,
        shadowBias: shadingConfig.shadowBias,
        alphaScale: shadingConfig.alphaScale?.rightWall ?? 1,
      })
      : 0;
  const zSpan = frame.maxZ - frame.floorZ || 1;
  const clipPathId = "rightWallClip";

  const wallTop: Point2D[] = [];
  const wallFloor: Point2D[] = [];
  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const age = ages[rowIndex] ?? ages[0] ?? 0;
    const topPoint3D = surfacePoints[rowIndex * cols + colMax];
    const zNorm = topPoint3D?.z ?? frame.floorZ;
    const value =
      frame.maxSurvivors > 0
        ? ((zNorm - frame.floorZ) / zSpan) * frame.maxSurvivors
        : 0;
    wallTop.push(projectIso(frame.point(yearMax, age, value), projection));
    wallFloor.push(projectIso(frame.point(yearMax, age, 0), projection));
  }

  const wallBottom = [...wallFloor].reverse();
  const polygonPoints = [...wallTop, ...wallBottom];
  const polygonString = polygonPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const ageBase = ages[0] ?? 0;
  const ageLines = wallTop.map((topPoint, rowIndex) => {
    const bottomPoint = wallFloor[rowIndex];
    const age = ages[rowIndex] ?? ageBase + rowIndex * 5;
    const heavy =
      style.ageHeavyStep > 0
        ? (age - ageBase) % style.ageHeavyStep === 0
        : age === ageBase;
    return {
      key: `age-${age}-${rowIndex}`,
      top: topPoint,
      bottom: bottomPoint,
      heavy,
    };
  });

  const minorStep = 10_000;
  const valueLines: {
    key: string;
    start: Point2D;
    end: Point2D;
    heavy: boolean;
  }[] = [];
  for (let level = 0; level <= maxSurvivors; level += minorStep) {
    const start = projectIso(frame.point(yearMax, ageStart, level), projection);
    const end = projectIso(frame.point(yearMax, ageEnd, level), projection);
    valueLines.push({
      key: `val-${level}`,
      start,
      end,
      heavy:
        style.valueHeavyStep > 0
          ? level % style.valueHeavyStep === 0
          : level === 0,
    });
  }

  if (
    maxSurvivors > 0 &&
    maxSurvivors % minorStep !== 0 &&
    valueLines[valueLines.length - 1]?.key !== `val-${maxSurvivors}`
  ) {
    const level = maxSurvivors;
    const start = projectIso(frame.point(yearMax, ageStart, level), projection);
    const end = projectIso(frame.point(yearMax, ageEnd, level), projection);
    valueLines.push({
      key: `val-${level}`,
      start,
      end,
      heavy:
        style.valueHeavyStep > 0
          ? level % style.valueHeavyStep === 0
          : level === 0,
    });
  }

  if (valueLines.length === 0) {
    const start = projectIso(frame.point(yearMax, ageStart, 0), projection);
    const end = projectIso(frame.point(yearMax, ageEnd, 0), projection);
    valueLines.push({
      key: "val-0",
      start,
      end,
      heavy: true,
    });
  }

  return (
    <>
      <defs>
        <clipPath id={clipPathId}>
          <polygon points={polygonString} />
        </clipPath>
      </defs>

      <polygon
        points={polygonString}
        fill={style.surfaceFill}
        stroke={style.surfaceStroke ?? style.wallStroke}
        strokeWidth={style.surfaceStrokeWidth}
      />
      {wallAlpha > 0 && shadingConfig && (
        <polygon
          points={polygonString}
          fill={shadingConfig.inkColor}
          fillOpacity={Math.min(1, wallAlpha)}
          stroke="none"
        />
      )}

      <g clipPath={`url(#${clipPathId})`}>
        {ageLines.map((line) => (
          <line
            key={line.key}
            x1={line.top.x}
            y1={line.top.y}
            x2={line.bottom.x}
            y2={line.bottom.y}
            stroke={style.ageStroke}
            strokeWidth={line.heavy ? style.ageThick : style.ageThin}
            strokeOpacity={
              line.heavy ? style.ageThickOpacity : style.ageThinOpacity
            }
            strokeLinecap="round"
          />
        ))}

        {valueLines.map((line) => (
          <line
            key={line.key}
            x1={line.start.x}
            y1={line.start.y}
            x2={line.end.x}
            y2={line.end.y}
            stroke={style.valueStroke}
            strokeWidth={line.heavy ? style.valueThick : style.valueThin}
            strokeOpacity={
              line.heavy ? style.valueThickOpacity : style.valueThinOpacity
            }
            strokeLinecap="round"
          />
        ))}
      </g>
    </>
  );
}
