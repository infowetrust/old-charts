import Curve from "./components/Curve"
import Column from "./components/Column"
import Bar from "./components/Bar"
import Gold from "./components/Gold"

export default function App() {
  const colors = ["red"]
  return (
    <div>
      <h1>CHARTS!</h1>
      <p className="tagline">Analog excellence digitized for the web.<br></br>
        By RJ Andrews and friends.</p>
      <div className="line"></div>
      <Column />
      <p>This vertical bar chart, or <i>column chart</i>, features several flourishes which ehance its design: asymetric vertical axis labels, bolded baseline labels every five years, emphasized zero-baseline weight, a grid that only appears over data, and a series label that follows the shape of the trend.</p>
      <p>This chart was inspired by an inset graphic by Émile Cheysson, "Navigation Intérieure. II. Tonnage kilométrique," in the 1906 <i>Album du statistique graphique</i>. See the original, an overlapping column chart, in the David Rumsey <a target="_blank" rel="noopener" href="https://www.davidrumsey.com/luna/servlet/s/255jh3">Map&nbsp;Collection</a>.</p>
      <p className="tagline"><a target="_blank" rel="noopener" href="https://github.com/infowetrust/old-charts/blob/main/src/components/Column/index.tsx">CHART CODE</a></p>

      <div className="line"></div>
      <Bar />
      <p>This graphic table features a comparative bar-chart with overlapping rectangles in two different styles—filled and outlined—to enhance the comparison between two different years. Compare this technique to Steven Few's bullet graph.</p>
      <p>This graphic table was inspired by "Chart 61" from <i>A Graphic Analysis of the Census of Manufactures</i> (1923) by the National Industrial Conference Board.</p>
      <p className="tagline"><a target="_blank" rel="noopener" href="https://github.com/infowetrust/old-charts/blob/main/src/components/Column/index.tsx">CHART CODE</a></p>
      <div className="line"></div>
      {/* for each color in colors array, render a Component using that color for the lineColor */}
      {colors.map(color => <Curve lineColor={color} />)}
      <p>This line graph features an emphasized zero-baseline, data-value labels (above the chart), and a total summary value. Created with <a target="_blank" rel="noopener" href="https://twitter.com/colinmegill">Colin Megill</a>.</p>
      <p>This chart was inspired by example 14 from <i>Standards for Graphic Presentation</i> (1915). Its purpose was to emphasize that it "is often desirable to include in the diagram the numerical data or formulae represented." The <i>Standards</i> were an effort by a committee of leading American engineering, scientific, government, and businessmen. They hoped their recommended standards would improve how complex information was “imparted and interpreted.” See all <a target="_blank" rel="noopener" href="https://infowetrust.com/project/1915-standards">seventeen standards</a>.</p>
      <p className="tagline"><a target="_blank" rel="noopener" href="https://github.com/infowetrust/old-charts/blob/main/src/components/Curve/index.tsx">CHART CODE</a></p>
      <div className="line"></div>
      <Gold />
      <p>Description coming soon.</p>
      <div className="line"></div>
    </div>
  );
}