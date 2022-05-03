import Curve from "./components/Curve"
import Column from "./components/Column"
import Bar from "./components/Bar"
import Gold from "./components/Gold"

app.get("*", function (req, res) {
  res.sendFile(__dirname + "/path/to/index.html")
})

export default function App() {
  const colors = ["red"]
  return (
    <div>
      {/* for each color in colors array, render a Component using that color for the lineColor */}
      {/* <p font-Family="Courier New">CHARTS: a growing collection of analog excellence reimagined for digital web.</p> */}
      <br /><br />
      <Column />
      <br /><br />
      <Bar />
      <br /><br />
      {colors.map(color => <Curve lineColor={color} />)}
      {/* <Gold /> */}
    </div>
  );
}