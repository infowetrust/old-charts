import Curve from "./components/Curve"
import Column from "./components/Column"
import Bar from "./components/Bar"
import Gold from "./components/Gold"

export default function App() {
  const colors = ["red"]
  return (
    <div>
      <h1>&nbsp;CHARTS!</h1>
      <p className="tagline">Analog excellence digitized for the web.<br />By RJ Andrews and friends.</p>

      <div id="1925karsten102" className="line"></div>
      <Gold />
      <p>This diverging bar-chart compares the ratio of gold reserves of central banks to paper currency in circulation (left) to the relation of exchange rates to par value. It appeared as figure 102 in Karl. G. Karsten's <i>Charts and Graphs</i> (1925) with the caption, "Correlation is Indicated by Mirroring." </p>
      <p>Karsten exhibited this chart in a chapter on composite bar-charts as an answer to overly-complex designs. His text explained:</p>
      <p>"In fact, it can be laid down as a general rule that both the compound and the multiple bar-charts are too elaborate and complicated. A chart is always better the simpler it is, and we should make strong efforts to simplify these charts, and if possible reduce them to simple bar-charts. It usually pays well for sacrifices we make in this way, in legibility and interest to the reader, and after all, the chart of this type is generally directed at a reader, rather than at the maker. The only one of the three which stands out as absolutely simple and clear is the relative compound bar-chart, which consists of nothing more than a series of 100% bars."</p>
      <p>Karsten's original caption attributes permission to Carl Snyder and dates the chart to March, 1922. Read Karsten's book at the <a target="_blank" rel="noopener" href="https://archive.org/details/in.ernet.dli.2015.13852/page/n159/mode/2up">Internet Archive</a>.</p>
      <p className="tagline"><a target="_blank" rel="noopener" href="https://github.com/infowetrust/old-charts/blob/main/src/components/Gold/index.tsx">CHART CODE</a></p>

      <div id="1906cheysson21" className="line"></div>
      <Column />
      <p>This vertical bar chart, or <i>column chart</i>, features several flourishes which ehance its design: asymetric vertical axis labels, bolded baseline labels every five years, emphasized zero-baseline weight, a grid that only appears over data, and a series label that follows the shape of the trend.</p>
      <p>This chart was inspired by an inset graphic by Émile Cheysson, "Navigation Intérieure. II. Tonnage kilométrique," in the 1906 <i>Album du statistique graphique</i>. See the original, an overlapping column chart, in the David Rumsey <a target="_blank" rel="noopener" href="https://www.davidrumsey.com/luna/servlet/s/255jh3">Map&nbsp;Collection</a>.</p>
      <p className="tagline"><a target="_blank" rel="noopener" href="https://github.com/infowetrust/old-charts/blob/main/src/components/Column/index.tsx">CHART CODE</a></p>

      <div id="1923census61" className="line"></div>
      <Bar />
      <p>This graphic table features a comparative bar-chart with overlapping rectangles in two different styles—filled and outlined—to enhance the comparison between two different years. Compare this technique to Steven Few's bullet graph.</p>
      <p>This graphic table was inspired by "Chart 61" from <i>A Graphic Analysis of the Census of Manufactures</i> (1923) by the National Industrial Conference Board.</p>
      <p className="tagline"><a target="_blank" rel="noopener" href="https://github.com/infowetrust/old-charts/blob/main/src/components/Column/index.tsx">CHART CODE</a></p>

      <div id="standard14" className="line"></div>
      {/* for each color in colors array, render a Component using that color for the lineColor */}
      {colors.map(color => <Curve lineColor={color} />)}
      <p>This line graph features an emphasized zero-baseline, data-value labels (above the chart), and a total summary value. Created with <a target="_blank" rel="noopener" href="https://twitter.com/colinmegill">Colin Megill</a>.</p>
      <p>This chart was inspired by example 14 from <i>Standards for Graphic Presentation</i> (1915). Its purpose was to emphasize that it "is often desirable to include in the diagram the numerical data or formulae represented." The <i>Standards</i> were an effort by a committee of leading American engineering, scientific, government, and businessmen. They hoped their recommended standards would improve how complex information was “imparted and interpreted.” See all <a target="_blank" rel="noopener" href="https://infowetrust.com/project/1915-standards">seventeen standards</a>.</p>
      <p className="tagline"><a target="_blank" rel="noopener" href="https://github.com/infowetrust/old-charts/blob/main/src/components/Curve/index.tsx">CHART CODE</a></p>
      <div className="line"></div>
      <p className="tagline"><a href="https://infowetrust.com/">INFO WE TRUST HOMEPAGE</a></p>
    </div>
  );
}