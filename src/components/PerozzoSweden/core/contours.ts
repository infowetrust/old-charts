// src/core/contours.ts

/**
 * A scalar field on a regular grid:
 * - rows correspond to age bands (ages[rowIndex])
 * - cols correspond to years (years[colIndex])
 * - values are survivor counts (or any scalar), stored row-major:
 *   values[rowIndex * cols + colIndex]
 */
export type GridField = {
  rows: number;
  cols: number;
  values: number[]; // length = rows * cols, row-major
  ages: number[];   // length = rows, e.g. [5, 10, 15, ...]
  years: number[];  // length = cols, e.g. [1750, 1755, ...]
};

/**
 * One point on a value isoline, in data space.
 * - year: actual year value (may be fractional when intersecting boundaries)
 * - age: interpolated age in years (may be fractional)
 */
export type ValueIsoPoint = {
  year: number;
  age: number;
};

/**
 * One continuous isoline for a given scalar level.
 * - level: the scalar value (e.g. survivors = 50_000)
 * - points: ordered roughly along increasing year (depending on run direction)
 *
 * Styling decisions (thin/thick, color, etc.) are left to the caller.
 */
export type ValueIsoPolyline = {
  level: number;
  points: ValueIsoPoint[];
};

/**
 * Compute value-based isolines by scanning vertically (per year/column).
 *
 * For each requested scalar `level`, and for each year column, we:
 *   - look at the values down that column (as age increases),
 *   - find the first adjacent pair that straddles the level,
 *   - interpolate a single crossing age between those two ages.
 *
 * Assumes the values are *monotone* with age in each column
 * (as in life tables, where survivors decrease with age),
 * so each level can cross a column at most once.
 *
 * This is purely geometric: it does not decide which levels to use
 * or how to style them. The caller chooses the `levels` array and
 * handles line weights/colors.
 */
export function computeVerticalIsoLines(
  field: GridField,
  levels: number[]
): ValueIsoPolyline[] {
  const { rows, cols, values, ages, years } = field;

  if (rows < 2 || cols < 1 || values.length !== rows * cols) {
    return [];
  }

  if (!levels.length) return [];

  const isolines: ValueIsoPolyline[] = [];

  const topValues = new Array<number>(cols);
  const bottomValues = new Array<number>(cols);
  for (let col = 0; col < cols; col++) {
    topValues[col] = values[0 * cols + col];
    bottomValues[col] = values[(rows - 1) * cols + col];
  }

  for (const level of levels) {
    const crossingAgeByCol: Array<number | null> = new Array(cols).fill(null);

    // for each column (year), scan down the ages to find the first crossing
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows - 1; row++) {
        const idx0 = row * cols + col;
        const idx1 = (row + 1) * cols + col;
        const v0 = values[idx0];
        const v1 = values[idx1];

        if (!Number.isFinite(v0) && !Number.isFinite(v1)) continue;

        const minV = Math.min(v0, v1);
        const maxV = Math.max(v0, v1);
        if (level < minV || level > maxV || v0 === v1) continue;

        const age0 = ages[row];
        const age1 = ages[row + 1];
        const t = (level - v0) / (v1 - v0);
        const ageStar = age0 + t * (age1 - age0);
        crossingAgeByCol[col] = ageStar;
        break;
      }
    }

    const maybeBoundaryIntersection = (
      colA: number,
      colB: number
    ): ValueIsoPoint | null => {
      const tryBoundary = (
        boundaryValues: number[],
        boundaryAge: number
      ): ValueIsoPoint | null => {
        const vA = boundaryValues[colA];
        const vB = boundaryValues[colB];
        if (
          !Number.isFinite(vA) ||
          !Number.isFinite(vB) ||
          vA === vB ||
          (level - vA) * (level - vB) > 0
        ) {
          return null;
        }
        const t = (level - vA) / (vB - vA);
        const yearA = years[colA];
        const yearB = years[colB];
        const yearStar = yearA + t * (yearB - yearA);
        return { year: yearStar, age: boundaryAge };
      };

      return (
        tryBoundary(topValues, ages[0]) ??
        tryBoundary(bottomValues, ages[rows - 1]) ??
        null
      );
    };

    const finalizeRun = (startCol: number, endCol: number) => {
      const points: ValueIsoPoint[] = [];

      if (startCol > 0) {
        const left = maybeBoundaryIntersection(startCol - 1, startCol);
        if (left) points.push(left);
      }

      for (let col = startCol; col <= endCol; col++) {
        points.push({
          year: years[col],
          age: crossingAgeByCol[col] as number,
        });
      }

      if (endCol < cols - 1) {
        const right = maybeBoundaryIntersection(endCol, endCol + 1);
        if (right) points.push(right);
      }

      if (points.length >= 2) {
        isolines.push({ level, points });
      }
    };

    let runStart = -1;
    for (let col = 0; col < cols; col++) {
      if (crossingAgeByCol[col] == null) {
        if (runStart !== -1) {
          finalizeRun(runStart, col - 1);
          runStart = -1;
        }
        continue;
      }

      if (runStart === -1) runStart = col;
    }

    if (runStart !== -1) {
      finalizeRun(runStart, cols - 1);
    }
  }

  return isolines;
}
