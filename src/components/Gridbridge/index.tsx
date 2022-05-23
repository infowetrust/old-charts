import { scaleLinear, scaleBand, extent, line } from "d3";
// import { AxisLeft, AxisBottom } from "@visx/axis";
import _, { uniq, map } from "lodash";

import cheysson from "../../data/cheysson";

export default function Gridbridge() {

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
  const colorA = "#333333";
  const colorB = "steelBlue";
  const colorX = "red";
  const colorZ = "linen";

  const strokeWidth = .5;
  const strokeWidthEmphasis = 2;

  const cR = 3;

  const verticalOffset = 3;


  const textSize = 10;
  const textSizeTiny = 8;
  const wordSpace = 8;
  const hoverGap = 15;

  {/* 0. Map data to dimensions */ }
  //map data to independent and dependent dimensions
  const independents = _.map(cheysson["1881-8"], "year");
  const nIndependents = independents.length;

  const independentsLabel = independents.map(function (year, i) {
    return (i === 0 || i === (nIndependents - 1)) ? year : year - 1800
  });

  const dependentsTotal = _.map(cheysson["1881-8"], "total");
  const dependentsFast = _.map(cheysson["1881-8"], "fast");
  const dependentsSlow = _.map(cheysson["1881-8"], "slow");
  const dependentsPassengers = _.map(cheysson["1881-8"], "passengers");
  const dependentsTons = _.map(cheysson["1881-8"], "tons");

  //TK generate these procedurally
  const ticksFrancs = [, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53];
  const ticksFrancsLines = [, 1, , 3, , 5, , 7, , 9, , 11, , 13, , 15, , 17, , 19, , 21, , 23, , 25, , 27, , 29, , 31, , 33, , 35, , 37, , 39, , 41, , 43, , 45, , 47, 48, 49, 50, 51, 52, 53];
  const ticksLength = [, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  const ticksDistance = [, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
  const ticksPerKm = [, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const ticksPerKmLines = [, 1, 2, , 4, 5, , 7, 8];

  {/* 1. Canvas*/ }
  const svgWidth = 600;
  const svgHeight = 850;

  const marginTop = 40;
  const marginBottom = 40;
  const marginLeft = 20;
  const marginRight = marginLeft;

  const channelSide = 70;

  {/* 2. Grid*/ }
  const gridWidth = svgWidth - marginLeft - marginRight - (2 * channelSide);
  const gridHeight = svgHeight - marginTop - marginBottom;

  const gridTop = marginTop;
  const gridBottom = marginTop + gridHeight;
  const gridLeft = marginLeft + channelSide;
  const gridRight = marginLeft + channelSide + gridWidth;

  const underline = gridTop + 60;

  //calculate grid cell dimensions
  const gridCellX = gridWidth / (nIndependents - 1);

  const topValue = 60;
  const gridCellFrancs = gridHeight / topValue;
  const gridCellLength = gridHeight / (topValue / 2);
  const gridCellDistance = 3 * gridHeight / (topValue);

  //stretch data across grid
  const _scaleX = scaleLinear().domain([0, 38]).range([gridLeft, gridRight]);
  const _scaleYFrancs = scaleLinear().domain([0, topValue]).range([gridBottom, gridTop]);
  const _scaleYDistance = scaleLinear().domain([0, topValue * 3.33]).range([gridBottom, gridTop]);

  //create curve
  const _lineMakerBlue = line()
    .x((d, i) => {
      return _scaleX(i);
    })
    .y((d) => {
      // @ts-ignore
      return _scaleYFrancs(d);

    });

  const _lineMakerBlueLabel = line()
    .x((d, i) => {
      return _scaleX(i);
    })
    .y((d) => {
      // @ts-ignore
      return _scaleYFrancs(d) - hoverGap;

    });

  const _lineMakerDistance = line()
    .x((d, i) => {
      return _scaleX(i);
    })
    .y((d) => {
      // @ts-ignore
      return _scaleYDistance(d);

    });

  const _totalLine = _lineMakerBlue(dependentsTotal);
  const _totalLineLabel = _lineMakerBlueLabel(dependentsTotal);
  const _fastLineLabel = _lineMakerBlueLabel(dependentsFast);

  const _fastLine = _lineMakerBlue(dependentsFast);
  const _slowLine = _lineMakerBlue(dependentsSlow);
  const _passengersLine = _lineMakerDistance(dependentsPassengers);
  const _tonsLine = _lineMakerDistance(dependentsTons);

  // draw chart
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={svgWidth} height={svgHeight}>
        {/* background */}
        <rect x="0" y="0" width={svgWidth} height={svgHeight} fill={colorZ} />

        {/* 2. Grid */}

        {/* vertical gridlines */}


        {dependentsTotal.map((total, i) => {
          return (
            <line
              key={`vertical-gridline-${i}`}
              x1={gridLeft + i * gridCellX}
              x2={gridLeft + i * gridCellX}
              y1={gridBottom}
              y2={_scaleYFrancs(total)}
              stroke={colorA}
              strokeWidth={strokeWidth}
            />
          );
        })}
        {/* horizontal gridlines */}

        <clipPath id="polygonMask">
          {dependentsTotal.map((total, i) => {
            const iX = gridLeft + i * gridCellX;
            const iY = _scaleYFrancs(total);
            const plusX = gridLeft + (i + 1) * gridCellX;
            const plusY = _scaleYFrancs(dependentsTotal[i + 1]);

            const p1 = [gridLeft, gridBottom];
            const p2 = [gridLeft, iY];
            const p3 = [iX, iY];
            const p4 = [plusX, plusY];
            const p5 = [plusX, gridBottom];
            const poly = [p1, p2, p3, p4, p5];

            return (
              <polygon
                key={`clipPolygon--${i}`}
                // @ts-ignore
                points={poly}
              >
              </polygon>
            );
          })}
        </clipPath>

        {ticksFrancs.map((dependentsTotal, i) => {
          return (
            <line
              key={`horizontal-gridline-blue${i}`}
              x1={gridLeft}
              x2={gridRight}
              y1={gridBottom - i * gridCellFrancs}
              y2={gridBottom - i * gridCellFrancs}
              stroke={colorA}
              strokeWidth={strokeWidth}
              clipPath="url(#polygonMask)"
            />
          );
        })}

        {/* 3. Grid labels*/}
        {/* 1st vertical axis labels */}
        {ticksFrancs.map((tick, i) => {
          const horizontalOffset = .75 * channelSide; // hardcoded
          const textOffsetX = gridLeft - horizontalOffset;
          const textOffsetY = gridBottom - i * gridCellFrancs + verticalOffset;

          return (
            <text
              key={`blueText--${i}`}
              fontWeight={800}
              fill={colorB}
              textAnchor="middle"
              x={textOffsetX}
              y={textOffsetY}
            >
              <tspan letterSpacing={-.4} font-size={textSize}>{tick}</tspan>
            </text>
          );
        })}

        {ticksFrancsLines.map((dependentsTotal, i) => {
          return (
            <line
              key={`horizontal-gridline-dash-left${i}`}
              x1={gridLeft - .6 * channelSide}
              x2={gridLeft}
              y1={gridBottom - i * gridCellFrancs}
              y2={gridBottom - i * gridCellFrancs}
              stroke={colorA}
              stroke-dasharray="2, 2"
              strokeWidth={strokeWidth}
            />
          );
        })}

        <line
          key={`vertical-centerline-black`}
          x1={gridLeft - .5 * channelSide}
          x2={gridLeft - .5 * channelSide}
          y1={gridBottom}
          y2={gridTop + 35}
          stroke={colorA}
          strokeWidth={strokeWidth}
        />

        {/* 2nd vertical tick labels */}
        {ticksLength.map((tick, i) => {
          const horizontalOffset = .25 * channelSide; // hardcoded
          const textOffsetX = gridLeft - horizontalOffset;
          const textOffsetY = gridBottom - i * gridCellLength + verticalOffset;

          return (
            <text
              key={`blackText--${i}`}
              fontWeight={800}
              fill={colorA}
              x={textOffsetX}
              y={textOffsetY}
              textAnchor="middle"
            >
              <tspan letterSpacing={-.4} font-size={textSize}>{tick}</tspan>
            </text>
          );
        })}
        {/* 3rd vertical tick labels */}
        {ticksDistance.map((tick, i) => {
          const horizontalOffset = .25 * channelSide; // hardcoded
          const textOffsetX = gridRight + horizontalOffset;
          const textOffsetY = gridBottom - i * gridCellDistance + verticalOffset;

          return (
            <text
              key={`blackText2--${i}`}
              fontWeight={800}
              fill={colorA}
              x={textOffsetX}
              y={textOffsetY}
              textAnchor="middle"
            >
              <tspan letterSpacing={-.4} font-size={textSize}>{tick}</tspan>
            </text>
          );
        })}

        <line
          key={`vertical-centerline-black-right`}
          x1={gridRight + .5 * channelSide}
          x2={gridRight + .5 * channelSide}
          y1={gridBottom}
          y2={gridTop + 35}
          stroke={colorA}
          strokeWidth={strokeWidth}
        />

        {/* 4th vertical axis labels */}
        {ticksPerKm.map((tick, i) => {
          const horizontalOffset = .75 * channelSide; // hardcoded
          const textOffsetX = gridRight + horizontalOffset;
          const textOffsetY = gridBottom - i * gridCellFrancs + verticalOffset;

          return (
            <text
              key={`PerKmText--${i}`}
              fontWeight={800}
              fill={colorA}
              textAnchor="middle"
              x={textOffsetX}
              y={textOffsetY}
            >
              <tspan letterSpacing={-.4} font-size={textSize}>{tick}</tspan>
            </text>
          );
        })}

        {ticksPerKmLines.map((dependents, i) => {
          return (
            <line
              key={`horizontal-gridline-dash-right${i}`}
              x1={gridRight}
              x2={gridRight + .65 * channelSide}
              y1={gridBottom - i * gridCellFrancs}
              y2={gridBottom - i * gridCellFrancs}
              stroke={colorA}
              stroke-dasharray="2, 2"
              strokeWidth={strokeWidth}
            />
          );
        })}

        <line
          key={`vertical-centerline-black`}
          x1={gridLeft - .5 * channelSide}
          x2={gridLeft - .5 * channelSide}
          y1={gridBottom}
          y2={gridTop + 35}
          stroke={colorA}
          strokeWidth={strokeWidth}
        />

        {/* horizontal axis labels */}
        {independentsLabel.map((year, i) => {
          const textX = gridLeft + i * gridCellX;
          const textY = gridBottom + 10;

          return (
            <text
              key={`blueText--${i}`}
              fontWeight={800}
              fill={colorA}
              textAnchor="middle"
              x={textX}
              y={textY}
            >
              <tspan letterSpacing={-.4} font-size={textSizeTiny}>{year}</tspan>
            </text>
          );
        })}

        {/* 4. Data */}
        {/* Labels on select data points. Text background color filter method from https://stackoverflow.com/questions/15500894/background-color-of-text-in-svg */}
        <filter x="0" y="0" width="1" height="1" id="block">
          <feFlood flood-color={colorZ} result="bg" />
          <feMerge>
            <feMergeNode in="bg" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="outline">
          <feDropShadow dx="0" dy="0" stdDeviation="3" flood-opacity="0.5" />
          <feFlood flood-color={colorX} result="bg" />
          <feMerge>
            <feMergeNode in="bg" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {dependentsTotal.map((label, i) => {
          const textX = 6 + gridLeft + i * gridCellX;
          const textY = 3 + _scaleYFrancs(label);
          return (
            <text
              key={`labelText--${i}`} fontWeight={800} filter={"url(#block)"} fill={colorB} x={textX} y={textY} textAnchor="start"
              display={
                i === 6 || i === 14 || i === 17 || i === 20 || i === 29 || i === 32
                  ? "block" : "none"
              }
            >
              <tspan font-size={textSize}>{label}</tspan>
              <tspan font-size={textSize * .66} baseline-shift="super">F</tspan>
            </text>
          );
        })}
        {dependentsFast.map((label, i) => {
          const textX = 6 + gridLeft + i * gridCellX;
          const textY = 3 + _scaleYFrancs(label);
          return (
            <text
              key={`labelTextFast--${i}`} fontWeight={800} filter={"url(#block)"} fill={colorB} x={textX} y={textY} textAnchor="start"
              display={
                i === 6 || i === 14 || i === 18 || i === 30
                  ? "block" : "none"
              }
            >
              <tspan font-size={textSize}>{label}</tspan>
              <tspan font-size={textSize * .66} baseline-shift="super">F</tspan>
            </text>
          );
        })}
        {dependentsSlow.map((label, i) => {
          const textX = 6 + gridLeft + i * gridCellX;
          const textY = 3 + _scaleYFrancs(label);
          return (
            <text
              key={`labelTextSlow--${i}`} fontWeight={800} filter={"url(#block)"} fill={colorB} x={textX} y={textY} textAnchor="start"
              display={
                i === 6 || i === 20 || i === 32
                  ? "block" : "none"
              }
            >
              <tspan font-size={textSize}>{label}</tspan>
              <tspan font-size={textSize * .66} baseline-shift="super">F</tspan>
            </text>
          );
        })}
        {dependentsPassengers.map((label, i) => {
          const textX = 6 + gridLeft + i * gridCellX;
          const textY = 3 + _scaleYDistance(label);
          const labelComma = (label * 1000000).toLocaleString('en-US');
          return (
            <text
              key={`labelTextPassengers--${i}`} fontWeight={800} filter={"url(#block)"} fill={colorA} x={textX} y={textY} textAnchor="start"
              display={
                i === 30
                  ? "block" : "none"
              }
            >
              <tspan font-size={textSize}>{labelComma}</tspan>
              <tspan font-size={textSize * .8} baseline-shift="super" font-style="italic"> voyageurs</tspan>
            </text>
          );
        })}
        {dependentsTons.map((label, i) => {
          const textX = gridLeft + i * gridCellX - 4;
          const textY = _scaleYDistance(label);
          const labelComma = (label * 1000000).toLocaleString('en-US');
          return (
            <text
              key={`labelTextTons--${i}`} fontWeight={800} filter={"url(#block)"} fill={colorA} x={textX} y={textY} textAnchor="end"
              display={
                i === 20 || i === 28
                  ? "block" : "none"
              }
            >
              <tspan font-size={textSize}>{labelComma}</tspan>
              <tspan font-size={textSize * .8} baseline-shift="super">T</tspan>
            </text>
          );
        })}
        {/* Hollow dots on select data points */}
        {dependentsTotal.map((circle, i) => {
          const circleX = gridLeft + i * gridCellX;
          const circleY = _scaleYFrancs(circle);
          return (
            <circle
              key={`labelTextTotal--${i}`}
              fill="none" r={cR} strokeWidth={strokeWidthEmphasis} stroke={colorB} cx={circleX} cy={circleY}
              display={
                i === 6 || i === 14 || i === 17 || i === 20 || i === 29 || i === 32
                  ? "block" : "none"}
            ></circle>
          );
        })}
        {dependentsFast.map((circle, i) => {
          const circleX = gridLeft + i * gridCellX;
          const circleY = _scaleYFrancs(circle);
          return (
            <circle
              key={`labelTextFast--${i}`}
              fill="none" r={cR} strokeWidth={strokeWidthEmphasis} stroke={colorB} cx={circleX} cy={circleY}
              display={
                i === 6 || i === 14 || i === 18 || i === 30
                  ? "block" : "none"}
            ></circle>
          );
        })}
        {dependentsSlow.map((circle, i) => {
          const circleX = gridLeft + i * gridCellX;
          const circleY = _scaleYFrancs(circle);
          return (
            <circle
              key={`labelTextSlow--${i}`}
              fill="none" r={cR} strokeWidth={strokeWidthEmphasis} stroke={colorB} cx={circleX} cy={circleY}
              display={
                i === 6 || i === 20 || i === 32
                  ? "block" : "none"}
            ></circle>
          );
        })}
        {dependentsPassengers.map((circle, i) => {
          const circleX = gridLeft + i * gridCellX;
          const circleY = _scaleYDistance(circle);
          return (
            <circle
              key={`labelTextPassengers--${i}`}
              fill="none" r={cR} strokeWidth={strokeWidthEmphasis} stroke={colorA} cx={circleX} cy={circleY}
              display={
                i === 30
                  ? "block" : "none"}
            ></circle>
          );
        })}

        {dependentsTons.map((circle, i) => {
          const circleX = gridLeft + i * gridCellX;
          const circleY = _scaleYDistance(circle);
          return (
            <circle
              key={`labelTextTons--${i}`}
              fill="none" r={cR} strokeWidth={strokeWidthEmphasis} stroke={colorA} cx={circleX} cy={circleY}
              display={
                i === 20 || i === 28
                  ? "block" : "none"}
            ></circle>
          );
        })}

        {/* data curves */}
        {typeof _totalLine === "string" && (
          <path
            key={`total-line`}
            stroke={colorB}
            strokeWidth={strokeWidthEmphasis}
            fill="none"
            stroke-linejoin="round"
            d={_totalLine}
          />
        )}

        {typeof _totalLineLabel === "string" && (
          <defs>
            <path
              id="labelPathTotal"
              stroke={"red"}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              d={_totalLineLabel}
            />
          </defs>
        )}

        <text>
          <textPath
            href="#labelPathTotal"
            textAnchor="start"
            startOffset="2%"
            letterSpacing={".1em"}
            wordSpacing={wordSpace}
            font-size={textSizeTiny}
            fill={colorB}
            fontWeight={800}
            fontStyle={"italic"}
          // filter={"url(#outline)"}
          >
            III. Recettes brutes Kilométriques totales
          </textPath>
        </text>

        {typeof _fastLineLabel === "string" && (
          <defs>
            <path
              id="labelPathFast"
              stroke={"red"}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              d={_fastLineLabel}
            />
          </defs>
        )}
        <text>
          <textPath
            href="#labelPathFast"
            textAnchor="start"
            startOffset="2%"
            letterSpacing={".1em"}
            wordSpacing={6}
            font-size={textSizeTiny}
            fill={colorB}
            fontWeight={800}
            fontStyle={"italic"}
          >
            I. Recettes brutes Kilométriques
          </textPath>
          <textPath
            href="#labelPathFast"
            textAnchor="start"
            startOffset="32%"
            letterSpacing={".1em"}
            wordSpacing={6}
            font-size={textSizeTiny}
            fill={colorB}
            fontWeight={800}
            fontStyle={"italic"}
          >
            de Grande Vitesse
          </textPath>
        </text>

        {typeof _fastLine === "string" && (
          <path
            key={`fast-line`}
            stroke={colorB}
            strokeWidth={strokeWidthEmphasis}
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            d={_fastLine}
            stroke-dasharray="9,6,2,6"
          />
        )}

        {typeof _slowLine === "string" && (
          <path
            key={`slow-line`}
            stroke={colorB}
            strokeWidth={strokeWidthEmphasis}
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            d={_slowLine}
            stroke-dasharray="2,3"
          />
        )}

        {typeof _passengersLine === "string" && (
          <path
            key={`passengers-line`}
            stroke={colorA}
            strokeWidth={strokeWidthEmphasis}
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            d={_passengersLine}
            stroke-dasharray="6,4"
          />
        )}

        {typeof _tonsLine === "string" && (
          <path
            key={`tons-line`}
            stroke={colorA}
            strokeWidth={strokeWidthEmphasis}
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            d={_tonsLine}
          />
        )}

        {/* borders */}
        <rect
          x={marginLeft} y={gridTop}
          width={gridWidth + 2 * channelSide} height={gridHeight}
          fill="none"
          stroke={colorA}
          strokeWidth={strokeWidthEmphasis} />
        <rect
          x={gridLeft} y={gridTop}
          width={gridWidth} height={gridHeight}
          fill="none"
          stroke={colorA}
          strokeWidth={strokeWidthEmphasis} />

        {/* Main chart title */}
        <text textAnchor="middle" fill={colorA} x={gridLeft + (gridWidth / 2)} y={.8 * marginTop}>
          <tspan font-size={18} font-weight={800}>Eléments absolus</tspan>
        </text>

        {/* Channel titles */}
        <text textAnchor="middle" fill={colorA}>
          <tspan x={marginLeft + .5 * channelSide} y={marginTop + 20} font-size={textSize} fontWeight={800}>Échelles</tspan>
          <tspan x={marginLeft + .5 * channelSide} dy={8} font-style="italic" font-size={textSizeTiny} >en milliers</tspan>

          <tspan x={marginLeft + .25 * channelSide} y={marginTop + 55} font-size={textSize} fontWeight={800}>F</tspan>
          <tspan x={marginLeft + .75 * channelSide} y={marginTop + 55} font-size={textSize} fontWeight={800}>km</tspan>

          <tspan x={gridRight + .5 * channelSide} y={marginTop + 12} font-size={textSize} fill={colorA} fontWeight={800}>Échelles des</tspan>
          <tspan x={gridRight + .5 * channelSide} dy={8} font-size={textSize} fill={colorA} fontWeight={800}>tonnes et des</tspan>
          <tspan x={gridRight + .5 * channelSide} dy={8} font-size={textSize} fill={colorA} fontWeight={800}>voyageurs</tspan>
        </text>

        {/* Right channel subtitles */}

        <text textAnchor="middle" fill={colorA} font-style="italic" >
          <tspan x={gridRight + .25 * channelSide} y={marginTop + 40} font-size={textSizeTiny}>à toute</tspan>
          <tspan x={gridRight + .25 * channelSide} dy={8} font-size={textSizeTiny}>distance</tspan>
          <tspan x={gridRight + .25 * channelSide} dy={8} font-size={textSizeTiny}>(millions)</tspan>

          <tspan x={gridRight + .75 * channelSide} y={marginTop + 40} font-size={textSizeTiny}>Kilomé-</tspan>
          <tspan x={gridRight + .75 * channelSide} dy={8} font-size={textSizeTiny}>triques</tspan>
          <tspan x={gridRight + .75 * channelSide} dy={8} font-size={textSizeTiny}> (milliards)</tspan>
        </text>

        <line
          x1={marginLeft + .1 * channelSide}
          x2={marginLeft + .4 * channelSide}
          y1={underline}
          y2={underline}
          stroke={colorA}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <line
          x1={marginLeft + .6 * channelSide}
          x2={marginLeft + .9 * channelSide}
          y1={underline}
          y2={underline}
          stroke={colorA}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <line
          x1={gridRight + .1 * channelSide}
          x2={gridRight + .4 * channelSide}
          y1={underline}
          y2={underline}
          stroke={colorA}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <line
          x1={gridRight + .6 * channelSide}
          x2={gridRight + .9 * channelSide}
          y1={underline}
          y2={underline}
          stroke={colorA}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

      </svg>
    </div >
  );
}