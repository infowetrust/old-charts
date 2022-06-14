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

  const verticalOffset = 3;

  const textSize = 10;
  const narrow = .8;

  {/* 0. Map data to dimensions */ }
  const independents = _.map(atlasDeParis["211"], "year");
  const nIndependents = independents.length;

  const dependentsParis = _.map(atlasDeParis["211"], "Paris");
  const dependentsReste = _.map(atlasDeParis["211"], "reste");

  const ticksFrancs = [0, 50, 100];

  {/* 1. Canvas*/ }
  const svgWidth = 800;
  const svgHeight = 500;

  const marginTop = 50;
  const marginBottom = 50;
  const marginLeft = 50;
  const marginRight = marginLeft;

  {/* 2. Grid*/ }
  const gridWidth = svgWidth - marginLeft - marginRight;
  const gridHeight = svgHeight - marginTop - marginBottom;

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

        {/* 4. Data */}
        {dependentsReste.map((bar, i) => {
          const left = gridLeft + i * gridCellX;
          const top = _scaleY(100);
          const height = gridBottom - top;
          return (
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
          );
        })}

        <PatternCircles id="circles" height={8} width={8} stroke={'colorA'} strokeWidth={1} complement />

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
            // fill="url('#lines')"
            >
              {bar}
            </rect>
          );
        })}

      </svg>
    </div >
  );
}