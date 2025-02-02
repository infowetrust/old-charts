import { scaleLinear, scaleBand, extent, line } from "d3";
// import { AxisLeft, AxisBottom } from "@visx/axis";
import _, { uniq, map } from "lodash";

/* fancy stuff Micah suggested to make chart scalable */
import nicb from "../../data/nicb";
// properties
type Props = {
  barColor?: string
}
export default function Bar(props: Props) {
  const { barColor } = props


  /* 
  0. Map data to dimensions
  1. Canvas and grid
  2. Grid labels
  3. Data marks
  4. Data labels
  5. Guide lines   
  */

  {/* 0. Map data to dimensions */ }
  //map data to independent and dependent dimensions
  const independents = _.map(nicb["1914"], "state");
  const nIndependents = independents.length;

  const dependents14 = _.map(nicb["1914"], "percent");


  const dependents19 = _.map(nicb["1919"], "percent");

  {/* 1. Canvas and grid */ }
  const guideColor = "cyan";
  const guideStroke = "1";
  const guideDisplay = "none";

  //establish SVG canvas & grid
  const svgWidth = 900;
  const svgHeight = 800;
  const marginLeft = 350;
  const marginTop = 50;
  const marginBottom = 40;


  const column = [20, 70, 255, 305, marginLeft];
  const sumColumn = _.reduce(
    column,
    (sum, n) => {
      return sum + n;
    },
    0
  );

  const gridWidth = svgWidth - marginLeft;
  const gridHeight = svgHeight - marginTop - marginBottom;
  const strokeColor = "black";

  //styling
  const h1 = "1.5em";
  const verticalOffset = 5;

  const colorA = "#336699";
  const colorB = "goldenrod";

  //calculate SVG positions of grid sides
  const gridTop = svgHeight - marginBottom - gridHeight;
  const gridBottom = svgHeight - marginBottom;
  const gridRight = svgWidth;

  //calculate grid cell sizes
  const gridCellY = gridHeight / (nIndependents);
  //above multiplier accounts for ticks skipping odds

  {/* 1. Canvas and grid */ }
  const verticalCenterLabel = -5;
  const scaleFactor = 50;

  const _scaleX = scaleLinear().domain([0, 8]).range([marginLeft, svgWidth]);
  //tk scaleLinear not working with [any]
  //tk use scaleBand for bars instead?

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        width={svgWidth}
        height={svgHeight}
      >
        {/* background */}
        <rect
          x="0"
          y="0"
          width={svgWidth}
          height={svgHeight}
          // stroke={guideColor}
          // strokeWidth={guideStroke}
          fill="snow"

        />

        {/* how to do this? */}
        <style type="text/css" >
        </style>

        {/* 2. Grid labels*/}

        {/* 3. Data marks */}
        {dependents14.map((bar, i) => {
          const left = marginLeft;
          const top = gridTop + i * gridCellY;
          const length = dependents14[i] * scaleFactor;
          //const length = _scaleX(dependents14[i]);

          return (
            <rect
              key={`1914-blueBars--${i}`}
              x={left}
              y={top}
              width={length}
              height={gridCellY}
              rx="2"
              stroke="black"
              strokeWidth="1"
              fill={colorA}
              opacity="1"
            >
              {bar}
            </rect>
          );
        })}

        {dependents19.map((bar, i) => {
          const left = marginLeft;
          const top = gridTop + i * gridCellY;
          const length = dependents19[i] * scaleFactor;

          return (
            <rect
              key={`1919-goldBars--${i}`}
              x={left}
              y={top}
              width={length}
              height={gridCellY}
              stroke={colorB}
              strokeWidth="6"
              fill="none"
              opacity="1"
            >
              {bar}
            </rect>
          );
        })}

        {/*4. Data labels*/}
        <text y={gridTop} textAnchor="left" fontWeight="800">
          <tspan x={column[0]} fontFamily="Courier New">Rank</tspan>
          <tspan x={column[1]} fontFamily="Courier New">State</tspan>
          <tspan x={(column[2] + column[3]) / 2} fontFamily="Courier New" fill={colorA} textAnchor="end">1914</tspan>
          <tspan x={(column[3] + column[4]) / 2} fontFamily="Courier New" fill={colorB} textAnchor="end">1919</tspan>
        </text>

        {independents.map((year, i) => {
          // hardcoded
          const textX = (column[0] + column[1]) / 2;
          const textY = marginTop + i * gridCellY + gridCellY / 2 + verticalOffset;
          const rank = i + 1;
          return (
            <text
              key={`leftText-rank--${i}`}
              textAnchor="end"
              fontFamily="monospace" //tk not working
              x={textX}
              y={textY}
            >
              <tspan fontFamily="Courier New">{rank}</tspan>
            </text>
          );
        })}

        {independents.map((state, i) => {
          const textX = column[1];
          const textY = marginTop + i * gridCellY + gridCellY / 2 + verticalOffset;

          return (
            <text
              key={`leftText-state--${i}`}
              textAnchor="left"
              x={textX}
              y={textY}
            >
              <tspan fontFamily="Courier New">{state}</tspan>
            </text>
          );
        })}

        {dependents14.map((percent, i) => {
          const textX = (column[2] + column[3]) / 2;
          const textY = marginTop + i * gridCellY + gridCellY / 2 + verticalOffset;
          return (
            <text
              key={`leftText-percent1914--${i}`}
              textAnchor="end"
              x={textX}
              y={textY}
            >
              <tspan fontFamily="Courier New">{percent.toFixed(1)}</tspan>
            </text>
          );
        })}

        {dependents19.map((percent, i) => {
          const textX = (column[3] + column[4]) / 2;
          const textY = marginTop + i * gridCellY + gridCellY / 2 + verticalOffset;

          return (
            <text
              key={`leftText-percent1919--${i}`}
              textAnchor="end"
              x={textX}
              y={textY}
            >
              <tspan fontFamily="Courier New">{percent.toFixed(1)}</tspan>
            </text>
          );
        })}

        {/* 5. Guide lines*/}

        {/* SVG frame */}
        <rect
          x="0"
          y="0"
          width={svgWidth}
          height={svgHeight}
          stroke={guideColor}
          strokeWidth={guideStroke}
          fill="none"
          display={guideDisplay}
        />
        {/* grid */}
        <rect
          x={marginLeft}
          y={gridTop}
          width={gridWidth}
          height={gridHeight}
          stroke={guideColor}
          strokeWidth={guideStroke}
          fill="none"
          display={guideDisplay}
        />
        <text y={gridBottom + 25} textAnchor="left" fontWeight="800">
          <tspan x={column[0]} fontFamily="Courier New">Per Cent of Average Fluctuation in Employment, by States, 1914 and 1919</tspan>
        </text>
      </svg>
    </div >
  );
}
{/* <span>Per Cent of Average Fluctuation in Employmen, by States, 1914 and 1919</span> */ }