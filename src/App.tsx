import Title from "./components/Title"
import Curve from "./components/Curve"
import Column from "./components/Column"
import Bar from "./components/Bar"
import Gold from "./components/Gold"
import Gridbridge from "./components/Gridbridge"
import Stackpop from "./components/Stackpop"
import Palaestina14 from "./components/Palaestina14"
import Palaestina6 from "./components/Palaestina6"
import Fan from "./components/Fan"
import Skullbag from "./components/Skullbag"

export default function App() {
  const colors = ["red"]
  return (
    <div >
      <h1 >&nbsp;CHARTS!</h1>

      {/* <Title /> */}
      {/*       <div className="center">
        <h1 className="blue ">&nbsp;CHARTS!</h1>
        <h1 className="red ">&nbsp;CHARTS!</h1>
        <h1 className="yellow">&nbsp;CHARTS!</h1>
      </div> */}
      {/* See https://codepen.io/helmsmith/pen/xbBEWy
      and https://css-tricks.com/basics-css-blend-modes/ */}

      <p className="tagline ">Analog excellence digitized for the web by RJ&nbsp;Andrews and friends.</p>
      <div id="skullbag" className="line"></div>
      <Skullbag />
      <p>A symbol is flipped upside-down to make a graphic connection between war profiteering and deaths. Its accompanying text began by stating that "the desire for profits makes men do even stranger things than destroy goods."</p>
      <p><i>RICH MAN, POOR MAN: pictures of a paradox</i>  (New York: 1935), is an all-blue book by Ryllis Alexander Goslin and Omar Pancoast Goslin, published by The People's League for Economic Security. It boasts "thirty dynamic, full-page charts" by artist Delos Blackmar.</p>
      <p>My copy of the book is signed by its two authors and Delos Blackmar, who dedicated it: "With sincere prayer for the welfare & education of our suffering human-kind!"</p>

      <p className="tagline"><a target="_blank" rel="noopener" href="https://github.com/infowetrust/old-charts/blob/main/src/components/Skullbag/index.tsx">CHART CODE</a></p>

      <div id="Fan" className="line"></div>
      <Fan />
      <p>A technical description of this chart (e.g. "comparative overlapping polar-area donut") cannot convey the excitement of its arched design, pattern-fill yellows (with a black Nevada!), and careful annotation.</p>
      <p>The layered and masked colors, variety of text sizs and placements, and overall challenge of digitally designing in polar coordinates reveals the brilliance of the original composition.</p>
      <p>This graphic was inspired by "Chart 44-a" from <i>A Graphic Analysis of the Census of Manufactures</i> (1923) by the National Industrial Conference Board. Scroll down to see another digitization from the same publication.</p>
      <p>Chart 44-a was presented in a full-page spread that included a choropleth map (below) and data-table (on the facing righthand page). The map was colored according to salaried employees, which the shown chart is ordered by. The table was ordered alphabetically by state.</p>

      <p className="tagline"><a target="_blank" rel="noopener" href="https://github.com/infowetrust/old-charts/blob/main/src/components/Fan/index.tsx">CHART CODE</a></p>

      <div id="Palaestina" className="line"></div>
      <Palaestina6 />
      <p>Davis Trietsch's folio, <i>Pälastina</i>  (Berlin: 1926), pairs a score of clever bar charts with line graphs and geographic maps to convey demographic, geographic, and financial statistics.</p>
      <p>The rounded typeface and punchy color palette combine for a presentation that demands attention. Innovative features, which do not seem to be adopted anywhere else, include diagonal labels and bars-within-bars, which are reproduced below. Note that the inset bars, which illustrate a sub-group's contribution to the total, are illustrated at the same scale and annotated with the percentage relation to their whole.</p>
      <Palaestina14 />
      <p>Also note how text-styling makes numerals more readable by emphasizing the thousands. The combined effect of color, mark, text, and innovative features creates a coherent proclamation unseen in other data graphics.
      </p>
      <p>Trietsch was a German writer and Zionist economic politician. Born in Dresden, he also lived in New York (where he studied migration issues) and Berlin before emigrating to Palestine in 1932.</p>
      <p>See the the entire folio of Trietsch charts and maps in the David Rumsey <a target="_blank" rel="noopener" href="https://www.davidrumsey.com/luna/servlet/s/14c25v">Map&nbsp;Collection</a>.</p>
      <p className="tagline"><a target="_blank" rel="noopener" href="https://github.com/infowetrust/old-charts/blob/main/src/components/Palaestina6/index.tsx">CHART CODE</a></p>

      <div id="1967paris211" className="line"></div>
      <Stackpop />
      <p>100-percent stacked bar-charts are the best stacked bar-charts. This one is held together by gestalt: There is no visible grid. There is no boundary box. The bars alone are the chart. They also feature a nice circle fill pattern.</p>
      <p>While this chart may not be perfect (the design, for example, does not highlight the data's irregular time intervals), its overall composition makes a bold impact. It is based on a chart on page 211 of the <i>Atlas de Paris et de la Région Parisienne</i> (1967) by Jacqueline Beaujeu-Garnier and Jean Bastié.</p>
      <p className="tagline"><a target="_blank" rel="noopener" href="https://github.com/infowetrust/old-charts/blob/main/src/components/Stackpop/index.tsx">CHART CODE</a></p>

      <div id="1881cheysson8" className="line"></div>
      <Gridbridge />
      <p>This line graph boasts a grid that disappears once it is no longer needed. Both vertical and horizontal gridlines extend from their origins to the farthest data mark—and no more. It was created in conversation with <a target="_blank" rel="noopener" href="https://twitter.com/tomshanleynz">Tom Shanley</a>.</p>
      <p>Each vertical gridline begins at the chart's baseline and terminates at a data point. The logic powering the horizontal gridlines needs to accomodate two situations: (1) Terminate at the diagonal connecting two data points. (2) Bridge chasms to reach the farthest point where they are needed.</p>
      <p>Other features include selective data-point labels, four vertical-axis scales, and multiple line styles. (The original reference chart, which included several more lines, was better suited for a large-format printed sheet than the screen you see here.)</p>
      <p>This chart was inspired by a couplet by Émile Cheysson, "Navigation Intérieure. II. Tonnage kilométrique," in the 1881 <i>Album du statistique graphique</i>. See the original, which showed the same data with absolute and relative scales, in the David Rumsey <a target="_blank" rel="noopener" href="https://www.davidrumsey.com/luna/servlet/s/3p91t6">Map&nbsp;Collection</a>.</p>
      <p className="tagline"><a target="_blank" rel="noopener" href="https://github.com/infowetrust/old-charts/blob/main/src/components/Gridbridge/index.tsx">CHART CODE</a></p>



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

      <p className="tagline"><a href="https://infowetrust.com/">HOMEPAGE</a><br /><br />©2013 – 2022 Info We Trust</p>
    </div>
  );
}