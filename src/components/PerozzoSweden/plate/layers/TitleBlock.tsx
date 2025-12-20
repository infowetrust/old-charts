type TitleBlockProps = {
  x: number;
  y: number;
  style: {
    text: string;
  };
  legend: {
    ages: string;
    values: string;
    cohorts: string;
    years: string;
    thin: number;
    thick: number;
  };
};

const block = {
  width: 140,
  gap: 5,
  fontFamily: "Garamond, serif",
  fontWeight: "normal",
  sizeTiny: 8,
  sizeSmall: 10,
  sizeLarge: 21,
  lines: [
    "NUMBER of", "",
    "MALES BORN ALIVE", "",
    "and SURVIVORS BY AGE", "",
    "from CENSUS RESULTS in",
  ],
  bigWord: "SWEDEN",
  years: "1750–1875",
};

export const TITLE_BLOCK_WIDTH = block.width;
export const TITLE_BLOCK_HEIGHT =
  block.lines.length * block.gap + block.sizeLarge + block.gap * 6 + block.sizeSmall;

export default function TitleBlock({
  x,
  y,
  style,
  legend,
}: TitleBlockProps) {
  const legendItems = [
    { label: "Census", color: legend.years },
    { label: "Age", color: legend.ages },
    { label: "Cohort", color: legend.cohorts },
    { label: "Isoline", color: legend.values },
  ];

  const itemWidth = block.width / legendItems.length;
  const legendThin = legend.thin * 2;
  const legendThick = legend.thick * 2.5;
  const lineLength = itemWidth * 0.7;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <g
        fill={style.text}
        fontFamily={block.fontFamily}
        fontWeight={block.fontWeight}
        textAnchor="middle"
      >
        {block.lines.map((line, idx) => (
          <text
            key={`line-${idx}`}
            x={block.width / 2}
            y={idx * block.gap}
            fontSize={block.sizeSmall}
          >
            {line}
          </text>
        ))}
        <text
          x={block.width / 2}
          y={block.lines.length * block.gap + block.sizeLarge - block.gap}
          fontSize={block.sizeLarge}
          letterSpacing={2}
        >
          {block.bigWord}
        </text>
        <text
          x={block.width / 2}
          y={block.lines.length * block.gap + block.sizeLarge + block.gap * 2}
          fontSize={block.sizeTiny} fontWeight={"bold"}
        >
          {block.years}
        </text>
      </g>

      <g transform={`translate(0, ${block.lines.length * block.gap + block.sizeLarge + block.gap * 5
        })`}>
        {legendItems.map((item, idx) => (
          <g
            key={item.label}
            transform={`translate(${idx * itemWidth}, 0)`}
            fontFamily={block.fontFamily}
            fontWeight={block.fontWeight}
            textAnchor="middle"
          >
            <line
              x1={itemWidth / 2 - lineLength / 2}
              y1={0}
              x2={itemWidth / 2 + lineLength / 2}
              y2={0}
              stroke={item.color}
              strokeWidth={legendThick}
              strokeLinecap="butt"
            />
            <line
              x1={itemWidth / 2 - lineLength / 2}
              y1={4}
              x2={itemWidth / 2 + lineLength / 2}
              y2={4}
              stroke={item.color}
              strokeWidth={legendThin}
              strokeLinecap="butt"
            />
            <text
              x={itemWidth / 2}
              y={15}
              fontSize={block.sizeTiny}
              fill={style.text}
            >
              {item.label}
            </text>
          </g>
        ))}
      </g>
    </g >
  );
}
