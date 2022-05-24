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
  const colorA = getComputedStyle(document.documentElement).getPropertyValue('--cheyssonBlack');
  const colorB = getComputedStyle(document.documentElement).getPropertyValue('--cheyssonBlue');
  const colorX = "red"; //used for troubleshooting
  const colorZ = getComputedStyle(document.documentElement).getPropertyValue('--cheyssonPaper');

  const cR = 3;

  const verticalOffset = 3;

  const textSize = 10;
  const textSizeTiny = 8;
  const hoverGap = 15;

  {/* 0. Map data to dimensions */ }
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
  const _lineMakerFrancs = line()
    .x((d, i) => {
      return _scaleX(i);
    })
    .y((d) => {
      // @ts-ignore
      return _scaleYFrancs(d);
    });

  const _lineMakerFrancsLabel = line()
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

  const _lineMakerDistanceLabel = line()
    .x((d, i) => {
      return _scaleX(i);
    })
    .y((d) => {
      // @ts-ignore
      return _scaleYDistance(d) - hoverGap;

    });

  const _totalLine = _lineMakerFrancs(dependentsTotal);
  const _totalLineLabel = _lineMakerFrancsLabel(dependentsTotal);

  const _fastLine = _lineMakerFrancs(dependentsFast);
  const _fastLineLabel = _lineMakerFrancsLabel(dependentsFast);

  const _slowLine = _lineMakerFrancs(dependentsSlow);
  const _slowLineLabel = _lineMakerFrancsLabel(dependentsSlow);

  const _passengersLine = _lineMakerDistance(dependentsPassengers);
  const _passengersLineLabel = _lineMakerDistanceLabel(dependentsPassengers);

  const _tonsLine = _lineMakerDistance(dependentsTons);
  const _tonsLineLabel = _lineMakerDistanceLabel(dependentsTons);


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
              className={"gridBridgeLine"}
              x1={gridLeft + i * gridCellX}
              x2={gridLeft + i * gridCellX}
              y1={gridBottom}
              y2={_scaleYFrancs(total)}
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
              className={"gridBridgeLine"}
              x1={gridLeft}
              x2={gridRight}
              y1={gridBottom - i * gridCellFrancs}
              y2={gridBottom - i * gridCellFrancs}
              clipPath="url(#polygonMask)"
            />
          );
        })}

        {/* 3. Grid labels*/}
        {/* 1st vertical axis labels */}
        {ticksFrancs.map((tick, i) => {
          return (
            <text
              className={"gridBridgeBlue gridBridgeAxis"}
              key={`blueText--${i}`}
              x={gridLeft - .75 * channelSide}
              y={gridBottom - i * gridCellFrancs + verticalOffset}
            >
              <tspan letterSpacing={-.4} >{tick}</tspan>
            </text>
          );
        })}

        {ticksFrancsLines.map((dependentsTotal, i) => {
          return (
            <line
              key={`horizontal-gridline-dash-left${i}`}
              className={"gridBridgeLine"}
              x1={gridLeft - .6 * channelSide}
              x2={gridLeft}
              y1={gridBottom - i * gridCellFrancs}
              y2={gridBottom - i * gridCellFrancs}
              stroke-dasharray="2, 2"
            />
          );
        })}

        <line
          key={`vertical-centerline-black`}
          className={"gridBridgeLine"}
          x1={gridLeft - .5 * channelSide}
          x2={gridLeft - .5 * channelSide}
          y1={gridBottom}
          y2={gridTop + 35}
        />
        {/* left side vertical line */}
        <line
          key={`vertical-centerline-black`}
          className={"gridBridgeLine"}
          x1={gridLeft - .5 * channelSide}
          x2={gridLeft - .5 * channelSide}
          y1={gridBottom}
          y2={gridTop + 35}
        />
        {/* 2nd vertical tick labels */}
        {ticksLength.map((tick, i) => {
          return (
            <text
              key={`blackText--${i}`}
              className={"gridBridgeBlack gridBridgeAxis"}
              x={gridLeft - .25 * channelSide}
              y={gridBottom - i * gridCellLength + verticalOffset}
            >
              <tspan letterSpacing={-.4} >{tick}</tspan>
            </text>
          );
        })}
        {/* 3rd vertical tick labels */}
        {ticksDistance.map((tick, i) => {
          return (
            <text
              key={`blackText2--${i}`}
              className={"gridBridgeBlack gridBridgeAxis"}
              x={gridRight + .25 * channelSide}
              y={gridBottom - i * gridCellDistance + verticalOffset}
            >
              <tspan letterSpacing={-.4} >{tick}</tspan>
            </text>
          );
        })}
        {/* right side vertical line */}
        <line
          key={`vertical-centerline-black-right`}
          className={"gridBridgeLine"}
          x1={gridRight + .5 * channelSide}
          x2={gridRight + .5 * channelSide}
          y1={gridBottom}
          y2={gridTop + 35}
        />
        {/* 4th vertical axis labels */}
        {ticksPerKm.map((tick, i) => {
          return (
            <text
              key={`PerKmText--${i}`}
              className={"gridBridgeBlack gridBridgeAxis"}
              x={gridRight + .75 * channelSide}
              y={gridBottom - i * gridCellFrancs + verticalOffset}
            >
              <tspan letterSpacing={-.4} >{tick}</tspan>
            </text>
          );
        })}
        {ticksPerKmLines.map((dependents, i) => {
          return (
            <line
              key={`horizontal-gridline-dash-right${i}`}
              className={"gridBridgeLine"}
              x1={gridRight}
              x2={gridRight + .65 * channelSide}
              y1={gridBottom - i * gridCellFrancs}
              y2={gridBottom - i * gridCellFrancs}
              stroke-dasharray="2, 2"
            />
          );
        })}
        {/* horizontal axis labels */}
        {independentsLabel.map((year, i) => {
          const textX = gridLeft + i * gridCellX;
          const textY = gridBottom + 10;

          return (
            <text
              key={`blueText--${i}`}
              className={"gridBridgeBlack gridBridgeAxis"}
              x={gridLeft + i * gridCellX}
              y={gridBottom + 10}
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

        <filter >
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
              key={`labelTextTotal--${i}`} className={"gridBridgeBlue"}
              x={textX} y={textY}
              fontWeight={800}
              textAnchor="start"
              filter={"url(#block)"}
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
              key={`labelTextFast--${i}`} className={"gridBridgeBlue"}
              fontWeight={800} filter={"url(#block)"}
              x={textX} y={textY} textAnchor="start"
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
              key={`labelTextSlow--${i}`} className={"gridBridgeBlue"}
              fontWeight={800} filter={"url(#block)"}
              x={textX} y={textY} textAnchor="start"
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
              key={`labelTextPassengers--${i}`} fontWeight={800} filter={"url(#block)"}
              className={"gridBridgeBlack"} x={textX} y={textY} textAnchor="start"
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
              key={`labelTextTons--${i}`} className={"gridBridgeBlack"}
              fontWeight={800} filter={"url(#block)"} x={textX} y={textY} textAnchor="end"
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
          return (
            <circle
              key={`labelTextTotal--${i}`}
              className={"gridBridgeCurve"}
              r={cR} stroke={colorB}
              cx={gridLeft + i * gridCellX}
              cy={_scaleYFrancs(circle)}
              display={
                i === 6 || i === 14 || i === 17 || i === 20 || i === 29 || i === 32
                  ? "block" : "none"}
            ></circle>
          );
        })}
        {dependentsFast.map((circle, i) => {
          return (
            <circle
              key={`labelTextFast--${i}`}
              className={"gridBridgeCurve"}
              r={cR} stroke={colorB}
              cx={gridLeft + i * gridCellX}
              cy={_scaleYFrancs(circle)}
              display={
                i === 6 || i === 14 || i === 18 || i === 30
                  ? "block" : "none"}
            ></circle>
          );
        })}
        {dependentsSlow.map((circle, i) => {
          return (
            <circle
              key={`labelTextSlow--${i}`}
              className={"gridBridgeCurve"}
              r={cR}
              cx={gridLeft + i * gridCellX}
              cy={_scaleYFrancs(circle)}
              stroke={colorB}
              display={
                i === 6 || i === 20 || i === 32
                  ? "block" : "none"}
            ></circle>
          );
        })}
        {dependentsPassengers.map((circle, i) => {

          return (
            <circle
              key={`labelTextPassengers--${i}`}
              className={"gridBridgeCurve"}
              r={cR}
              cx={gridLeft + i * gridCellX}
              cy={_scaleYDistance(circle)}
              stroke={colorA}
              display={
                i === 30
                  ? "block" : "none"}
            ></circle>
          );
        })}

        {dependentsTons.map((circle, i) => {
          return (
            <circle
              key={`labelTextTons--${i}`}
              className={"gridBridgeCurve"}
              r={cR}
              cx={gridLeft + i * gridCellX}
              cy={_scaleYDistance(circle)}
              stroke={colorA}
              display={
                i === 20 || i === 28
                  ? "block" : "none"}
            ></circle>
          );
        })}

        {/* data curve labels */}
        {typeof _totalLineLabel === "string" && (
          <defs>
            <path
              id="labelPathTotal"
              d={_totalLineLabel}
            />
          </defs>
        )}
        <text >
          <textPath
            className={"gridBridgePath gridBridgeBlue"}
            href="#labelPathTotal"
            startOffset="2%" wordSpacing={8}
          >
            III. Recettes brutes Kilométriques totales
          </textPath>
        </text>
        {typeof _fastLineLabel === "string" && (
          <defs>
            <path
              id="labelPathFast"
              d={_fastLineLabel}
            />
          </defs>
        )}
        <text>
          <textPath
            className={"gridBridgePath gridBridgeBlue"}
            href="#labelPathFast"
            startOffset="2%" wordSpacing={6}
          >
            I. Recettes brutes Kilométriques
          </textPath>
          <textPath
            className={"gridBridgePath gridBridgeBlue"}
            href="#labelPathFast"
            startOffset="32%" letterSpacing={".1em"}
          >
            de Grande Vitesse
          </textPath>
        </text>
        {typeof _slowLineLabel === "string" && (
          <defs>
            <path
              id="labelPathSlow"
              d={_slowLineLabel}
            />
          </defs>
        )}
        <text>
          <textPath
            className={"gridBridgePath gridBridgeBlue"}
            href="#labelPathSlow"
            startOffset="27%" letterSpacing={".1em"}
          >
            II. Recettes brutes Kilométriques
          </textPath>
          <textPath
            className={"gridBridgePath gridBridgeBlue"}
            href="#labelPathSlow"
            startOffset="51%" wordSpacing={2}
          >
            de petite vitesse
          </textPath>
        </text>
        {typeof _passengersLineLabel === "string" && (
          <defs>
            <path
              id="labelPathPassengers"
              d={_passengersLineLabel}
            />
          </defs>
        )}
        <text >
          <textPath
            className={"gridBridgePath gridBridgeBlack"}
            href="#labelPathPassengers"
            startOffset="10%" wordSpacing={12}
          >
            VII. Nombre de voyageurs à toute distance
          </textPath>
        </text>
        {typeof _tonsLineLabel === "string" && (
          <defs>
            <path
              id="labelPathTons"
              d={_tonsLineLabel}
            />
          </defs>
        )}
        <text >
          <textPath
            className={"gridBridgePath gridBridgeBlack"}
            href="#labelPathTons"
            startOffset="15%" wordSpacing={12}
          >
            VIII. Nombre de tons à
          </textPath>
          <textPath
            className={"gridBridgePath gridBridgeBlack"}
            href="#labelPathTons"
            startOffset="47%" wordSpacing={8}
          >
            toute distance
          </textPath>
        </text>
        {/* data curves */}
        {typeof _totalLine === "string" && (
          <path
            key={`total-line`}
            className={"gridBridgeCurve"}
            stroke={colorB}
            d={_totalLine}
          />
        )}
        {typeof _fastLine === "string" && (
          <path
            key={`fast-line`}
            className={"gridBridgeCurve"}
            stroke={colorB}
            d={_fastLine}
            stroke-dasharray="9,6,2,6"
          />
        )}
        {typeof _slowLine === "string" && (
          <path
            key={`slow-line`}
            className={"gridBridgeCurve"}
            stroke={colorB}
            d={_slowLine}
            stroke-dasharray="2,3"
          />
        )}
        {typeof _passengersLine === "string" && (
          <path
            key={`passengers-line`}
            className={"gridBridgeCurve"}
            stroke={colorA}
            d={_passengersLine}
            stroke-dasharray="6,4"
          />
        )}
        {typeof _tonsLine === "string" && (
          <path
            key={`tons-line`}
            stroke={colorA}
            className={"gridBridgeCurve"}
            d={_tonsLine}
          />
        )}
        {/* borders */}
        <rect
          className={"gridBridgeBorder"}
          x={marginLeft} y={gridTop}
          width={gridWidth + 2 * channelSide} height={gridHeight}
        />
        <rect
          className={"gridBridgeBorder"}
          x={gridLeft} y={gridTop}
          width={gridWidth} height={gridHeight}
        />

        {/* Main chart title */}
        <text textAnchor="middle" fill={colorA} x={gridLeft + (gridWidth / 2)} y={.8 * marginTop}>
          <tspan font-size={18} font-weight={800}>Eléments absolus</tspan>
        </text>

        {/* Channel titles */}
        <text className={"gridBridgeAxis"}>
          <tspan x={marginLeft + .5 * channelSide} y={marginTop + 20} >Échelles</tspan>

          <tspan x={marginLeft + .25 * channelSide} y={marginTop + 55} >F</tspan>
          <tspan x={marginLeft + .75 * channelSide} y={marginTop + 55} >km</tspan>

          <tspan x={gridRight + .5 * channelSide} y={marginTop + 12} >Échelles des</tspan>
          <tspan x={gridRight + .5 * channelSide} dy={8} >tonnes et des</tspan>
          <tspan x={gridRight + .5 * channelSide} dy={8} >voyageurs</tspan>
        </text>
        {/* Channel subtitles */}
        <text className={"gridBridgeSubtitle"}>
          <tspan x={marginLeft + .5 * channelSide} y={marginTop + 28}>en milliers</tspan>

          <tspan x={gridRight + .25 * channelSide} y={marginTop + 40}>à toute</tspan>
          <tspan x={gridRight + .25 * channelSide} dy={8} >distance</tspan>
          <tspan x={gridRight + .25 * channelSide} dy={8} >(millions)</tspan>

          <tspan x={gridRight + .75 * channelSide} y={marginTop + 40}>Kilomé-</tspan>
          <tspan x={gridRight + .75 * channelSide} dy={8}>triques</tspan>
          <tspan x={gridRight + .75 * channelSide} dy={8}> (milliards)</tspan>
        </text>

        <line
          className={"gridBridgeLine"}
          x1={marginLeft + .1 * channelSide}
          x2={marginLeft + .4 * channelSide}
          y1={underline} y2={underline}
        />
        <line
          className={"gridBridgeLine"}
          x1={marginLeft + .6 * channelSide}
          x2={marginLeft + .9 * channelSide}
          y1={underline} y2={underline}
        />
        <line
          className={"gridBridgeLine"}
          x1={gridRight + .1 * channelSide}
          x2={gridRight + .4 * channelSide}
          y1={underline} y2={underline}
        />
        <line
          className={"gridBridgeLine"}
          x1={gridRight + .6 * channelSide}
          x2={gridRight + .9 * channelSide}
          y1={underline} y2={underline}
        />

      </svg>
    </div >
  );
}