import { scaleLinear, scaleBand, extent, line } from "d3";
// import { AxisLeft, AxisBottom } from "@visx/axis";
import { PatternLines } from '@visx/pattern'; // https://airbnb.io/visx/docs/pattern
import _, { uniq, map } from "lodash";


import committee from "../../data/committee";
// properties
type Props = {
  lineColor?: string
}
export default function Curve(props: Props) {
  const { lineColor } = props
  console.log(props)

  const tons = _.map(committee["14b"], "tons");
  const months = _.map(committee["14b"], "month");

  /* 
  
  Fine control over placement of 3 design layers
  1. The grid
  2. The grid labels
  3. Data marks
  4. Data labels
  
  Why do this? 
  
  * Copy, pasteable opinionated examples of basic chart types that offer full control
  
  */


  const svgSize = 350;
  const margin = 40;

  const gridWidth = svgSize - margin - margin;
  const gridRight = svgSize - margin;
  const gridBottom = svgSize - margin;
  const gridHeight = gridWidth * (10 / 11);
  const gridTop = svgSize - margin - gridHeight;
  const gridSeparation = gridWidth / 11;
  const strokeWidth = 1;
  const strokeWidthEmphasis = 3;
  const halfStrokeWidthForPixelPerfectGridAlignment = strokeWidth / 2;
  const topTextOffsetY = 20; /* for a squat chart :) */

  const leftTicks = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200];

  const _scaleY = scaleLinear().domain([0, 200]).range([gridRight, margin]);
  const _scaleXLine = scaleLinear().domain([0, 11]).range([margin, gridRight]);
  const _scaleDate = scaleBand().domain(months).range([0, gridWidth]);



  const _lineMaker = line()
    .x((d, i) => {
      return _scaleXLine(i);
    })
    .y((d) => {
      //Argument of type '[number, number]' is not assignable to parameter of type 'NumberValue'.\n  Type '[number, number]' is not assignable to type 'number'.",
      // @ts-ignore
      return _scaleY(d);
    });

  const _tonsLine = _lineMaker(tons);

  const _tonsSum = _.reduce(
    tons,
    (sum, n) => {
      return sum + n;
    },
    0
  );

  return (
    <div style={{ margin: 20 }}>
      <p><i>1915 Standards for Graphic Presentation</i></p>
      <p>
        14. It is often desirable to include in the diagram the numerical data or
        formulae represented.
      </p>
      <svg
        width={svgSize}
        height={svgSize}
      // style={{ border: "1px solid pink" }}
      >
        <mask id="gridMask">
          <rect x={margin} y={gridTop} width={gridWidth} height={gridHeight} fill="white" />
        </mask>

        {/* horizontal lines including bolded zero line */}
        {leftTicks.map((tons, i) => {
          return (
            <line
              key={`horizontal-gridline-${i}`}
              x1={margin - halfStrokeWidthForPixelPerfectGridAlignment}
              y1={gridRight - i * gridSeparation}
              x2={
                margin + gridWidth + halfStrokeWidthForPixelPerfectGridAlignment
              }
              y2={gridRight - i * gridSeparation}
              stroke="black"
              strokeWidth={
                i === 0
                  ? strokeWidthEmphasis
                  : strokeWidth /* ternery, if i = 0, 3, else 1 */
              }
            />
          );
        })}

        {/* vertical lines including bolded zero line */}
        {months.map((d, i) => {
          return (
            <line
              key={`vertical-gridline-${i}`}
              x1={margin + i * gridSeparation}
              y1={gridBottom}
              x2={margin + i * gridSeparation}
              y2={gridTop /* includes magic 10/11 */}
              stroke="black"
              strokeWidth={1}
            />
          );
        })}
        {/* data */}
        {typeof _tonsLine === "string" && (
          <path
            stroke={lineColor || "pink"}
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            d={_tonsLine}
            mask="url(#gridMask)" // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/mask
          />
        )}
        {/* top text */}
        {tons.map((entry, i) => {
          const centeringOffset = 5; // hardcoded
          const textOffsetX = margin + i * gridSeparation + centeringOffset;

          return (
            <text
              key={`toptext--${i}`}
              textAnchor="end"
              fontWeight={700}
              x={textOffsetX}
              y={topTextOffsetY}
              transform={`rotate(270, ${textOffsetX}, ${topTextOffsetY})`}
            >
              {entry.toFixed(1) /* tenths, to align */}
            </text>
          );
        })}
        {/* bottom text */}
        {months.map((month, i) => {
          const verticalOffset = 17; // hardcoded
          const centeringOffset = 0;
          const textOffsetX = margin + i * gridSeparation + centeringOffset;
          const textOffsetY = gridBottom + verticalOffset;

          return (
            <text
              key={`bottomText--${i}`}
              fontWeight={700}
              x={textOffsetX}
              y={textOffsetY}
              textAnchor="middle"
            >
              {month}
            </text>
          );
        })}
        {/* left text */}
        {leftTicks.map((tick, i) => {
          const horizontalOffset = 7; // hardcoded
          const centeringOffset = 5;
          const textOffsetX = margin - horizontalOffset;
          const textOffsetY = gridBottom - i * gridSeparation + centeringOffset;

          return (
            <text
              key={`bottomText--${i}`}
              fontWeight={700}
              x={textOffsetX}
              y={textOffsetY}
              textAnchor="end"
            >
              {tick}
            </text>
          );
        })}
        {/* TONS */}

        <text
          fontWeight={700}
          x={14}
          y={52}
          transform={`rotate(305, ${14}, ${52})`}
        >
          Tons
        </text>

        {/* summation line */}
        <line
          x1={gridWidth + margin + 12}
          y1={8}
          x2={gridWidth + margin + 12}
          y2={gridTop}
          stroke="black"
          strokeWidth={1}
        />
        {/* summation */}
        <text
          fontWeight={700}
          x={gridRight}
          y={topTextOffsetY + 30}
          textAnchor="end"
          transform={`rotate(270, ${gridRight}, ${topTextOffsetY})`}
        >
          {_tonsSum}
        </text>
      </svg>
    </div>
  );




}