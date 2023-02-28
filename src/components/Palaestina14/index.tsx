import { scaleLinear, scaleBand, extent, line } from "d3";
import { PatternLines } from '@visx/pattern'; //https://airbnb.io/visx/docs/pattern
import _, { uniq, map } from "lodash";

import palaestina from "../../data/palaestina";

export default function Palaestina14() {
  /* Inspiration https://www.davidrumsey.com/luna/servlet/s/3p1eqk
  0. Map data to dimensions
  1. Canvas and grid
  2. Background
  3. Grid lines
  4. Data marks
  5. Data labels
  6. Title and legend   
  */

  //styling
  const colorA = getComputedStyle(document.documentElement).getPropertyValue('--TrietschBlue');
  const colorB = getComputedStyle(document.documentElement).getPropertyValue('--TrietschRed');
  const colorB2 = getComputedStyle(document.documentElement).getPropertyValue('--TrietschDarkRed');
  const colorC = getComputedStyle(document.documentElement).getPropertyValue('--TrietschGrey');
  const colorD = getComputedStyle(document.documentElement).getPropertyValue('--TrietschGreen');

  const colorX = "red"; //used for troubleshooting
  const colorY = getComputedStyle(document.documentElement).getPropertyValue('--cheyssonBlack');
  const colorZ = "linen";

  const verticalCenter = 11;
  const stroke = 1.5;

  {/* 0. Map data to dimensions */ }
  const independentsA = _.map(palaestina["14a"], "year");
  const nIndependentsA = independentsA.length;

  const dependentsDunam = _.map(palaestina["14a"], "dunam");
  const dependentsKeren = _.map(palaestina["14a"], "keren");
  const dependentsTextA = _.map(palaestina["14a"], "textA");
  const dependentsTextB = _.map(palaestina["14a"], "textB");
  const dependentsPercentage = _.map(palaestina["14a"], "percent");
  const keren = [independentsA,]

  {/* 1. Canvas and grid*/ }
  const gridWidth = 700;
  const gridHeight = gridWidth * .6;

  const marginTop = 120;
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
  const gridCellY = gridHeight / (nIndependentsA);

  //stretch data across grid
  const _scaleXA = scaleLinear().domain([0, 1200000]).range([0, gridWidth]);

  //title position
  const titleY = 70;
  const titleUnderlineY = titleY + 6;

  // draw chart
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={svgWidth} height={svgHeight}>


        {/* 2. Background */}
        <rect x="0" y="0" width={svgWidth} height={svgHeight} fill={colorZ} stroke="black" strokeWidth={8} />
        <rect x={gridLeft} y={marginBottom} width={gridWidth} height={svgHeight - 2 * marginBottom} fill="none" stroke="black" strokeWidth={stroke} />

        {/* 3. Grid lines */}

        {/* 4. Data marks*/}
        {/* <PatternLines
          id="linesRedTight"
          height={3}
          width={3}
          stroke={colorB}
          strokeWidth={stroke}
          orientation={['diagonal']}
        /> */}

        {/* main bars */}
        {dependentsDunam.map((bar, i) => {
          const left = gridLeft;
          const top = gridTop + i * gridCellY;
          const barLength = _scaleXA(bar);
          const height = gridCellY;
          return (
            <rect
              x={left}
              y={top}
              width={barLength}
              height={height}
              stroke={colorY}
              strokeWidth={stroke}
              fill={colorD}
            >
              {bar}
            </rect>
          );
        })}

        {/* inset bars */}

        {/* A marker to be used as an arrowhead. See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/marker */}
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 6"
            refX="10"
            refY="3"
            markerWidth="7"
            markerHeight="5"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 3 L 0 6" stroke={colorB2} strokeWidth={stroke} fill={"none"} />
          </marker>
        </defs>

        {dependentsKeren.map((bar, i) => {
          const left = gridLeft + 100;
          const barLength = _scaleXA(bar) * 2;
          const center = left + barLength / 2;
          const right = left + barLength;

          const top = gridTop + (i + .5) * gridCellY;
          const height = gridCellY / 2;
          const bottom = top + height;

          const textA = i >= 3 ? bar / 1000 : "";
          const textB = i >= 3 ? " 000 " : "";
          const textC = i >= 3 ? "D" : "";


          const textLabel = i === 4 ? "Anteil des" :
            i === 5 ? "Keren Kajemeth Lejisrael" : "";
          const textPercent = i === 3 ? "= 4 %" :
            i === 4 ? "= 17,5 %" :
              i === 5 ? "= 25 %" : "";

          const textMargin = 5;
          const textShift = i === 3 ? 8 : -50;

          const insetColor = i >= 3 ? colorB2 : "none";
          const pathD1 = i === 3 ? `M ${left + 15} ${bottom} q 0 ${height / 2}, 20 ${height}`
            : i === 4 ? `M ${left + 75} ${bottom} q 0 ${height / 2}, 30 ${height}`
              : "none";

          return (
            <g stroke={insetColor} strokeWidth={stroke * 1.5} strokeLinecap="round">
              <line x1={left} x2={left} y1={bottom} y2={top}>{bar}</line>
              <line x1={left} x2={left + barLength} y1={top} y2={top}>{bar}</line>
              <line x1={left + barLength} x2={left + barLength} y1={top} y2={bottom}>{bar}</line>
              <path d={pathD1} fill="none" markerEnd="url(#arrow)" />
              <text x={right + textShift} y={top + 15} className={"palaestinaInset"} stroke={"none"}>
                <tspan fontSize="14" textAnchor="start" >{textA}</tspan>
                <tspan fontSize="12" textAnchor="start" >{textB}</tspan>
                <tspan fontSize="14" textAnchor="start" >{textC}</tspan>
                <tspan fontSize="14" textAnchor="start" x={right + textShift} dy="14">{textPercent}</tspan>
              </text>
              <text x={left + (i - 2) * 30} y={top + 24} className={"palaestinaInset"} stroke={"none"}>
                <tspan fontSize="18" textAnchor="middle" >{textLabel}</tspan>
              </text>
            </g>
          );
        })}

        {/* 5. Data labels*/}
        {independentsA.map((year, i) => {
          const textMargin = 4;
          const textX = gridLeft + textMargin;
          const textY = gridTop + i * gridCellY + 24;
          const text = i === 5 ? year + " (Anfang)" : year;
          return (
            <text x={textX} y={textY} className={"palaestinaTitle"} fontWeight={800} >
              <tspan fontSize="18" textAnchor="start">{text}</tspan>
            </text>
          );
        })}

        {dependentsDunam.map((dunam, i) => {
          const textMargin = 8;
          const textX = gridLeft + _scaleXA(dunam) - textMargin;
          const textY = gridTop + (i + 1) * gridCellY - textMargin;
          const thousand = dunam / 1000;
          const text = i === nIndependentsA - 1 ? " 000 Dunam" : " 000";
          return (
            <text x={textX} y={textY} className={"palaestinaTitle"}  >
              <tspan fontSize="26" textAnchor="end">{thousand}</tspan>
              <tspan fontSize="24" textAnchor="end">{text}</tspan>
            </text>
          );
        })}

        {/* 6. Title and legend*/}
        <g stroke={colorB} z-index="10" strokeWidth="6">
          <line
            x1={gridCenter - 280} x2={gridCenter + 280}
            y1={titleUnderlineY} y2={titleUnderlineY} />
        </g>

        <text className={"palaestinaTitle"}>
          <tspan x={gridLeft + (gridWidth / 2)} y={titleY} fontSize={39}>Der jüdische Bodenbesitz in Palästina</tspan>
          <tspan x={gridLeft + (gridWidth / 2)} dy={40} fontSize={26}>Wachstum von 1890 bis 1926</tspan>
        </text>

      </svg>
    </div >
  );
}