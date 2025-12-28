type InteractionLayerProps = {
  hover: { x: number; y: number } | null;
  accentColor: string;
  radius: number;
  strokeWidth: number;
};

export default function InteractionLayer({
  hover,
  accentColor,
  radius,
  strokeWidth,
}: InteractionLayerProps) {
  if (!hover) {
    return <g id="layer-interaction" />;
  }
  return (
    <g id="layer-interaction">
      <circle
        cx={hover.x}
        cy={hover.y}
        r={radius}
        fill={"none"}
        stroke={accentColor}
        strokeWidth={strokeWidth}
        opacity={1}
        pointerEvents="none"
      />
    </g>
  );
}
