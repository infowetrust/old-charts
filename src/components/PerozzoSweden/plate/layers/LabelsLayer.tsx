import TitleBlock from "./TitleBlock";
import AgeLabels from "./AgeLabels";
import ValueIsolineLabels from "./ValueIsolineLabels";
import YearLabels from "./YearLabels";
import type { Frame3D } from "../../core/frame3d";
import type { ProjectionOptions } from "../../core/geometry";
import type { AxisLabelStyle, AxisLabelLayout } from "../vizConfig";

type LabelsLayerProps = {
  frame: Frame3D;
  projection: ProjectionOptions;
  years: number[];
  minYearExt: number;
  maxYearExt: number;
  axisLabelStyle: AxisLabelStyle;
  axisLabelLayout: AxisLabelLayout;
  vizStyle: {
    ages: { stroke: string };
    values: { stroke: string };
    years: { stroke: string };
  };
  titleProps: {
    x: number;
    y: number;
    style: { text: string };
    legend: {
      ages: string;
      values: string;
      cohorts: string;
      years: string;
      thin: number;
      thick: number;
    };
  };
  topValueByYear: Record<number, number>;
};

export default function LabelsLayer({
  frame,
  projection,
  years,
  minYearExt,
  maxYearExt,
  axisLabelStyle,
  axisLabelLayout,
  vizStyle,
  titleProps,
  topValueByYear,
}: LabelsLayerProps) {
  return (
    <g id="layer-labels">
      <AgeLabels
        frame={frame}
        projection={projection}
        minYearExt={minYearExt}
        maxYearExt={maxYearExt}
        side={axisLabelLayout.side}
        tickLen={axisLabelLayout.tickLen}
        textOffset={axisLabelLayout.textOffset}
        style={{
          ...axisLabelStyle,
          color: vizStyle.ages.stroke,
        }}
      />
      <ValueIsolineLabels
        frame={frame}
        projection={projection}
        minYearExt={minYearExt}
        maxYearExt={maxYearExt}
        side={axisLabelLayout.side}
        tickLen={axisLabelLayout.tickLen}
        textOffset={axisLabelLayout.textOffset}
        style={{
          ...axisLabelStyle,
          color: vizStyle.values.stroke,
        }}
      />
      <YearLabels
        frame={frame}
        projection={projection}
        years={years}
        minYearExt={minYearExt}
        maxYearExt={maxYearExt}
        majorStep={25}
        tickLen={axisLabelLayout.tickLen}
        textOffset={axisLabelLayout.textOffset}
        style={{
          ...axisLabelStyle,
          color: vizStyle.years.stroke,
        }}
        bottomAngleDeg={-50}
        topValueByYear={topValueByYear}
      />
      <TitleBlock {...titleProps} />
    </g>
  );
}
