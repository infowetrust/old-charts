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

  const padding = 15;

  const marginTop = (svgHeight - canvasHeight) / 2;
  const marginBottom = marginTop;
  const marginLeft = (svgWidth - canvasWidth) / 2;
  const marginRight = marginLeft + canvasWidth;

  const gridLeft = marginLeft + padding;
  const gridTop = 260;

  // x={marginLeft + padding} y="250" stroke="none" width="300" height="532"


  const bagPath = `
  M ${marginLeft + padding} ${gridTop}
h 300
v 473
h -206.25
v 59
h -93.75
Z
  `



  // draw chart
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={svgWidth} height={svgHeight}>
        <defs>
          <pattern id="Star" x="0" y="0" width="1" height="1" >
            <polygon fill={colorZ} stroke="none" points="14.5 21.34 5.54 27.58 8.7 17.13 0 10.53 10.92 10.31 14.5 0 18.08 10.31 29 10.53 20.3 17.13 23.46 27.58 14.5 21.34" />
          </pattern>
          <pattern id="Skull" x="0" y="0" width=".125" height=".091" >
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
            </g>
          </pattern>

          <pattern id="Bag" x="0" y="0" width=".125" height=".1115" >
            <g fill={"none"} stroke={colorA} strokeWidth={stroke} strokeMiterlimit="10">
              <path d="m18.45,56.02c-3.53,0-7.59-.98-9.4-1.76s-4.36-2.47-5.63-5.04c-.6-1.21-2.84-6.02-2.79-8.47s2.2-9.35,3.28-12.2,2.25-6.17,2.69-7.3,3.08-6.86,2.94-7.59-3.09-5.78-2.79-6.42S12.28.53,13.31.63s2.89.98,3.28.98,2.06-1.03,2.89-.98,4.75,1.13,5.63,2.06,3.13,2.74,3.04,3.48-2.4,5.19-2.3,6.27,3.77,8.38,4.11,9.16,3.92,8.62,3.97,9.6.29,10.86,0,12c-.62,2.42-1.91,6.86-3.72,8.72-1.04,1.07-3.69,3.27-4.67,3.56s-4.6.56-7.09.56Z" />
              <path d="m25.85,12.43c-.97-.13-4.19-1.13-7.52-1.05s-6.61.71-8.79,2.28" />
              <path d="m23.51,15.11c-.26-2.38.29-6.6.75-7.15" />
              <path d="m20.87,14.95c-.26-2.38.29-6.6.75-7.15" />
              <path d="m10.57,9.2c.95,2.2,1.43,6.29,1.37,7.06" />
              <path d="m17.82,7.8c.26,2.38.04,6.12-.12,7.15" />
              <path d="m14.27,8.14c-.26,2.37.28,5.52.59,6.97" />
              <path d="m26.78,36.23c-1.4,0-3.33-1.73-3.33-4.15,0-1.67.73-3.49,3.33-3.49,2.22,0,3.34,2.09,3.33,3.82,0,1.12-1.2,3.82-3.33,3.82Z" />
              <path d="m10.14,37.71c-1.4,0-3.16-1.68-3.16-4.1,0-1.67,1.27-4.49,3.16-4.49,1.04,0,3.18,2.13,3.33,3.85.19,2.17-1.2,4.74-3.33,4.74Z" />
              <path d="m15.61,25.75s.69,1.67,2.97,1.67c1.67,0,3.75-1.17,3.75-1.99,0-1.24-1.47-1.86-3.36-1.93s-3.36-.22-3.36-1.7c0-1.31,1.5-2.51,2.91-2.64s3.33.85,3.33.85" />
              <line x1="17.72" y1="29.12" x2="17.72" y2="17.16" />
              <line x1="19.73" y1="29.25" x2="19.73" y2="17.02" />
            </g>
          </pattern>


        </defs>

        {/* 2. Background */}
        <rect x="0" y="0" width={svgWidth} height={svgHeight} fill={colorA} stroke={"none"} />
        <rect x={marginLeft} y={marginTop} width={canvasWidth} height={canvasHeight} fill={colorZ} />

        {/* stars */}
        <rect x="18" y="18" width={marginLeft / 2} height={marginLeft / 2} fill="url(#Star)" />
        <rect x={marginRight + 18} y="18" width={marginLeft / 2} height={marginLeft / 2} fill="url(#Star)" />


        {/* 3. Grid lines */}

        {/* 4. Data marks*/}
        {/* <rect fill="url(#Bag)" x={marginLeft + padding} y="250" stroke="none" width="300" height="532" /> */}
        <path fill="url(#Bag)" d={bagPath} />
        <rect fill="url(#Skull)" x={svgWidth / 2 + padding} y={gridTop} stroke="none" width="300" height="650" />

        {/* 5. Data labels*/}

        {/* 6. Title and legend*/}
        <text className={"futuraPt"} x={svgWidth / 2} y={marginTop + 60} letterSpacing={1} fill={colorA}>
          <tspan fontSize="28" textAnchor="middle" >{"PROFITS AND DEATHS IN THE WORLD WAR"}</tspan>

          <tspan fontSize="21" x={marginLeft + padding} y={marginTop + 120} textAnchor="start" >{"PROFITS OF"}</tspan>
          <tspan fontSize="21" x={svgWidth / 2 - padding} dy={20} textAnchor="end" >{"1 MUNITIONS MAKER"}</tspan>

          <tspan fontSize="21" x={marginRight - padding} y={marginTop + 120} textAnchor="END" >{"TOTAL WAR DEAD"}</tspan>
        </text>

      </svg>
    </div >
  );
}