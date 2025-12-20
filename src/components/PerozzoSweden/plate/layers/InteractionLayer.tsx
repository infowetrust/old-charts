type InteractionLayerProps = {
  hover: { x: number; y: number } | null;
  accentColor: string;
  radius: number;
};

export default function InteractionLayer({
  hover,
  accentColor,
  radius,
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
        fill={accentColor}
        opacity={1}
        pointerEvents="none"
      />
    </g>
  );
}
