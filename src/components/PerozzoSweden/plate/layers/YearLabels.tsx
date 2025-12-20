import { projectIso, type ProjectionOptions } from "../../core/geometry";
import type { Frame3D } from "../../core/frame3d";
import type { Point2D } from "../../core/types";
import type { AxisLabelStyle } from "../vizConfig";

type LabelSide = "top" | "bottom";
const BOTTOM_X_SHIFT = 8;

type YearLabelsProps = {
  frame: Frame3D;
  projection: ProjectionOptions;
  years: number[];
  minYearExt: number;
  maxYearExt: number;
  majorStep: number;
  tickLen: number;
  textOffset: number;
  style: AxisLabelStyle;
  bottomAngleDeg: number;
  topValueByYear: Record<number, number>;
};

const formatYear = (year: number) => `${year}`;

function normalize2D(a: Point2D, b: Point2D): Point2D {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const mag = Math.hypot(dx, dy) || 1;
  return { x: dx / mag, y: dy / mag };
}

export default function YearLabels({
  frame,
  projection,
  years,
  minYearExt,
  maxYearExt,
  majorStep,
  tickLen,
  textOffset,
  style,
  bottomAngleDeg,
  topValueByYear,
}: YearLabelsProps) {
  const firstYear = years[0];
  const lastYear = years[years.length - 1];
  const majorYears = Array.from(
    new Set(
      years.filter(
        (year) =>
          year === firstYear ||
          year === lastYear ||
          ((year - firstYear) % majorStep === 0 && year >= firstYear)
      )
    )
  ).sort((a, b) => a - b);

  const labelPositions: LabelSide[] = ["top", "bottom"];

  const clampYear = (year: number) =>
    Math.min(Math.max(year, minYearExt), maxYearExt);

  return (
    <g>
      {majorYears.map((year) =>
        labelPositions.map((side) => {
          const clampedYear = clampYear(year);
          const age = side === "top" ? 0 : 100;
          const topValue = topValueByYear[year] ?? topValueByYear[clampedYear] ?? 0;
          const anchor = projectIso(
            side === "top"
              ? frame.point(clampedYear, 0, topValue)
              : frame.point(clampedYear, age, 0),
            projection
          );
          let dir: Point2D;
          if (side === "top") {
            dir = { x: 0, y: -1 };
          } else {
            const inwardYear = clampedYear + frame.yearStep;
            const inward = projectIso(
              frame.point(inwardYear, age, 0),
              projection
            );
            dir = normalize2D(anchor, inward);
          }
          const baseOffset = side === "bottom" ? textOffset * 0 : textOffset;
          const textPos = {
            x:
              anchor.x +
              dir.x * (tickLen + baseOffset) +
              (side === "bottom" ? BOTTOM_X_SHIFT : 0),
            y:
              anchor.y + dir.y * (tickLen + baseOffset) +
              (side === "bottom" ? 12 : 0),
          };
          const rotation =
            side === "top" ? 270 : bottomAngleDeg;

          return (
            <g key={`year-label-${side}-${year}`}>
              <text
                x={textPos.x}
                y={textPos.y}
                fill={style.color}
                fillOpacity={style.opacity}
                fontFamily={style.fontFamily}
                fontSize={style.fontSize}
                fontWeight={style.fontWeight}
                dominantBaseline="middle"
                textAnchor="middle"
                transform={`rotate(${rotation} ${textPos.x} ${textPos.y})`}
              >
                {formatYear(year)}
              </text>
            </g>
          );
        })
      )}
    </g>
  );
}
