import { quadNormal, lambert, inkAlphaFromBrightness } from "../shading";
import type { Point2D, Point3D } from "../../core/types";
import type { ShadingConfig } from "../vizConfig";

type Quad = {
  points2D: Point2D[];
  corners3D: Point3D[];
};

type SurfaceLayerProps = {
  quads: Quad[];
  surfaceStyle: {
    fill: string;
    stroke: string;
    strokeWidth: number;
  };
  shading: ShadingConfig;
  lightDir: { x: number; y: number; z: number };
};

export default function SurfaceLayer({
  quads,
  surfaceStyle,
  shading,
  lightDir,
}: SurfaceLayerProps) {
  return (
    <g id="layer-surface">
      {quads.map((quad, i) => {
        const base = (
          <polygon
            points={quad.points2D.map((p) => `${p.x},${p.y}`).join(" ")}
            fill={surfaceStyle.fill}
            stroke={surfaceStyle.stroke}
            strokeWidth={surfaceStyle.strokeWidth}
          />
        );

        if (!shading.enabled) {
          return <g key={`quad-${i}`}>{base}</g>;
        }

        let normal = quadNormal(
          quad.corners3D[0],
          quad.corners3D[1],
          quad.corners3D[3]
        );
        if (normal.z < 0) {
          normal = { x: -normal.x, y: -normal.y, z: -normal.z };
        }
        const brightness = lambert(
          normal,
          lightDir,
          shading.ambient,
          shading.diffuse
        );
        const alpha = inkAlphaFromBrightness({
          brightness,
          ambient: shading.ambient,
          diffuse: shading.diffuse,
          steps: shading.steps,
          inkAlphaMax: shading.inkAlphaMax,
          gamma: shading.gamma,
          shadowBias: shading.shadowBias,
          alphaScale: shading.alphaScale.surface,
        });

        return (
          <g key={`quad-${i}`}>
            {base}
            {alpha > 0 && (
              <polygon
                points={quad.points2D.map((p) => `${p.x},${p.y}`).join(" ")}
                fill={shading.inkColor}
                fillOpacity={Math.min(
                  1,
                  alpha * shading.alphaScale.surface
                )}
                stroke="none"
              />
            )}
          </g>
        );
      })}
    </g>
  );
}
