export default function Skullbag() {
  /*
  0. Map data to dimensions
  1. Canvas and grid
  2. Background
  3. Grid lines
  4. Data marks
  5. Data labels
  6. Title and legend   
  */

  //styling
  const colorA = "steelblue";
  const colorZ = "linen";

  const stroke = 1.7;

  {/* 0. Map data to dimensions */ }

  {/* 1. Canvas and grid*/ }
  const svgWidth = 800;
  const svgHeight = 1020;

  const canvasWidth = 660;
  const canvasHeight = 870;

  const padding = 16;

  const marginTop = (svgHeight - canvasHeight) / 2;
  const marginBottom = marginTop;
  const marginLeft = (svgWidth - canvasWidth) / 2;
  const marginRight = marginLeft + canvasWidth;

  const canvasBottom = marginTop + canvasHeight;


  const columnTop = 280;

  const columnWidth = (canvasWidth - 2.5 * padding) / 2;
  const columnHeight = 650;

  const columnOneLeft = marginLeft + padding;
  const columnTwoLeft = marginLeft + canvasWidth / 2 + padding / 2;
  const columnTwoRight = marginRight - padding;

  // x={marginLeft + padding} y="250" stroke="none" width="300" height="532"


  const bagGridPath = `
  M ${columnOneLeft} ${columnTop}
h ${columnWidth}
v ${columnHeight * 8 / 11}
h ${-columnWidth * 5.5 / 8}
v ${columnHeight * 1 / 11}
h ${-columnWidth * 2.5 / 8}
Z
  `
  const skullGridPath = `
  M ${columnTwoLeft} ${columnTop}
h ${columnWidth}
v ${columnHeight * 10 / 11}
h ${-columnWidth * 3 / 8}
v ${columnHeight * 1 / 11}
h ${-columnWidth * 5 / 8}
Z
  `
  const skullPath =
    <g fill={"none"} stroke={colorA} strokeWidth={stroke} strokeMiterlimit="10">
      <path d="m16.24.63c3.53,0,7.59.98,9.4,1.76s4.36,2.47,5.63,5.04c.6,1.21,2.84,6.02,2.79,8.47s-2.2,9.35-3.28,12.2c-1.08,2.84-2.25,6.17-2.69,7.3s-3.08,6.86-2.94,7.59,3.09,5.78,2.79,6.42-5.53,6.71-6.56,6.61-2.89-.98-3.28-.98-2.06,1.03-2.89.98-4.75-1.13-5.63-2.06-3.13-2.74-3.04-3.48,2.4-5.19,2.3-6.27-3.77-8.38-4.11-9.16S.82,26.44.77,25.46s-.29-10.86,0-12c.62-2.42,1.91-6.86,3.72-8.72,1.04-1.07,3.69-3.27,4.67-3.56s4.6-.56,7.09-.56Z" />
      <path d="m8.85,44.21c.97.13,4.19,1.13,7.52,1.05s6.61-.71,8.79-2.28" />
      <path d="m11.18,41.54c.26,2.38-.29,6.6-.75,7.15" />
      <path d="m13.83,41.7c.26,2.38-.29,6.6-.75,7.15" />
      <path d="m24.13,47.45c-.95-2.2-1.43-6.29-1.37-7.06" />
      <path d="m16.88,48.85c-.26-2.38-.04-6.12.12-7.15" />
      <path d="m20.42,48.51c.26-2.37-.28-5.52-.59-6.97" />
      <path d="m7.92,20.41c1.4,0,3.33,1.73,3.33,4.15,0,1.67-.73,3.49-3.33,3.49-2.22,0-3.34-2.09-3.33-3.82,0-1.12,1.2-3.82,3.33-3.82Z" />
      <path d="m24.56,18.94c1.4,0,3.16,1.68,3.16,4.1,0,1.67-1.27,4.49-3.16,4.49-1.04,0-3.18-2.13-3.33-3.85-.19-2.17,1.2-4.74,3.33-4.74Z" />
      <path d="m19.08,30.89s-.69-1.67-2.97-1.67c-1.67,0-3.75,1.17-3.75,1.99,0,1.24,1.47,1.86,3.36,1.93s3.36.22,3.36,1.7c0,1.31-1.5,2.51-2.91,2.64s-3.33-.85-3.33-.85" />
      <line x1="16.98" y1="27.53" x2="16.98" y2="39.49" />
      <line x1="14.97" y1="27.4" x2="14.97" y2="39.62" />
    </g>;

  // draw chart
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={svgWidth} height={svgHeight}>
        <defs>
          <pattern id="Star" x="0" y="0" width="1" height="1" >
            <polygon fill={colorZ} stroke="none" points="14.5 21.34 5.54 27.58 8.7 17.13 0 10.53 10.92 10.31 14.5 0 18.08 10.31 29 10.53 20.3 17.13 23.46 27.58 14.5 21.34" />
          </pattern>
          <pattern id="Skull" x="0" y="0" width=".125" height=".091" >
            {skullPath}
          </pattern>
          <pattern id="Lluks" x="0" y="0" width=".125" height=".111" >
            <g transform="rotate(180) translate(-36 -58)">
              {skullPath}
            </g>
          </pattern>
        </defs>

        {/* 2. Background */}
        <rect x="0" y="0" width={svgWidth} height={svgHeight} fill={colorA} />
        <rect x={marginLeft} y={marginTop} width={canvasWidth} height={canvasHeight} fill={colorZ} />

        {/* stars */}
        <g fill="url(#Star)" >
          <rect x="18" y="18" width={marginLeft / 2} height={marginLeft / 2} />
          <rect x={marginRight + 18} y="18" width={marginLeft / 2} height={marginLeft / 2} />
          <rect x={18} y={canvasBottom + 24} width={marginLeft / 2} height={marginLeft / 2} />
          <rect x={marginRight + 18} y={canvasBottom + 24} width={marginLeft / 2} height={marginLeft / 2} />
        </g>

        {/* 3. Grid lines */}

        {/* 4. Data marks*/}
        {/* <rect fill="url(#Bag)" x={marginLeft + padding} y="250" stroke="none" width="300" height="532" /> */}
        <path fill="url(#Lluks)" d={bagGridPath} />
        <path fill="url(#Skull)" d={skullGridPath} />

        {/* 5. Data labels*/}

        {/* 6. Title and legend*/}
        <text className={"futuraPt"} fill={colorA} letterSpacing={1}>
          <tspan fontSize="28" x={svgWidth / 2} y={marginTop + 60} textAnchor="middle" >{"PROFITS AND DEATHS IN THE WORLD WAR"}</tspan>
        </text>

        <text className={"futuraPt"} fill={colorA} letterSpacing={1}  >
          <tspan fontSize="21" x={marginLeft + padding} y={marginTop + 120} textAnchor="start" >{"PROFITS OF"}</tspan>
          <tspan fontSize="21" x={svgWidth / 2 - padding / 2} dy={20} textAnchor="end" >{"1 MUNITIONS MAKER"}</tspan>
          <tspan fontSize="21" x={marginRight - padding} y={marginTop + 120} textAnchor="END" >{"TOTAL WAR DEAD"}</tspan>
        </text>

        <text className={"futuraPt"} fill={colorA} letterSpacing={.25}  >
          <tspan fontSize="21" fontWeight="600" x={columnOneLeft} y={marginTop + 190} textAnchor="start" >{"E"}</tspan>
          <tspan fontSize="15" fontWeight="700" textAnchor="start" >{"ACH "}</tspan>
          <tspan fontSize="21" fontWeight="600" textAnchor="start" >{"F"}</tspan>
          <tspan fontSize="15" fontWeight="700" textAnchor="start" >{"IGURE "}</tspan>
          <tspan fontSize="21" fontWeight="600" textAnchor="start" >{"- $4,000,000"}</tspan>
        </text>

        <text className={"futuraPt"} fill={colorA} letterSpacing={.25}  >
          <tspan fontSize="21" fontWeight="600" x={columnTwoRight} y={marginTop + 190} textAnchor="end" >{"E"}</tspan>
          <tspan fontSize="15" fontWeight="700" textAnchor="end" >{"ACH "}</tspan>
          <tspan fontSize="21" fontWeight="600" textAnchor="end" >{"F"}</tspan>
          <tspan fontSize="15" fontWeight="700" textAnchor="end" >{"IGURE "}</tspan>
          <tspan fontSize="21" fontWeight="600" textAnchor="end" >{"- 100,000 L"}</tspan>
          <tspan fontSize="15" fontWeight="700" textAnchor="end" >{"IVES"}</tspan>
        </text>

      </svg>
    </div >
  );
}