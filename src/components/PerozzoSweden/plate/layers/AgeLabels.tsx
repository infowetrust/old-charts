import { projectIso, type ProjectionOptions } from "../../core/geometry";
import type { Frame3D } from "../../core/frame3d";
import type { Point2D } from "../../core/types";
import type { AxisLabelStyle } from "../vizConfig";

type LabelSide = "left" | "right";

type AgeLabelsProps = {
  frame: Frame3D;
  projection: ProjectionOptions;
  minYearExt: number;
  maxYearExt: number;
  side: LabelSide | "both";
  tickLen: number;
  textOffset: number;
  style: AxisLabelStyle;
};

const LABEL_AGES = [0, 25, 50, 75, 100];
const LABEL_TEXT: Record<number, string> = {
  0: "Born",
  25: "25",
  50: "50",
  75: "75",
  100: "100",
};

export default function AgeLabels({
  frame,
  projection,
  minYearExt,
  maxYearExt,
  side,
  tickLen,
  textOffset,
  style,
}: AgeLabelsProps) {
  const sides: LabelSide[] =
    side === "both" ? ["left", "right"] : [side ?? "left"];

  const labelYearFor = (s: LabelSide): number => {
    if (s === "right") {
      return Math.max(maxYearExt - 5, frame.maxYear + 5);
    }
    return Math.min(minYearExt + 5, frame.minYear - 10);
  };

  const inwardYearFor = (s: LabelSide, baseYear: number): number => {
    return s === "right" ? baseYear - frame.yearStep : baseYear + frame.yearStep;
  };

  const dirForAge = (
    age: number,
    s: LabelSide,
    baseYear: number,
    inwardYear: number
  ): Point2D => {
    const pA = projectIso(frame.point(baseYear, age, 0), projection);
    const pB = projectIso(frame.point(inwardYear, age, 0), projection);
    const dx = pA.x - pB.x;
    const dy = pA.y - pB.y;
    const mag = Math.hypot(dx, dy) || 1;
    return { x: dx / mag, y: dy / mag };
  };

  return (
    <g>
      {sides.map((s) => {
        const baseYear = labelYearFor(s);
        const inwardYear = inwardYearFor(s, baseYear);
        return LABEL_AGES.map((age) => {
          const text = LABEL_TEXT[age] ?? `${age}`;
          const anchor = projectIso(frame.point(baseYear, age, 0), projection);
          const dir = dirForAge(age, s, baseYear, inwardYear);
          const textPos = {
            x: anchor.x + dir.x * (tickLen + textOffset),
            y: anchor.y + dir.y * (tickLen + textOffset),
          };

          return (
            <g key={`age-label-${s}-${age}`}>
              <text
                x={textPos.x}
                y={textPos.y}
                dominantBaseline="middle"
                textAnchor={s === "right" ? "start" : "end"}
                fill={style.color}
                fillOpacity={style.opacity}
                fontFamily={style.fontFamily}
                fontSize={style.fontSize}
                fontWeight={style.fontWeight}
              >
                {text}
              </text>
            </g>
          );
        });
      })}
    </g>
  );
}
