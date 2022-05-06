import { scaleLinear, scaleBand, extent, line } from "d3";
// import { AxisLeft, AxisBottom } from "@visx/axis";
import _, { uniq, map } from "lodash";

import nicb from "../../data/nicb";
import goldratio from "../../data/goldratio";

export default function Gold() {

  /* 
  0. Map data to dimensions
  1. Canvas
  2. Grid
  3. Grid labels
  4. Data marks
  5. Data labels
  6. Guide lines   
  */

  //styling
  const colorA = "midnightblue";
  const colorB = "white";

  const barRx = 2;
  const verticalOffset = 5;
  const horizontalOffset = 2;

  {/* 0. Map data to dimensions */ }
  //map data to independent and dependent dimensions
  const independents = _.map(goldratio["notes"], "country");
  const nIndependents = independents.length;

  const dependentsRatio = _.map(goldratio["notes"], "ratio");
  const dependentsPar = _.map(goldratio["notes"], "par");

  {/* 1. Canvas*/ }
  const svgWidth = 800;
  const svgHeight = 460;

  const marginTop = 40;
  const marginBottom = 20;
  const marginSide = 40;

  {/* 2. Grid*/ }
  const labelWidth = 140;
  const gridWidth = (svgWidth - labelWidth - (2 * marginSide)) / 2;
  const gridHeight = svgHeight - marginTop - marginBottom;
  //border lines
  const lineTop = marginTop / 2;
  const lineBottom = svgHeight - marginBottom;
  //table horizontal positions
  const column = [
    marginSide,
    (marginSide + gridWidth),
    (marginSide + gridWidth + labelWidth),
    (marginSide + gridWidth + labelWidth + gridWidth),];
  //calculate grid row height
  const gridCellY = gridHeight / (nIndependents);
  //bar thickness
  const barHeightPercentageOfCell = 0.75;
  const barHeight = barHeightPercentageOfCell * gridCellY;
  const barMargin = (1 - barHeightPercentageOfCell) / 2;
  //stretch data across grid
  const _scaleX = scaleLinear().domain([0, 100]).range([0, gridWidth]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={svgWidth} height={svgHeight}>
        {/* background */}
        <rect x="0" y="0" width={svgWidth} height={svgHeight} fill={colorB} />
        {/* 3. Grid labels*/}
        <g strokeWidth="3" stroke-dasharray="9, 6" strokeLinecap="round" stroke={colorA}
        >
          <line
            x1={column[0]} x2={column[0]}
            y1={lineTop} y2={lineBottom}
          />
          <line
            x1={column[3]} x2={column[3]}
            y1={lineTop} y2={lineBottom}
          />
        </g>
        <text y={marginTop * .4} textAnchor="middle" fill={colorA} fontWeight="800">
          <tspan x={column[0]} font-size={15} fontFamily="Courier New">&nbsp;100%</tspan>
          <tspan x={column[3]} font-size={15} fontFamily="Courier New" >PAR</tspan>
        </text>
        <text y={marginTop * .8} textAnchor="middle" fill={colorA} fontWeight="800">
          <tspan x={(column[0] + column[1]) / 2} font-size={15} fontFamily="Courier New">RATIO OF GOLD TO NOTES</tspan>
          <tspan x={(column[2] + column[3]) / 2} font-size={15} fontFamily="Courier New" >EXCHANGE IN PER CENT OF PAR</tspan>
        </text>

        {/* 4. Data marks*/}
        {dependentsRatio.map((bar, i) => {
          const zero = column[1];
          const top = marginTop + barMargin + i * gridCellY;
          const length = _scaleX(dependentsRatio[i]);

          return (
            <rect
              x={zero - length} y={top}
              width={length} height={barHeight}
              rx={barRx}
              fill={colorA}
            >
              {bar}
            </rect>
          );
        })}

        {dependentsPar.map((bar, i) => {
          const zero = column[2];
          const top = marginTop + barMargin + i * gridCellY;
          const length = _scaleX(dependentsPar[i]);

          return (
            <rect
              x={zero} y={top}
              width={length} height={barHeight}
              rx={barRx}
              fill={colorA}
            >
              {bar}
            </rect>
          );
        })}

        {/* 4. Data labels*/}
        {independents.map((country, i) => {
          const textX = (column[1] + column[2]) / 2;
          const textY = marginTop + barMargin + (barHeight / 2) + i * gridCellY + verticalOffset;
          return (
            <text x={textX} y={textY} textAnchor="middle" fill={colorA}>
              <tspan fontFamily="Courier New" fontSize="20" fontWeight="800">{country}</tspan>
            </text>
          );
        })}

        {dependentsRatio.map((ratio, i) => {
          const textX = column[1] - _scaleX(dependentsRatio[i]) + horizontalOffset;
          const textY = marginTop + barMargin + (barHeight / 2) + i * gridCellY + verticalOffset;
          return (
            <text
              key={`bottomText--${i}`}
              textAnchor="start"
              x={textX} y={textY}
              fontWeight="800"
            >
              <tspan fontFamily="Courier New" font-style="heavy" fill={colorB}>{ratio}</tspan>
            </text>
          );
        })}

        {dependentsPar.map((par, i) => {
          const textX = column[2] + _scaleX(dependentsPar[i]) - horizontalOffset;
          const textY = marginTop + barMargin + (barHeight / 2) + i * gridCellY + verticalOffset;
          return (
            <text
              key={`bottomText--${i}`}
              textAnchor="end"
              x={textX} y={textY}
              fontWeight="800"
            >
              <tspan fontFamily="Courier New" fill={colorB}>{par}</tspan>
            </text>
          );
        })}


      </svg>
    </div >
  );
}