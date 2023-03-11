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
  const nIndependents = independents.length;

  const dependentsSalary = _.map(nicb["88percent"], "salary");

  const dependentsWage = _.map(nicb["88percent"], "wage");

  {/* 1. Canvas and grid */ }
  const guideColor = "cyan";
  const guideStroke = "1";
  const guideDisplay = "none";

  //establish SVG canvas & grid
  const svgWidth = 900;
  const svgHeight = 550;

  const marginLeft = 50;
  const marginRight = marginLeft;
  const marginTop = 100;
  const marginBottom = 50;
  const bottomChannel = 40;

  const canvasCenter = svgWidth / 2;

  //y-location of horizontal basline
  const baseline = svgHeight - marginBottom - bottomChannel;

  const innerRadius = .5 * (svgHeight - marginTop - marginBottom - bottomChannel);
  const scaleR = 1.5;

  //avg arc lines
  const avgWage = 100;
  const avgSalary = 39;

  const radiusAvgWage = innerRadius + scaleR * avgWage;
  const radiusAvgSalary = innerRadius + scaleR * avgSalary;

  const pathAvgWage = `M ${canvasCenter - radiusAvgWage} ${baseline} A ${radiusAvgWage} ${radiusAvgWage}, 0, 0, 1, ${canvasCenter + radiusAvgWage} ${baseline} `;

  const pathAvgSalary = `M ${canvasCenter - radiusAvgSalary} ${baseline} A ${radiusAvgSalary} ${radiusAvgSalary}, 0, 0, 1, ${canvasCenter + radiusAvgSalary} ${baseline} `;

  //arc labels
  // - Wage Earners
  const arcAngleWage = 7; //degrees

  const arcValueWage = 60;
  const arcHeightWage = 3;

  const arcValueWageTop = arcValueWage + arcHeightWage;
  const arcValueWageBottom = arcValueWage - arcHeightWage;

  const arcWageTopRadius = innerRadius + scaleR * arcValueWageTop;
  const arcWageBottomRadius = innerRadius + scaleR * arcValueWageBottom;

  const angleWage1 = Math.PI / 2 + (arcAngleWage) * Math.PI / 180;
  const angleWage2 = Math.PI / 2 - (arcAngleWage) * Math.PI / 180;

  const xArcWageA = canvasCenter - (innerRadius + scaleR * arcValueWageBottom) * Math.cos(angleWage2);
  const yArcWageA = baseline - (innerRadius + scaleR * arcValueWageBottom) * Math.sin(angleWage2);
  const xArcWageB = canvasCenter - (innerRadius + scaleR * arcValueWageTop) * Math.cos(angleWage2);
  const yArcWageB = baseline - (innerRadius + scaleR * arcValueWageTop) * Math.sin(angleWage2);
  const xArcWageC = canvasCenter - (innerRadius + scaleR * arcValueWageTop) * Math.cos(angleWage1);
  const yArcWageC = baseline - (innerRadius + scaleR * arcValueWageTop) * Math.sin(angleWage1);
  const xArcWageD = canvasCenter - (innerRadius + scaleR * arcValueWageBottom) * Math.cos(angleWage1);
  const yArcWageD = baseline - (innerRadius + scaleR * arcValueWageBottom) * Math.sin(angleWage1);

  const pathWageTextBackground = `
  M ${xArcWageA} ${yArcWageA} 
  L ${xArcWageB} ${yArcWageB} 
  A ${arcWageTopRadius} ${arcWageTopRadius}, 0, 0, 1, ${xArcWageC} ${yArcWageC} 
  L ${xArcWageD} ${yArcWageD}
  A ${arcWageBottomRadius} ${arcWageBottomRadius}, 0, 0, 0, ${xArcWageA} ${yArcWageA}
  `;
  // - - Wage Earners text path
  const arcTextOffset = 1.5;
  const arcValueWageText = arcValueWage - arcHeightWage + arcTextOffset;
  const radiusArcValueWageText = innerRadius + scaleR * arcValueWageText

  const xArcWageTextA = canvasCenter - (innerRadius + scaleR * arcValueWageText) * Math.cos(angleWage2);
  const yArcWageTextA = baseline - (innerRadius + scaleR * arcValueWageText) * Math.sin(angleWage2);
  const xArcWageTextD = canvasCenter - (innerRadius + scaleR * arcValueWageText) * Math.cos(angleWage1);
  const yArcWageTextD = baseline - (innerRadius + scaleR * arcValueWageText) * Math.sin(angleWage1);

  const pathWageText = `M ${xArcWageTextA} ${yArcWageTextA} A ${radiusArcValueWageText} ${radiusArcValueWageText}, 0, 0, 1, ${xArcWageTextD} ${yArcWageTextD} `;


  // - Salaried Employees
  const arcAngleSalary = 22; //degrees

  const arcValueSalary = 17;
  const arcHeightSalary = 3;

  const arcValueSalaryTop = arcValueSalary + arcHeightSalary;
  const arcValueSalaryBottom = arcValueSalary - arcHeightSalary;

  const arcSalaryTopRadius = innerRadius + scaleR * arcValueSalaryTop;
  const arcSalaryBottomRadius = innerRadius + scaleR * arcValueSalaryBottom;

  const angleSalary1 = Math.PI / 2 + (arcAngleSalary) * Math.PI / 180;
  const angleSalary2 = Math.PI / 2 - (arcAngleSalary) * Math.PI / 180;

  const xArcSalaryA = canvasCenter - (innerRadius + scaleR * arcValueSalaryBottom) * Math.cos(angleSalary2);
  const yArcSalaryA = baseline - (innerRadius + scaleR * arcValueSalaryBottom) * Math.sin(angleSalary2);
  const xArcSalaryB = canvasCenter - (innerRadius + scaleR * arcValueSalaryTop) * Math.cos(angleSalary2);
  const yArcSalaryB = baseline - (innerRadius + scaleR * arcValueSalaryTop) * Math.sin(angleSalary2);
  const xArcSalaryC = canvasCenter - (innerRadius + scaleR * arcValueSalaryTop) * Math.cos(angleSalary1);
  const yArcSalaryC = baseline - (innerRadius + scaleR * arcValueSalaryTop) * Math.sin(angleSalary1);
  const xArcSalaryD = canvasCenter - (innerRadius + scaleR * arcValueSalaryBottom) * Math.cos(angleSalary1);
  const yArcSalaryD = baseline - (innerRadius + scaleR * arcValueSalaryBottom) * Math.sin(angleSalary1);

  const pathSalaryTextBackground = `
  M ${xArcSalaryA} ${yArcSalaryA} 
  L ${xArcSalaryB} ${yArcSalaryB} 
  A ${arcSalaryTopRadius} ${arcSalaryTopRadius}, 0, 0, 1, ${xArcSalaryC} ${yArcSalaryC} 
  L ${xArcSalaryD} ${yArcSalaryD}
  A ${arcSalaryBottomRadius} ${arcSalaryBottomRadius}, 0, 0, 0, ${xArcSalaryA} ${yArcSalaryA}
  `;
  // - - Salary Earners text path
  const arcValueSalaryText = arcValueSalary - arcHeightSalary + arcTextOffset;
  const radiusArcValueSalaryText = innerRadius + scaleR * arcValueSalaryText

  const xArcSalaryTextA = canvasCenter - (innerRadius + scaleR * arcValueSalaryText) * Math.cos(angleSalary2);
  const yArcSalaryTextA = baseline - (innerRadius + scaleR * arcValueSalaryText) * Math.sin(angleSalary2);
  const xArcSalaryTextD = canvasCenter - (innerRadius + scaleR * arcValueSalaryText) * Math.cos(angleSalary1);
  const yArcSalaryTextD = baseline - (innerRadius + scaleR * arcValueSalaryText) * Math.sin(angleSalary1);

  const pathSalaryText = `M ${xArcSalaryTextA} ${yArcSalaryTextA} A ${radiusArcValueSalaryText} ${radiusArcValueSalaryText}, 0, 0, 1, ${xArcSalaryTextD} ${yArcSalaryTextD} `;



  //styling

  const stroke = .8;
  const arcStroke = 2.5 * stroke;

  const lineFillDensity = 2;
  const lineFillStroke = .7 * stroke;

  const colorA = getComputedStyle(document.documentElement).getPropertyValue('--cheyssonBlack');
  const colorB = "#F5B901";
  const colorZ = "ivory";

  const fontMini = 5;
  const fontSmall = 7;
  const fontLabel = 8;
  const fontGreat = 8.5;

  const baselineText = baseline + 8;
  const fontDy = 6;
  const fontDyTight = 4;


  //indents data value labels from mark extent
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

          const pathWage = `M ${xA} ${yA} L ${xB} ${yB} L ${xC} ${yC} L ${xD} ${yD}Z`;

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
              <mask id="maskWage">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <path d={pathWageTextBackground} fill={"black"} stroke={"none"} strokeWidth={0} />
              </mask>
              <path key={`wage-${i}`}
                d={pathWage} stroke={"none"}
                fill="url('#fanCircles')"
              />
              <path key={`wageOutline-${i}`}
                d={pathWage} stroke={colorA}
                strokeWidth={stroke}
                fill="none"
                mask="url(#maskWage)"
              />

              {/* value label */}
              <text key={`wageLabel-${i}`} x={xT} y={yT} className={"nicb"} fill={colorA} letterSpacing={0} stroke={"none"} fontWeight={700} transform={`rotate(${textLegibleAngle},${xT},${yT})`}>
                <tspan fontSize={fontLabel} textAnchor={textLegibleAnchor} >{wage}</tspan>
              </text>
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

          // label angles
          const angleT = (angle1 + angle2) / 2;
          const angleTextRad = angleT / (Math.PI / 180);
          const textLegibleAngle = i < 24 ? angleTextRad : angleTextRad + 180;

          // label placement
          //center label between two wedge sides
          const ratioOne = i < 24 ? .6 : .35;
          const ratioTwo = 1 - ratioOne;

          const rayT = salary > 0 ? innerRadius + scaleR * salary - valueLabelExtent :
            innerRadius - valueLabelExtent;

          const xBt = canvasCenter - (rayT) * Math.cos(angle1);
          const yBt = baseline - (rayT) * Math.sin(angle1);
          const xCt = canvasCenter - (rayT) * Math.cos(angle2);
          const yCt = baseline - (rayT) * Math.sin(angle2);

          const xT = ratioOne * xBt + ratioTwo * xCt;
          const yT = ratioOne * yBt + ratioTwo * yCt;

          const textLegibleAnchor = i < 24 ? "start" : "end";

          // label styling
          const textColor = salary > 0 ? colorA : colorZ;

          return (
            <g key={`group-${i}`}>
              <mask id="maskSalary">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <path d={pathSalaryTextBackground} fill={"black"} stroke={"none"} strokeWidth={0} />
              </mask>
              <path key={`salaryBase-${i}`}
                d={pathWage} stroke={"none"}
                strokeWidth={0} fill={colorZ}
              />
              <path key={`salaryColor-${i}`}
                d={pathWage} stroke={"none"}
                strokeWidth={0} fill={fillPattern}
              />
              <path key={`salaryTexture-${i}`}
                d={pathWage} stroke={"none"}
                strokeWidth={0} fill={fillTop}
              />
              <path key={`salaryOutline-${i}`}
                d={pathWage} stroke={colorA}
                strokeWidth={stroke} fill={"none"}
                mask="url(#maskSalary)"
              />
              <text key={`salaryLabel-${i}`} x={xT} y={yT} className={"nicb"} fill={textColor} letterSpacing={0} stroke={"none"} fontWeight={700} transform={`rotate(${textLegibleAngle},${xT},${yT})`}>
                <tspan fontSize={fontLabel} textAnchor={textLegibleAnchor} >{Math.abs(salary)}</tspan>
              </text>

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

            <text key={`stateLabel-${i}`} x={xState} y={yState} className={"nicb"} letterSpacing={0} stroke={"none"} fontWeight={700} transform={`rotate(${textLegibleAngle},${xState},${yState})`}>
              <tspan fontSize={fontSmall} textAnchor={textLegibleAnchor} >{upperState}</tspan>
            </text>



          );
        })}
        {/* Average arc lines */}
        {/* https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#arcs */}

        {/* <path key={`wageAvg`} d='A 40 40, 1, 1, 1, 80 80' stroke="black" fill="none" strokeWidth="10" /> */}
        <path key={`wageAvg`} d={pathAvgWage} fill="none" stroke={colorA} strokeWidth={arcStroke} />
        <path key={`salaryAvg`} d={pathAvgSalary} fill="none" stroke={colorB} strokeWidth={arcStroke} />

        {/* 6. Title and legend    */}
        {/* Class arc'd titles */}
        <g key={`arcTextGroup`}>
          <path id={"wageTextPath"} key={`wageText`} d={pathWageText} fill={"none"} stroke={"none"} strokeWidth={0} />
          <path id={"salaryTextPath"} key={`salaryText`} d={pathSalaryText} fill={"none"} stroke={"none"} strokeWidth={0} />
          <text className={"nicb"}>
            <textPath href="#wageTextPath" startOffset="50%" textAnchor={"middle"} fontSize={fontGreat} fontWeight={700}>WAGE EARNERS</textPath>
            <textPath href="#salaryTextPath" startOffset="50%" textAnchor={"middle"} fontSize={fontGreat} fontWeight={700}>SUBORDINATE SALARIED EMPLOYEES</textPath>
          </text>
        </g>

        {/* arc titles */}
        <text className={"nicb"} textAnchor="middle" fontWeight={700} letterSpacing={-.5} fill={colorA}>

          <tspan x={canvasCenter - radiusAvgWage} y={baselineText} fontSize={fontLabel}>100%</tspan>
          <tspan x={canvasCenter - radiusAvgWage} dy={fontDyTight} fontSize={fontMini}>AVERAGE INCREASE</tspan>
          <tspan x={canvasCenter - radiusAvgWage} dy={fontDyTight} fontSize={fontMini}>UNITED STATES</tspan>
          <tspan x={canvasCenter - radiusAvgWage} dy={fontDy} fontSize={fontSmall}>WAGE EARNERS</tspan>

          <tspan x={canvasCenter - radiusAvgSalary} y={baselineText} fontSize={fontLabel}>39%</tspan>
          <tspan x={canvasCenter - radiusAvgSalary} dy={fontDyTight} fontSize={fontMini}>AVERAGE INCREASE</tspan>
          <tspan x={canvasCenter - radiusAvgSalary} dy={fontDyTight} fontSize={fontMini}>UNITED STATES</tspan>
          <tspan x={canvasCenter - radiusAvgSalary} dy={fontDy} fontSize={fontSmall}>SUBORDINATE</tspan>
          <tspan x={canvasCenter - radiusAvgSalary} dy={fontDy} fontSize={fontSmall}>SALARIED EMPLOYEES</tspan>

          <tspan x={canvasCenter - innerRadius} y={baselineText} fontSize={fontLabel}>D</tspan>
          <tspan x={canvasCenter + innerRadius - 14} y={baseline + 7} fontSize={5}>DECREASE</tspan>
          <tspan x={canvasCenter + innerRadius} y={baselineText} fontSize={fontLabel}>U</tspan>

          <tspan x={canvasCenter + radiusAvgWage} y={baselineText} fontSize={fontLabel}>100%</tspan>
          <tspan x={canvasCenter + radiusAvgWage} dy={fontDyTight} fontSize={fontMini}>AVERAGE INCREASE</tspan>
          <tspan x={canvasCenter + radiusAvgWage} dy={fontDyTight} fontSize={fontMini} >UNITED STATES</tspan>
          <tspan x={canvasCenter + radiusAvgWage} dy={fontDy} fontSize={fontSmall}>WAGE EARNERS</tspan>
          <tspan x={canvasCenter + radiusAvgWage} dy={fontDy} fontSize={fontSmall}>SALARIED EMPLOYEES</tspan>

          <tspan x={canvasCenter + radiusAvgSalary} y={baselineText} fontSize={fontLabel}>39%</tspan>
          <tspan x={canvasCenter + radiusAvgSalary} dy={fontDyTight} fontSize={fontMini}>AVERAGE INCREASE</tspan>
          <tspan x={canvasCenter + radiusAvgSalary} dy={fontDyTight} fontSize={fontMini}>UNITED STATES</tspan>
          <tspan x={canvasCenter + radiusAvgSalary} dy={fontDy} fontSize={fontSmall}>SUBORDINATE</tspan>
          <tspan x={canvasCenter + radiusAvgSalary} dy={fontDy} fontSize={fontSmall}>SALARIED EMPLOYEES</tspan>
        </text>

        {/* Chart title */}
        <text className={"nicb"} textAnchor="start" fontWeight={700} letterSpacing={0} fill={colorA}>

          <tspan x={marginLeft} y={50} fontSize={14}>
            Chart 44-a: Per Cent of Increase in Average Cost of Service per Employee-month, Wage Earners
          </tspan>
          <tspan x={marginLeft + 120} dy={16} fontSize={14}>
            and Suboridante Salaried Employees in Manufacturing Industries, by States,
          </tspan>
          <tspan x={marginLeft + 120} dy={16} fontSize={14}>
            1914 to 1919.
          </tspan>
        </text>

      </svg>
    </div >
  );
}
{/* <span>Per Cent of Average Fluctuation in Employmen, by States, 1914 and 1919</span> */ }