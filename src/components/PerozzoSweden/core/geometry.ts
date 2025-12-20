/*
defines the physics (how space and projection work)
Reusable functions for generating and projecting 3D surfaces.
*/

import type { Point2D, Point3D } from "./types";

export type AxonometricBasis = {
  origin: { x: number; y: number };
  basisX: { x: number; y: number };
  basisY: { x: number; y: number };
  basisZ: { x: number; y: number };
};

export type ProjectionOptions = {
  originX: number;
  originY: number;
  scaleXY: number;
  scaleZ: number;
  baseRotation?: number; // radians; rotation of (x,y) before projection
  basis: AxonometricBasis;
};

type LegacyProjectionParams = {
  originX: number;
  originY: number;
  scaleXY: number;
  scaleZ: number;
  baseRotation?: number;
};

export type ProjectionPreset =
  | "perozzoBasic"
  | "isometric30"
  | "steep45"
  | "levasseur";

function legacyProjectPoint(
  p: Point3D,
  params: LegacyProjectionParams
): Point2D {
  const { originX, originY, scaleXY, scaleZ, baseRotation = 0 } = params;

  let bx = p.x;
  let by = p.y;

  if (baseRotation !== 0) {
    const cos = Math.cos(baseRotation);
    const sin = Math.sin(baseRotation);
    const rx = bx * cos - by * sin;
    const ry = bx * sin + by * cos;
    bx = rx;
    by = ry;
  }

  const sx = (bx - by) * scaleXY;
  const sy = (bx + by) * 0.5 * scaleXY - p.z * scaleZ;

  return {
    x: originX + sx,
    y: originY + sy,
  };
}

function buildBasisFromLegacy(params: LegacyProjectionParams): AxonometricBasis {
  const origin = legacyProjectPoint({ x: 0, y: 0, z: 0 }, params);
  const projX = legacyProjectPoint({ x: 1, y: 0, z: 0 }, params);
  const projY = legacyProjectPoint({ x: 0, y: 1, z: 0 }, params);
  const projZ = legacyProjectPoint({ x: 0, y: 0, z: 1 }, params);

  return {
    origin,
    basisX: { x: projX.x - origin.x, y: projX.y - origin.y },
    basisY: { x: projY.x - origin.x, y: projY.y - origin.y },
    basisZ: { x: projZ.x - origin.x, y: projZ.y - origin.y },
  };
}

function vectorFromAngle(angleDeg: number, length = 1): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: Math.cos(rad) * length,
    y: -Math.sin(rad) * length,
  };
}

/**
 * Create projection options based on a named historic-ish preset.
 * These are rough artistic approximations, not strict reconstructions.
 */
export function projectionForPreset(
  preset: ProjectionPreset,
  width: number,
  height: number
): ProjectionOptions {
  const withBasis = (params: LegacyProjectionParams): ProjectionOptions => ({
    ...params,
    basis: buildBasisFromLegacy(params),
  });

  switch (preset) {
    case "perozzoBasic":
      // close to what you dialed in by eye
      return withBasis({
        originX: width / 2 - 50,
        originY: height - 440,
        scaleXY: 10,
        scaleZ: 80,
        baseRotation: -.5, // start at 0; we can tweak
      });

    case "isometric30":
      // more classic isometric: lower height, centered origin
      return withBasis({
        originX: width / 2,
        originY: height - 160,
        scaleXY: 12,
        scaleZ: 60,
        baseRotation: -Math.PI / 12, // about -15°

      });

    case "steep45":
      // steeper "statistics plate" look: exaggerated height
      return withBasis({
        originX: width / 2 - 40,
        originY: height - 140,
        scaleXY: 10,
        scaleZ: 120,
        baseRotation: -Math.PI / 7,

      });

    case "levasseur": {
      const originX = width / 2;
      const originY = height - 175;
      const yearScale = 12; // how wide the sheet is
      const ageScale = 5.5; // how deep the sheet is
      const valueScale = 120; // how tall the sheet is
      return {
        originX,
        originY,
        scaleXY: yearScale,
        scaleZ: valueScale,
        basis: {
          origin: { x: originX, y: originY },
          basisX: vectorFromAngle(0, yearScale),
          basisY: vectorFromAngle(-125, ageScale),
          basisZ: vectorFromAngle(90, valueScale),
        },
      };
    }

    default:
      // fallback
      return withBasis({
        originX: width / 2,
        originY: height - 160,
        scaleXY: 10,
        scaleZ: 80,
      });
  }
}

/**
 * Simple rectangular 2D grid (not currently used, but handy to keep around).
 */
export function demoGrid(rows: number, cols: number): Point2D[] {
  const points: Point2D[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      points.push({ x: c, y: r });
    }
  }

  return points;
}

/**
 * Tiny “mountain range” surface on a regular grid.
 * This is just a toy function: later this can be real data.
 */
export function demoSurface(rows: number, cols: number): Point3D[] {
  const points: Point3D[] = [];

  const maxX = cols - 1;
  const maxY = rows - 1;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // normalize to 0..1
      const nx = x / maxX;
      const ny = y / maxY;

      // make a bump with some wiggles – purely decorative
      const radius = Math.hypot(nx - 0.5, ny - 0.5);
      const hill = Math.max(0, 1 - radius * 2); // cone-ish
      const waves =
        0.25 * Math.sin(nx * Math.PI * 4) * Math.cos(ny * Math.PI * 3);

      const z = hill + waves; // overall height

      points.push({ x, y, z });
    }
  }

  return points;
}

/**
 * Very simple isometric-ish projection: 3D (x, y, z) → 2D (x, y)
 */
export function projectIso(
  p: Point3D,
  options: ProjectionOptions
): Point2D {
  const { basis } = options;
  const { origin, basisX, basisY, basisZ } = basis;

  return {
    x: origin.x + p.x * basisX.x + p.y * basisY.x + p.z * basisZ.x,
    y: origin.y + p.x * basisX.y + p.y * basisY.y + p.z * basisZ.y,
  };
}

/**
 * Project an entire surface at once.
 */
export function projectSurface(
  points: Point3D[],
  options: ProjectionOptions
): Point2D[] {
  return points.map((p) => projectIso(p, options));
}

/**
 * Compute a projected floor polygon for a given grid and depth.
 */
export function floorPolygon(
  rows: number,
  cols: number,
  depthZ: number,
  options: ProjectionOptions
): Point2D[] {
  const floorCorners3D: Point3D[] = [
    { x: 0, y: 0, z: depthZ },
    { x: cols - 1, y: 0, z: depthZ },
    { x: cols - 1, y: rows - 1, z: depthZ },
    { x: 0, y: rows - 1, z: depthZ },
  ];

  return floorCorners3D.map((p) => projectIso(p, options));
}

//builds silhouette of surface grid for clipping
export function buildSurfaceSilhouette2D(
  projectedSurface: Point2D[],
  rows: number,
  cols: number
): Point2D[] {
  // bottom row: y = 0, left → right
  const bottom: Point2D[] = [];
  for (let c = 0; c < cols; c++) {
    bottom.push(projectedSurface[0 * cols + c]);
  }

  // right edge: bottom → top
  const right: Point2D[] = [];
  for (let r = 0; r < rows; r++) {
    right.push(projectedSurface[r * cols + (cols - 1)]);
  }

  // top row: max age, right → left
  const top: Point2D[] = [];
  for (let c = cols - 1; c >= 0; c--) {
    top.push(projectedSurface[(rows - 1) * cols + c]);
  }

  // left edge: top → bottom
  const left: Point2D[] = [];
  for (let r = rows - 1; r >= 0; r--) {
    left.push(projectedSurface[r * cols + 0]);
  }

  // stitch, skipping obvious duplicates
  return [
    ...bottom,
    ...right.slice(1),
    ...top.slice(1),
    ...left.slice(1, -1),
  ];
}
