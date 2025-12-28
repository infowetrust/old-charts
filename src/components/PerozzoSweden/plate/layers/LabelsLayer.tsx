import TitleBlock from "./TitleBlock";
import AgeLabels from "./AgeLabels";
import ValueIsolineLabels from "./ValueIsolineLabels";
import YearLabels from "./YearLabels";
import type { Frame3D } from "../../core/frame3d";
import type { ProjectionOptions } from "../../core/geometry";
import type {
  AxisLabelStyle,
  AxisLabelLayout,
  AxisLabelBaseStyle,
} from "../vizConfig";

type LabelsLayerProps = {
  frame: Frame3D;
  projection: ProjectionOptions;
  years: number[];
  minYearExt: number;
  maxYearExt: number;
  axisLabelBaseStyle: AxisLabelBaseStyle;
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
  axisLabelBaseStyle,
  axisLabelLayout,
  vizStyle,
  titleProps,
  topValueByYear,
}: LabelsLayerProps) {
  const ageLabelStyle: AxisLabelStyle = {
    ...axisLabelBaseStyle,
    color: vizStyle.ages.stroke,
  };
  const valueLabelStyle: AxisLabelStyle = {
    ...axisLabelBaseStyle,
    color: vizStyle.values.stroke,
  };
  const yearLabelStyle: AxisLabelStyle = {
    ...axisLabelBaseStyle,
    color: vizStyle.years.stroke,
  };
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
        style={ageLabelStyle}
      />
      <ValueIsolineLabels
        frame={frame}
        projection={projection}
        minYearExt={minYearExt}
        maxYearExt={maxYearExt}
        side={axisLabelLayout.side}
        tickLen={axisLabelLayout.tickLen}
        textOffset={axisLabelLayout.textOffset}
        style={valueLabelStyle}
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
        style={yearLabelStyle}
        bottomAngleDeg={-50}
        topValueByYear={topValueByYear}
      />
      <TitleBlock {...titleProps} />
    </g>
  );
}
