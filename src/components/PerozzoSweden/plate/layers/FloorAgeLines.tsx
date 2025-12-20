import { projectIso, type ProjectionOptions } from "../../core/geometry";
import type { Frame3D } from "../../core/frame3d";

type FloorAgeLineStyle = {
  stroke: string;
  strokeWidth: number;
};

type FloorAgeLinesProps = {
  frame: Frame3D;
  projection: ProjectionOptions;
  heavyAges: number[];
  extendLeftYears: number;
  extendRightYears: number;
  style: FloorAgeLineStyle;
};

export default function FloorAgeLines({
  frame,
  projection,
  heavyAges,
  extendLeftYears,
  extendRightYears,
  style,
}: FloorAgeLinesProps) {
  const minYearExt = frame.minYear - extendLeftYears;
  const maxYearExt = frame.maxYear + extendRightYears;
  const yearStep = frame.yearStep;

  return (
    <g>
      {heavyAges.map((age) => {
        const leftPts = [];
        for (let year = minYearExt; year <= frame.minYear; year += yearStep) {
          const p3 = frame.point(year, age, 0);
          leftPts.push(projectIso(p3, projection));
        }

        const rightPts = [];
        for (let year = frame.maxYear; year <= maxYearExt; year += yearStep) {
          const p3 = frame.point(year, age, 0);
          rightPts.push(projectIso(p3, projection));
        }

        return (
          <g key={`floor-age-${age}`}>
            {leftPts.length >= 2 && (
              <polyline
                points={leftPts.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke={style.stroke}
                strokeWidth={style.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            {rightPts.length >= 2 && (
              <polyline
                points={rightPts.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke={style.stroke}
                strokeWidth={style.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </g>
        );
      })}
    </g>
  );
}
