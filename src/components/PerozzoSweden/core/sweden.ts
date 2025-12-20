import type { Point3D } from "./types";

export type SwedenRow = {
  year: number;
  age: number;
  survivors: number;
  ageIndex: number; // 0, 1, 2, ... for 0,5,10,...
};

export type SwedenSurfaceGrid = {
  points: Point3D[];   // full grid, including age 0 row
  rows: number;        // number of age rows (0,5,10,...,100)
  cols: number;        // number of year columns
  ages: number[];      // age bands used in the surface (includes 0)
  years: number[];
  births: Point3D[];   // convenience: row for age 0
  maxSurvivors: number;
  zScale: number;
};

/**
 * Very small CSV parser for the tidy Sweden table.
 * Assumes header: Year,Age,Survivors
 */
export function parseSwedenCsv(csvText: string): SwedenRow[] {
  const lines = csvText.trim().split(/\r?\n/);
  const rows: SwedenRow[] = [];

  // skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const [yearStr, ageStr, survivorsStr] = line.split(",");

    const year = Number(yearStr);
    const age = Number(ageStr);
    const survivors = Number(survivorsStr);

    if (
      !Number.isFinite(year) ||
      !Number.isFinite(age) ||
      !Number.isFinite(survivors)
    ) {
      continue;
    }

    // simple 5-year index: 0,1,2,... for 0,5,10,...
    const ageIndex = age / 5;

    rows.push({ year, age, survivors, ageIndex });
  }

  return rows;
}

/**
 * Map the Sweden survivor table into a regular grid of Point3D.
 *
 * x = year index
 * y = age index (0 for age 0, 1 for age 5, ...)
 * z = scaled survivor count
 */
export function makeSwedenSurface(
  data: SwedenRow[],
  opts?: { zScale?: number; maxHeight?: number }
): SwedenSurfaceGrid {
  if (data.length === 0) {
    return {
      points: [],
      rows: 0,
      cols: 0,
      ages: [],
      years: [],
      births: [],
      maxSurvivors: 0,
      zScale: 0,
    };
  }

  const survivorsValues = data.map((d) => d.survivors);
  const maxSurvivors = Math.max(...survivorsValues);

  let zScale: number;
  if (opts?.zScale != null) {
    zScale = opts.zScale;
  } else {
    const maxHeight = opts?.maxHeight ?? 3; // in "z units"
    zScale = maxHeight / maxSurvivors;
  }

  // unique sorted axes
  const years = Array.from(new Set(data.map((d) => d.year))).sort(
    (a, b) => a - b
  );
  const ages = Array.from(new Set(data.map((d) => d.age))).sort(
    (a, b) => a - b
  ); // includes 0

  const cols = years.length;
  const rowsCount = ages.length;

  // lookup survivors by (year, age)
  const key = (year: number, age: number) => `${year}-${age}`;
  const map = new Map<string, number>();
  for (const d of data) {
    map.set(key(d.year, d.age), d.survivors);
  }

  const points: Point3D[] = [];

  // row-major order: y = age index (0 for age 0)
  for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
    const age = ages[rowIndex];

    for (let colIndex = 0; colIndex < cols; colIndex++) {
      const year = years[colIndex];
      const survivors = map.get(key(year, age)) ?? 0;

      const x = colIndex;
      const y = rowIndex; // 0 → age 0, 1 → age 5, etc.
      const z = survivors * zScale;

      points.push({ x, y, z });
    }
  }

  // births ridge = row for age 0 (first row)
  const births: Point3D[] = [];
  const birthRowIndex = ages.indexOf(0);

  if (birthRowIndex >= 0) {
    for (let colIndex = 0; colIndex < cols; colIndex++) {
      births.push(points[birthRowIndex * cols + colIndex]);
    }
  }

  return {
    points,
    rows: rowsCount,
    cols,
    ages,
    years,
    births,
    maxSurvivors,
    zScale,
  };
}