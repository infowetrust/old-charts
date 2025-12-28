import type { Point2D } from "../../core/types";
import type { LineStyle } from "../vizConfig";
import { isHeavy } from "../vizConfig";

type Polyline = {
  points: Point2D[];
  heavy: boolean;
  [key: string]: any;
};

type ValueContour = {
  level: number;
  points: Point2D[];
};

type DataLinesLayerProps = {
  yearLines: Polyline[];
  ageLines: Polyline[];
  cohortLines: Polyline[];
  contourPolylines2D: ValueContour[];
  vizStyle: {
    years: LineStyle;
    ages: LineStyle;
    cohorts: LineStyle;
    values: LineStyle;
    debugPoints: { radius: number; fill: string; opacity: number };
  };
  projectedSurface: Point2D[];
  showCohortLines: boolean;
  focus?: { year: number; age: number; birthYear: number } | null;
  hoverOpacity?: { highlightMult: number; dimMult: number };
};

export default function DataLinesLayer({
  yearLines,
  ageLines,
  cohortLines,
  contourPolylines2D,
  vizStyle,
  projectedSurface,
  showCohortLines,
  focus,
  hoverOpacity,
}: DataLinesLayerProps) {
  const highlightMult = hoverOpacity?.highlightMult ?? 1;
  const dimMult = hoverOpacity?.dimMult ?? 1;
  const hasFocus = !!focus;

  const applyHover = (base: number, isHit: boolean, hasFocus: boolean) => {
    if (!hasFocus) return base;
    const mult = isHit ? highlightMult : dimMult;
    return Math.min(1, Math.max(0, base * mult));
  };

  return (
    <g id="layer-lines">
      <g>
        {contourPolylines2D.map((iso, i) => (
          <polyline
            key={`val-${iso.level}-${i}`}
            points={iso.points.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke={vizStyle.values.stroke}
            strokeWidth={
              isHeavy(iso.level, vizStyle.values.heavyStep)
                ? vizStyle.values.thickWidth
                : vizStyle.values.thinWidth
            }
            strokeOpacity={
              isHeavy(iso.level, vizStyle.values.heavyStep)
                ? vizStyle.values.thickOpacity
                : vizStyle.values.thinOpacity
            }
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </g>
      {showCohortLines &&
        cohortLines.map((line) => (
          <polyline
            key={`cohort-${line.birthYear}`}
            points={line.points.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke={vizStyle.cohorts.stroke}
            strokeWidth={
              line.heavy
                ? vizStyle.cohorts.thickWidth
                : vizStyle.cohorts.thinWidth
            }
            strokeOpacity={
              applyHover(
                line.heavy
                  ? vizStyle.cohorts.thickOpacity
                  : vizStyle.cohorts.thinOpacity,
                !!(focus && line.birthYear === focus.birthYear),
                hasFocus
              )
            }
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      {ageLines.map((line) => (
        <polyline
          key={`age-${line.age}`}
          points={line.points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke={vizStyle.ages.stroke}
          strokeWidth={
            line.heavy ? vizStyle.ages.thickWidth : vizStyle.ages.thinWidth
          }
          strokeOpacity={
            applyHover(
              line.heavy
                ? vizStyle.ages.thickOpacity
                : vizStyle.ages.thinOpacity,
              !!(focus && line.age === focus.age),
              hasFocus
            )
          }
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {yearLines.map((line) => (
        <polyline
          key={`year-${line.year}`}
          points={line.points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke={vizStyle.years.stroke}
          strokeWidth={
            line.heavy ? vizStyle.years.thickWidth : vizStyle.years.thinWidth
          }
          strokeOpacity={
            applyHover(
              line.heavy
                ? vizStyle.years.thickOpacity
                : vizStyle.years.thinOpacity,
              !!(focus && line.year === focus.year),
              hasFocus
            )
          }
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {projectedSurface.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={vizStyle.debugPoints.radius}
          fill={vizStyle.debugPoints.fill}
          opacity={vizStyle.debugPoints.opacity}
        />
      ))}
    </g>
  );
}
