import { scaleLinear, scaleBand, extent, line } from "d3";
import { PatternLines } from '@visx/pattern'; //https://airbnb.io/visx/docs/pattern
import _, { uniq, map } from "lodash";

import palaestina from "../../data/palaestina";

export default function Palaestina() {
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
  const colorA = getComputedStyle(document.documentElement).getPropertyValue('--TrietschBlue');
  const colorB = getComputedStyle(document.documentElement).getPropertyValue('--TrietschRed');
  const colorC = getComputedStyle(document.documentElement).getPropertyValue('--TrietschGrey');

  const colorX = "red"; //used for troubleshooting
  const colorY = getComputedStyle(document.documentElement).getPropertyValue('--cheyssonBlack');
  const colorZ = "linen";

  const verticalCenter = 10;
  const stroke = 1.5;

  {/* 0. Map data to dimensions */ }
  const independents = _.map(palaestina["6"], "investor");
  const nIndependents = independents.length;

  const dependentsKapital = _.map(palaestina["6"], "Kapital");
  const dependentsInvestor = _.map(palaestina["6"], "investor");
  const detail = _.map(palaestina["6"], "detail");
  const detail2 = _.map(palaestina["6"], "detail2");
  const detail3 = _.map(palaestina["6"], "detail3");

  {/* 1. Canvas and grid*/ }
  const gridWidth = 700;
  const gridHeight = gridWidth * .55;

  const marginTop = 170;
  const marginBottom = 25;
  const marginLeft = marginBottom;
  const marginRight = marginLeft;

  const svgWidth = gridWidth + marginLeft + marginRight;
  const svgHeight = gridHeight + marginTop + marginBottom;

  const gridTop = marginTop;
  const gridBottom = marginTop + gridHeight;
  const gridLeft = marginLeft;
  const gridRight = marginLeft + gridWidth;
  const gridCenter = (gridLeft + gridRight) / 2;

  //calculate grid cell dimensions
  const gridCellY = gridHeight / (nIndependents);

  //stretch data across grid
  const _scaleX = scaleLinear().domain([0, 10]).range([gridLeft, gridRight]);

  // draw chart
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={svgWidth} height={svgHeight}>
        {/* background */}
        <rect x="0" y="0" width={svgWidth} height={svgHeight} fill={colorZ} stroke="black" strokeWidth={8} />
        <rect x={gridLeft} y={gridTop} width={gridWidth} height={gridHeight} fill="none" stroke="black" strokeWidth={stroke} />

        {/* Gridlines */}
        {independents.map((independents, i) => {
          return (
            <line
              stroke="black"
              strokeWidth={stroke}
              stroke-dasharray="14, 10"
              x1={gridLeft}
              x2={gridRight}
              y1={gridTop + i * gridCellY}
              y2={gridTop + i * gridCellY}
            />
          );
        })}
        {/* 4. Data marks*/}
        <PatternLines
          id="linesRed"
          height={3}
          width={3}
          stroke={colorB}
          strokeWidth={stroke}
          orientation={['diagonal']}
        />

        {dependentsKapital.map((bar, i) => {
          const left = gridLeft;
          const top = gridTop + i * gridCellY;
          const barLength = _scaleX(bar);
          const height = gridCellY;
          return (
            <rect
              x={left}
              y={top}
              width={barLength}
              height={height}
              stroke={colorY}
              strokeWidth={stroke}
              fill={
                i < 2 ? colorA
                  : i === 2 ? colorC
                    : i === 3 ? "url('#linesRed')"
                      : colorB}
            >
              {bar}
            </rect>
          );
        })}

        {/* Data labels*/}
        {dependentsKapital.map((Kapital, i) => {
          const textX = gridLeft + .5 * _scaleX(Kapital);
          const textY = gridTop + .5 * gridCellY + i * gridCellY + verticalCenter;
          const text =
            i === 4 ? Kapital + " Millionen" : Kapital;
          return (
            <text x={textX} y={textY} className={"palaestinaTitle"}  >
              <tspan fontSize="32" textAnchor="start">{text}</tspan>
            </text>
          );
        })}

        <g stroke={colorB} z-index="10" strokeWidth="4">
          <line
            x1={gridLeft + .85 * gridWidth} x2={gridLeft + .94 * gridWidth}
            y1={gridTop + 4 * gridCellY + 38} y2={gridTop + 4 * gridCellY + 38} />
          <line
            x1={gridLeft + .85 * gridWidth} x2={gridLeft + .945 * gridWidth}
            y1={gridTop + 4 * gridCellY + 62} y2={gridTop + 4 * gridCellY + 62} />
        </g>

        {dependentsInvestor.map((investor, i) => {
          const textX = gridLeft + .25 * gridWidth + i * (.15 * gridWidth);
          const textY = gridTop + .3 * gridCellY + i * gridCellY + verticalCenter;
          // const redUnderline = i === 4 ? "XXX" : "";
          return (
            <text className={"palaestinaLabel"} textAnchor={"start"}>
              <tspan x={textX} y={textY} fontSize="22" textDecoration={"underline"}>{investor}</tspan>
              <tspan y={textY} fontSize="18" >{detail[i]}</tspan>
              <tspan x={textX} y={textY + 24} fontSize="18" >{detail2[i]}</tspan>
              <tspan x={textX} y={textY + 24} fontSize="22" textDecoration={"underline"}>{detail3[i]}</tspan>
              {/* <tspan x={textX} dy={4} fontSize="22" textDecoration={"underline"} fill={colorB}>{redUnderline}</tspan> */}
            </text>
          );
        })}

        {/* Title and legend*/}
        <g stroke={colorB} z-index="10" strokeWidth="6">
          <line
            x1={gridCenter - 325} x2={gridCenter + 325}
            y1={56} y2={56} />
          <line
            x1={gridCenter - 290} x2={gridCenter + 290}
            y1={96} y2={96} />
          <line
            x1={gridCenter - 190} x2={gridCenter + 190}
            y1={136} y2={136} />
        </g>

        <text className={"palaestinaTitle"}>
          <tspan x={gridLeft + (gridWidth / 2)} y={50} fontSize={32}>Jüdische Kapital - Investierung in Palästina</tspan>
          <tspan x={gridLeft + (gridWidth / 2)} dy={40} fontSize={28}>– in Millionen Pfund Sterline (abgerundet) –</tspan>
          <tspan x={gridLeft + (gridWidth / 2)} dy={40} fontSize={22} fontStyle={"italic"}>Status Mitte 1925:20 Millionen Pfund</tspan>
        </text>

      </svg>
    </div >
  );
}