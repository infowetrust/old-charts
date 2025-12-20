import type { Point3D } from "./types";

export type Frame3D = {
  minYear: number;
  maxYear: number;
  yearStep: number;
  minAge: number;
  maxAge: number;
  ageStep: number;
  floorZ: number;
  maxZ: number;
  maxSurvivors: number;
  point: (year: number, age: number, value: number) => Point3D;
};

type FrameArgs = {
  surfacePoints: Point3D[];
  rows: number;
  cols: number;
  years: number[];
  ages: number[];
  floorZ: number;
  maxSurvivors: number;
};

export function makeFrame3D({
  surfacePoints,
  rows,
  cols,
  years,
  ages,
  floorZ,
  maxSurvivors,
}: FrameArgs): Frame3D {
  if (years.length < 2) {
    throw new Error("makeFrame3D requires at least two year values");
  }
  if (ages.length < 2) {
    throw new Error("makeFrame3D requires at least two age values");
  }
  if (surfacePoints.length !== rows * cols) {
    throw new Error("makeFrame3D expects surfacePoints to cover rows*cols");
  }

  const minYear = years[0];
  const maxYear = years[years.length - 1];
  const minAge = ages[0];
  const maxAge = ages[ages.length - 1];
  const yearStep = years[1] - years[0];
  const ageStep = ages[1] - ages[0];

  const rowZero = (() => {
    const idx = ages.indexOf(0);
    if (idx >= 0 && idx < rows) return idx;
    return 0;
  })();

  const idx00 = rowZero * cols;
  const idx01 = idx00 + 1;
  const rowAgeBasis = Math.min(rowZero + 1, rows - 1);
  const idx10 = rowAgeBasis * cols;

  const origin = surfacePoints[idx00];
  const yearPoint = surfacePoints[idx01];
  const agePoint = surfacePoints[idx10];

  if (!origin || !yearPoint || !agePoint) {
    throw new Error("makeFrame3D could not derive base ridge vectors");
  }

  const originXY = { x: origin.x, y: origin.y };
  const yearBasis = { x: yearPoint.x - origin.x, y: yearPoint.y - origin.y };
  const ageBasis = { x: agePoint.x - origin.x, y: agePoint.y - origin.y };

  let maxZ = floorZ;
  for (const pt of surfacePoints) {
    if (pt.z > maxZ) maxZ = pt.z;
  }

  function point(year: number, age: number, value: number): Point3D {
    const tYear = yearStep !== 0 ? (year - minYear) / yearStep : 0;
    const tAge = ageStep !== 0 ? (age - 0) / ageStep : 0;
    const x = originXY.x + tYear * yearBasis.x + tAge * ageBasis.x;
    const y = originXY.y + tYear * yearBasis.y + tAge * ageBasis.y;
    let z = floorZ;
    if (maxSurvivors > 0 && maxZ !== floorZ) {
      z = floorZ + (value / maxSurvivors) * (maxZ - floorZ);
    }
    return { x, y, z };
  }

  return {
    minYear,
    maxYear,
    yearStep,
    minAge,
    maxAge,
    ageStep,
    floorZ,
    maxZ,
    maxSurvivors,
    point,
  };
}
