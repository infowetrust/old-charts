import { scaleLinear, scaleBand, extent, line, color } from "d3";
import _, { uniq, map } from "lodash";
import { PatternLines } from '@visx/pattern'; //https://airbnb.io/visx/docs/pattern
import { LinePath } from '@visx/shape';

import * as allCurves from '@visx/curve';
type CurveType = keyof typeof allCurves;
// import { AxisLeft, AxisBottom } from "@visx/axis";

/* fancy stuff Micah suggested to make chart scalable */
import cheysson from "../../data/cheysson";
// properties
type Props = {
  barColor?: string
}
export default function Column(props: Props) {
  //const { lineColor } = props
  //console.log(props)

  /* 
  0. Map data to dimensions
  1. Canvas and grid
  2. Grid labels
  3. Data marks
  4. Data labels
  5. (hidden) Guide lines   
  */

  {/* 0. Map data to dimensions */ }
  //map data to independent and dependent dimensions
  const independents = _.map(cheysson["1906-21"], "year");
  const nIndependents = independents.length;

  const dependents = _.map(cheysson["1906-21"], "tons");
  const maxDependents = 16; //chosen extent of y-axis
  //alternate (not good for large arrays): Math.max(...ticks);
  //consider moving avg, e.g. from https://poopcode.com/calculate-moving-average-of-an-array-of-numbers-in-javascript/

  //establish vertical ticks & their horizontal extent
  const ticks = [0, 2, 4, 6, 8, 10];//define vertical ticks
  const xTicks = [0, 0, 0, 6, 15, 16]; //mask gridlines

  //style
  const colorA = "lightblue";
  const colorGrid = "darkslategray";

  const guideColor = "none";
  const guideStroke = "1";

  const strokeWidth = 1; //horizontal gridlines
  const halfStrokeWidth = strokeWidth / 2;
  const strokeWidthMedium = 2;
  const strokeWidthBold = 3; //baseline
  const strokeWidthHeavy = 5; //baseline\

  const fontWeightNormal = 500;
  const fontWeightEmphasis = 600;

  const underLine = 24; //length of title underlines

  const h1 = "2em";
  const h2 = "1.5em";
  const h3 = "1em";
  const h4 = ".8em";

  {/* 1. Canvas and grid */ }
  const chartWidth = 480; //encompasses grid and labels
  const chartHeight = chartWidth;

  const gridWidth = 370; //grid is area for marks
  const gridHeight = gridWidth;

  const channelSides = chartWidth - gridWidth;
  const channelSide = channelSides / 2; //channel = spaces for labels around grid
  const channelBottom = 50;
  const channelTop = chartHeight - gridHeight - channelBottom;

  const border = 6; //border = empty space outside chart.

  //calculate SVG positions of grid sides
  const gridTop = border + channelTop;
  const gridBottom = border + channelTop + gridHeight;
  const gridLeft = border + channelSide;
  const gridRight = border + channelSide + gridWidth;

  //calculate grid cell sizes
  const gridCellX = gridWidth / (nIndependents);
  const gridCellY = gridHeight / (maxDependents - 1) * 2; //multiplier accounts for ticks skipping odds

  {/* 1. Canvas and grid */ }
  const tweakVerticalAxisLabel = 5;

  const _scaleX = scaleLinear().domain([0, nIndependents]).range([gridLeft, gridRight]);
  const _scaleY = scaleLinear().domain([0, maxDependents - 1]).range([gridBottom, gridTop]);

  const _labelMaker = line()
    .x((d, i) => {
      return _scaleX(i) + gridCellX / 2; // + centers on bar
    })
    .y((d) => {
      return _scaleY(d) - 15; // - raises label above marks
    });
  const _labelLine = _labelMaker(dependents);

  return (
    <div style={{
      margin: 20
    }}>

      <svg
        width={chartWidth + 2 * border}
        height={chartHeight + 2 * border}
      >
        <rect width="100%" height="100%" fill="oldlace" stroke="black" strokeWidth={strokeWidthHeavy} />

        <rect x={border} y={border} width={channelSide} height={chartHeight}
          stroke={colorGrid} strokeWidth={strokeWidth} fill="none"></rect>
        <rect x={gridLeft} y={border} width={gridWidth} height={chartHeight}
          stroke={colorGrid} strokeWidth={strokeWidth} fill="none"></rect>
        <rect x={gridRight} y={border} width={channelSide} height={chartHeight}
          stroke={colorGrid} strokeWidth={strokeWidth} fill="none"></rect>

        {/* 2. Grid labels*/}
        {/* x-axis labels */}
        {independents.map((year, i) => {
          const verticalOffset = 10;
          const horizontalOffset = gridCellX / 2 + 5;
          const textX = gridLeft + i * gridCellX + horizontalOffset;
          const textY = gridBottom + verticalOffset;

          return (
            <text
              key={`bottomText--${i}`}
              textAnchor="end"
              fontWeight={independents[i] % 5 === 0 ? fontWeightEmphasis : fontWeightNormal}
              x={textX}
              y={textY}
              transform={`rotate(270, ${textX}, ${textY})`}
            >
              {year}
            </text>
          );
        })}

        {/* left y-axis labels */}
        {ticks.map((tick, i) => {
          const textX = gridLeft - channelSide / 2;
          const textY = gridBottom - i * gridCellY + tweakVerticalAxisLabel;
          return (
            <text
              key={`bottomText--${i}`}
              fontWeight={fontWeightEmphasis}
              opacity={i < 4 ? 100 : 0}
              x={textX}
              y={textY}
              textAnchor="middle"
            >
              {tick}
            </text>
          );
        })}

        {/* right y-axis labels */}
        {ticks.map((tick, i) => {
          const horizontalOffset = 0; // hardcoded
          const textX = gridRight + (channelSide / 2);
          const textY = gridBottom - i * gridCellY + tweakVerticalAxisLabel;

          return (
            <text
              key={`bottomText--${i}`}
              fontWeight={fontWeightEmphasis}
              opacity={i < 6 ? 100 : 0}
              x={textX}
              y={textY}
              textAnchor="middle"
            >
              {tick}
            </text>
          );
        })}

        {/* Chart Labels */}
        <text y={gridTop} textAnchor="middle"        >
          <tspan x={gridLeft - channelSide / 2} dy="0" font-size={h4}>Millions</tspan>
          <tspan x={gridLeft - channelSide / 2} dy="1.2em" font-size={h4}>de</tspan>
          <tspan x={gridLeft - channelSide / 2} dy="1.2em" font-size={h4} >Tonnes</tspan>
        </text>
        <line
          x1={gridLeft - channelSide / 2 - underLine / 2}
          x2={gridLeft - channelSide / 2 + underLine / 2}
          y1={gridTop + 40} //tk define these better?
          y2={gridTop + 40}
          stroke={colorGrid}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        <text y={gridTop} textAnchor="middle"        >
          <tspan x={gridRight + channelSide / 2} dy="0" font-size={h4}>Millions</tspan>
          <tspan x={gridRight + channelSide / 2} dy="1.2em" font-size={h4}>de</tspan>
          <tspan x={gridRight + channelSide / 2} dy="1.2em" font-size={h4} >Tonnes</tspan>
        </text>
        <line
          x1={gridRight + channelSide / 2 - underLine / 2}
          x2={gridRight + channelSide / 2 + underLine / 2}
          y1={gridTop + 40}
          y2={gridTop + 40}
          stroke={colorGrid}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* 3. Data marks */}
        {/* bars */}
        <PatternLines
          id="lines"
          height={5}
          width={5}
          stroke={colorA}
          strokeWidth={2}
          orientation={['diagonal']}
        />

        {dependents.map((bar, i) => {
          const left = gridLeft + i * gridCellX;
          const top = _scaleY(dependents[i]);
          const height = gridBottom - top;
          return (
            <rect
              x={left}
              y={top}
              width={gridCellX}
              height={height}
              stroke={colorGrid}
              strokeWidth="1"
              fill="url('#lines')"
            >
              {bar}
            </rect>
          );
        })}

        {/* emphasized step line */}
        {dependents.map((elbow, i) => {
          const startX = gridLeft + i * gridCellX;
          const endX = startX + gridCellX
          const startY = _scaleY(dependents[i]);
          const endY = _scaleY(dependents[i + 1]);
          const pathD =
            "M" + " " + startX + " " + startY +
            "L" + " " + endX + " " + startY +
            "L" + " " + endX + " " + endY;

          return (
            <path
              //mask="url(#gridMask)"
              stroke={colorGrid}
              strokeWidth={strokeWidthMedium}
              fill="none"
              strokeLinecap="round"
              d={pathD}
            >
              {elbow}
            </path>
          );
        })}

        {/* horizontal grid lines */}
        {ticks.map((dependents, i) => { //is dependents necessary?
          return (
            <line
              //key={`horizontal-gridline-${i}`}
              x1={gridLeft + xTicks[i] * gridCellX - halfStrokeWidth}
              x2={gridRight + halfStrokeWidth}
              y1={gridBottom - i * gridCellY}
              y2={gridBottom - i * gridCellY}
              stroke={colorGrid}
              z-index="10"
              strokeWidth={i === 0 ? strokeWidthBold : strokeWidth}
            />
          );
        })}

        {/*4. Data labels*/}

        {/* Main chart label */}
        <text
          y={gridTop + 33}
          textAnchor="middle"
        >
          <tspan x={gridLeft + (gridWidth / 2)} dy="0" font-size={h1}>Port de Paris</tspan>
          <tspan x={gridLeft + (gridWidth / 2)} dy={h2}>Mouvement de la Navigation</tspan>
          <tspan x={gridLeft + (gridWidth / 2)} dy={h2} font-style="italic">( Tonnage effectif )</tspan>
        </text>

        <line
          x1={gridLeft + gridWidth / 2 - underLine}
          x2={gridLeft + gridWidth / 2 + underLine}
          y1={gridTop + 40}
          y2={gridTop + 40}
          stroke={colorGrid}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* data-shaped class label */}
        {typeof _labelLine === "string" && (
          <defs>
            <path
              id="labelPath"
              stroke={"red"}
              strokeWidth={strokeWidthBold}
              fill="none"
              strokeLinecap="round"
              d={_labelLine}
            />
          </defs>
        )}

        <text>
          <textPath
            href="#labelPath"
            textAnchor="middle"
            startOffset="43%"
            letterSpacing={".1em"}
          >
            Ensemble du Tonnage
          </textPath>
        </text>

        {/* 5. Guide lines*/}
        {/* chart */}
        <rect
          x={border}
          y={border}
          width={chartWidth}
          height={chartHeight}
          stroke={guideColor}
          strokeWidth={guideStroke}
          fill="none"
        />
        {/* grid */}
        <rect
          x={gridLeft}
          y={gridTop}
          width={gridWidth}
          height={gridHeight}
          stroke={guideColor}
          strokeWidth={guideStroke}
          fill="none"
        />

      </svg>
      <p>ABOUT THIS CHART. This chart was inspired by an inset graphic by Émile Cheysson, "Navigation Intérieure. II. Tonnage kilométrique," in <i>Album du Statistique</i> (1906). See the original, an overlapping column chart, in the David Rumsey <a href="https://www.davidrumsey.com/luna/servlet/s/255jh3">Map&nbsp;Collection</a>.</p>
      <p>Design flourishes include asymetric vertical axis labels, emphasized labels every five years, emphasized baseline, a grid that only appears over data, and a label that follows the shape of the trend. <a href="https://github.com/infowetrust/old-charts/blob/main/src/components/Column/index.tsx">SEE THE CODE</a></p>

    </div >
  );
}