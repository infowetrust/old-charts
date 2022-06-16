import { scaleLinear, scaleBand, extent, line } from "d3";
import { PatternLines, PatternCircles } from '@visx/pattern'; //https://airbnb.io/visx/docs/pattern
import _, { uniq, map } from "lodash";

import atlasDeParis from "../../data/atlasDeParis";

export default function Stackpop() {

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
  const colorA = getComputedStyle(document.documentElement).getPropertyValue('--cheyssonBlack');
  const colorX = "red"; //used for troubleshooting
  const colorZ = "ivory";

  const narrow = .75;

  {/* 0. Map data to dimensions */ }
  const independents = _.map(atlasDeParis["211"], "year");
  const nIndependents = independents.length;

  const dependentsParis = _.map(atlasDeParis["211"], "Paris");
  const dependentsReste = _.map(atlasDeParis["211"], "reste");

  const ticksPop = [0, 25, 50, 75, 100];

  {/* 1. Canvas and grid*/ }
  const gridWidth = 700;
  const gridHeight = gridWidth * .55;

  const marginTop = 150;
  const marginBottom = 50;
  const marginLeft = 80;
  const marginRight = marginLeft;

  const svgWidth = gridWidth + marginLeft + marginRight;
  const svgHeight = gridHeight + marginTop + marginBottom;

  const gridTop = marginTop;
  const gridBottom = marginTop + gridHeight;
  const gridLeft = marginLeft;
  const gridRight = marginLeft + gridWidth;

  //calculate grid cell dimensions
  const gridCellX = gridWidth / (nIndependents);

  //stretch data across grid
  const _scaleX = scaleLinear().domain([0, nIndependents]).range([gridLeft, gridRight]);
  const _scaleY = scaleLinear().domain([0, 100]).range([gridBottom, gridTop]);

  // draw chart
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={svgWidth} height={svgHeight}>
        {/* background */}
        <rect x="0" y="0" width={svgWidth} height={svgHeight} fill={colorZ} />

        {/* horizontal axis labels */}
        {independents.map((year, i) => {
          const textX = gridLeft + i * gridCellX;
          const textY = gridBottom + 15;

          return (
            <text
              className={"stackpopText"}
              key={`year--${i}`}
              x={gridLeft + i * gridCellX + .5 * narrow * gridCellX}
              y={gridBottom + 16}
              textAnchor="middle"
            >
              <tspan>{year}</tspan>
            </text>
          );
        })}
        {/* vertical axis labels */}
        {ticksPop.map((tick, i) => {
          return (
            <text
              className={"stackpopText"}
              key={`text--${i}`}
              x={gridLeft - 10}
              y={_scaleY(tick) + 5}
              textAnchor="end"
            >
              <tspan >{tick}</tspan>
            </text>

          );
        })}

        {ticksPop.map((tick, i) => {
          return (
            <line
              key={`tick--${i}`}
              x1={gridLeft - 6}
              x2={gridLeft}
              y1={_scaleY(tick)}
              y2={_scaleY(tick)}
              stroke={colorA}
              strokeWidth={2}
              stroke-linecap={"round"}
            >
            </line>
          );
        })}

        {/* 4. Data marks*/}
        {dependentsReste.map((bar, i) => {
          const left = gridLeft + i * gridCellX;
          const top = _scaleY(100);
          const height = gridBottom - top;
          return (
            <g>
              <rect
                x={left}
                y={top}
                width={gridCellX * narrow}
                height={height}
                stroke={colorA}
                strokeWidth="2"
                fill="none"
              >
                {bar}
              </rect>
              <rect
                x={left}
                y={top}
                rx="3" ry="3"
                width={gridCellX * narrow}
                height={height}
                stroke={colorA}
                strokeWidth="2"
                fill="none"
              >
                {bar}
              </rect>
            </g>
          );
        })}

        <PatternCircles id="circles" height={8} width={8} fill={colorA} stroke={"none"} strokeWidth={1} complement />

        {dependentsReste.map((bar, i) => {
          const left = gridLeft + i * gridCellX;
          const top = _scaleY(dependentsReste[i]);
          const height = gridBottom - top;
          return (
            <rect
              x={left}
              y={top}
              width={gridCellX * narrow}
              height={height}
              stroke={colorA}
              strokeWidth="2"
              fill="url('#circles')"
            >
              {bar}
            </rect>
          );
        })}

        {dependentsParis.map((bar, i) => {
          const left = gridLeft + i * gridCellX;
          const top = _scaleY(dependentsParis[i]);
          const height = gridBottom - top;
          return (
            <rect
              x={left}
              y={top}
              width={gridCellX * narrow}
              height={height}
              stroke={colorA}
              strokeWidth="1"
              fill={colorA}
            >
              {bar}
            </rect>
          );
        })}
        {/* Title and legend*/}
        <text className={"stackpopTitle"}>
          <tspan x={gridLeft + (gridWidth / 2)} y={34} >PART RELATIVE DE LA POPULATION DE PARIS</tspan>
          <tspan x={gridLeft + (gridWidth / 2)} dy={16}>DANS LE DÉPARTMENTS DE LA SEINE ET LA RÉGION</tspan>
          <tspan x={gridLeft + (gridWidth / 2)} dy={16}>A DIFFÉRENTES DATES ENTRE 1801 ET 1962</tspan>
        </text>

        <text className={"stackpopText"} textAnchor={"start"}>
          <tspan x={gridLeft + 100} y={110} >Paris</tspan>
          <tspan dx={150}>Reste de la Seine</tspan>
          <tspan dx={150}>Reste de la région</tspan>
          <tspan x={gridLeft - 20} y={gridTop - 10}>%</tspan>
        </text>

        <g strokeWidth={2} stroke={colorA} >
          <rect x={gridLeft + 60} y={95} rx={1} ry={1} width={30} height={20} fill={colorA} ></rect>
          <rect x={gridLeft + 235} y={95} rx={1} ry={1} width={30} height={20} fill={"url('#circles')"} ></rect>
          <rect x={gridLeft + 475} y={95} rx={1} ry={1} width={30} height={20} fill={colorZ} ></rect>
        </g>

      </svg>
    </div >
  );
}