import PlateViz from "./plate/PlateViz";
import swedenCsv from "./data/porozzo-tidy.csv?raw";
import contourRaw from "./data/porozzo-contours.json";

export default function PerozzoSweden() {
  return (
    <div className="chartWrap">
      <div className="chartCard">
        <PlateViz
          csvText={swedenCsv}
          contours={contourRaw}
          preset="levasseur"
          showUI={false}
        />
      </div>
    </div>
  );
}
