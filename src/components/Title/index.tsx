export default function Title() {

  const svgWidth = 800;
  const svgHeight = 300;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={svgWidth} height={svgHeight}>
        <text className={"title4"}>
          <tspan fill="blue" x={svgWidth / 2} y={svgHeight / 2}>CHARTS!</tspan>
          <tspan fill="red" x={svgWidth / 2 + 1} y={svgHeight / 2 + 1} dy={1}>CHARTS!</tspan>
          <tspan fill="yellow" x={svgWidth / 2 - 1} y={svgHeight / 2 + 1} dy={1}>CHARTS!</tspan>
        </text>

      </svg>
    </div >
  );
}