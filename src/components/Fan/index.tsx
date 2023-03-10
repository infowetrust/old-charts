import { scaleLinear, scaleBand, extent, line } from "d3";
import { PatternLines, PatternCircles } from '@visx/pattern'; //https://airbnb.io/visx/docs/pattern
import _, { uniq, map } from "lodash";

import nicb from "../../data/nicb";
// properties
type Props = {
  barColor?: string
}
export default function Fan(props: Props) {


  /* Inspiration NICB Chart 44-a (1923)
  0. Map data to dimensions
  1. Canvas and grid
  2. Background
  3. Grid lines
  4. Data marks
  5. Data labels
  6. Title and legend   
  */

  {/* 0. Map data to dimensions */ }
  //map data to independent and dependent dimensions
  const independents = _.map(nicb["88percent"], "state");
  const nIndependents = independents.length - 1;

  const dependentsSalary = _.map(nicb["88percent"], "salary");

  const dependentsWage = _.map(nicb["88percent"], "wage");

  {/* 1. Canvas and grid */ }
  const guideColor = "cyan";
  const guideStroke = "1";
  const guideDisplay = "none";

  //establish SVG canvas & grid
  const svgWidth = 900;
  const svgHeight = 500;

  const marginLeft = 50;
  const marginRight = marginLeft;
  const marginTop = marginLeft;
  const marginBottom = 50;
  const bottomChannel = 40;

  const canvasCenter = svgWidth / 2;

  //y-location of horizontal basline
  const baseline = svgHeight - marginBottom - bottomChannel;

  const innerRadius = .5 * (svgHeight - marginTop - marginBottom - bottomChannel);
  const scaleR = 1.5;

  //styling

  const stroke = .8;
  const lineFillDensity = 2;
  const lineFillStroke = .7 * stroke;

  const colorA = "black";
  const colorB = "#F5B901";
  const colorZ = "ivory";

  const valueLabelExtent = 1;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        width={svgWidth}
        height={svgHeight}
      >
        {/* 2. background */}
        <rect
          x="0"
          y="0"
          width={svgWidth}
          height={svgHeight}
          fill={colorZ}
        />

        {/* how to do this? */}
        <style type="text/css" >
        </style>

        {/* 3. Grid lines */}

        {/* 4. Data marks */}
        {/* Pattern fills */}
        <PatternCircles id="fanCircles"
          height={2} width={2}
          fill={colorA}
          stroke={"none"}
          strokeWidth={stroke}
          complement
          radius={.25}
        />
        <PatternLines
          id="linesYellowTight"
          height={lineFillDensity}
          width={lineFillDensity}
          stroke={colorB}
          strokeWidth={lineFillStroke}
          orientation={['diagonal']}
        />
        <PatternLines
          id="linesYellowCross"
          height={lineFillDensity}
          width={lineFillDensity}
          stroke={colorB}
          strokeWidth={lineFillStroke}
          orientation={['diagonalRightToLeft']}
        />

        {/* Grey outer wage wedges */}
        {dependentsWage.map((wage, i) => {
          const angle1 = 2 * Math.PI + (i) * Math.PI / nIndependents;
          const angle2 = 2 * Math.PI + (i + 1) * Math.PI / nIndependents;



          // wedge is created by connecting A to B to C to D to A
          const xA = canvasCenter - innerRadius * Math.cos(angle1);
          const yA = baseline - innerRadius * Math.sin(angle1);

          const xB = canvasCenter - (innerRadius + scaleR * wage) * Math.cos(angle1);
          const yB = baseline - (innerRadius + scaleR * wage) * Math.sin(angle1);

          const xC = canvasCenter - (innerRadius + scaleR * wage) * Math.cos(angle2);
          const yC = baseline - (innerRadius + scaleR * wage) * Math.sin(angle2);

          const xD = canvasCenter - innerRadius * Math.cos(angle2);
          const yD = baseline - innerRadius * Math.sin(angle2);

          const pathWage = `M ${xA} ${yA} L ${xB} ${yB} L ${xC} ${yC}L ${xD} ${yD}Z`;

          // label angles
          const angleT = (angle1 + angle2) / 2;
          const angleTextRad = angleT / (Math.PI / 180);
          const textLegibleAngle = i < 24 ? angleTextRad : angleTextRad + 180;

          // label placement
          const ratioOne = i < 24 ? .6 : .4;
          const ratioTwo = 1 - ratioOne;

          const rayT = innerRadius + scaleR * wage - valueLabelExtent;

          const xBt = canvasCenter - (rayT) * Math.cos(angle1);
          const yBt = baseline - (rayT) * Math.sin(angle1);
          const xCt = canvasCenter - (rayT) * Math.cos(angle2);
          const yCt = baseline - (rayT) * Math.sin(angle2);

          const xT = ratioOne * xBt + ratioTwo * xCt;
          const yT = ratioOne * yBt + ratioTwo * yCt;

          const textLegibleAnchor = i < 24 ? "start" : "end";

          // label styling
          const textColor = wage > 0 ? colorA : colorZ;

          return (
            <g key={`groupWage-${i}`}>
              <path key={`wage-${i}`}
                d={pathWage} stroke={colorA}
                strokeWidth={stroke}
                fill="url('#fanCircles')"
              />
              {/* value label */}
              <text key={`wageLabel-${i}`} x={xT} y={yT} fontFamily="Courier New" fill={textColor} letterSpacing={0} stroke={"none"} fontWeight={700} transform={`rotate(${textLegibleAngle},${xT},${yT})`}>
                <tspan fontSize="9" textAnchor={textLegibleAnchor} >{wage}</tspan>
              </text>
              {/* state label */}

            </g>
          );
        })}
        {/* yellow inner salary wedges */}
        {dependentsSalary.map((salary, i) => {
          const angle1 = 2 * Math.PI + (i) * Math.PI / nIndependents;

          const xA = canvasCenter - innerRadius * Math.cos(angle1);
          const yA = baseline - innerRadius * Math.sin(angle1);

          const xB = canvasCenter - (innerRadius + scaleR * salary) * Math.cos(angle1);
          const yB = baseline - (innerRadius + scaleR * salary) * Math.sin(angle1);

          const angle2 = 2 * Math.PI + (i + 1) * Math.PI / nIndependents;

          const xC = canvasCenter - (innerRadius + scaleR * salary) * Math.cos(angle2);
          const yC = baseline - (innerRadius + scaleR * salary) * Math.sin(angle2);

          const xD = canvasCenter - innerRadius * Math.cos(angle2);
          const yD = baseline - innerRadius * Math.sin(angle2);

          const pathWage = `M ${xA} ${yA} L ${xB} ${yB} L ${xC} ${yC}L ${xD} ${yD}Z`;

          const fillPattern = salary > 39 ? colorB : "url('#linesYellowTight')";
          const fillTop =
            salary > 50 ? "url('#fanCircles')" :
              salary > 39 ? "none" :
                salary > 29 ? "url('#linesYellowCross')" :
                  salary > 0 ? "none" :
                    colorA;

          return (
            <g key={`group-${i}`}>

              <path key={`salaryBase-${i}`}
                d={pathWage} stroke={colorA}
                strokeWidth={stroke} fill={colorZ}
              />
              <path key={`salaryColor-${i}`}
                d={pathWage} stroke={colorA}
                strokeWidth={stroke} fill={fillPattern}
              />
              <path key={`salaryColor-${i}`}
                d={pathWage} stroke={colorA}
                strokeWidth={stroke} fill={fillTop}
              />

            </g>
          );
        })}




        {/* 5. Data labels */}
        {/* State names */}
        {independents.map((state, i) => {
          const angle1 = 2 * Math.PI + (i) * Math.PI / nIndependents;
          const angle2 = 2 * Math.PI + (i + 1) * Math.PI / nIndependents;

          const rayState = i < 48 ? .98 * innerRadius : .9 * innerRadius;
          const xOne = canvasCenter - rayState * Math.cos(angle1);
          const yOne = baseline - rayState * Math.sin(angle1);

          const xTwo = canvasCenter - rayState * Math.cos(angle2);
          const yTwo = baseline - rayState * Math.sin(angle2);

          // label angles
          const angleT = (angle1 + angle2) / 2;
          const angleTextRad = angleT / (Math.PI / 180);
          const textLegibleAngle = i < 24 ? angleTextRad : angleTextRad + 180;

          // label placement
          const ratioOne = i < 24 ? .6 : .4;
          const ratioTwo = 1 - ratioOne;

          const xState = ratioOne * xOne + ratioTwo * xTwo;
          const yState = ratioOne * yOne + ratioTwo * yTwo;

          const textLegibleAnchor = i < 24 ? "start" : "end";
          const upperState = state.toUpperCase();

          return (

            <text key={`stateLabel-${i}`} x={xState} y={yState} fontFamily="Courier New" fill={colorA} letterSpacing={0} stroke={"none"} fontWeight={700} transform={`rotate(${textLegibleAngle},${xState},${yState})`}>
              <tspan fontSize="7" textAnchor={textLegibleAnchor} >{upperState}</tspan>
            </text>



          );
        })}
        {/* 6. Title and legend    */}

      </svg>
    </div >
  );
}
{/* <span>Per Cent of Average Fluctuation in Employmen, by States, 1914 and 1919</span> */ }