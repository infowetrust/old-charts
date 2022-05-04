import Curve from "./components/Curve"
import Column from "./components/Column"
import Bar from "./components/Bar"

export default function App() {
  const colors = ["red"]
  return (
    <div>
      {/* for each color in colors array, render a Component using that color for the lineColor */}
      <h1>CHARTS!</h1>
      <p className="tagline">Analog excellence digitized for the web.<br></br>
        By RJ Andrews and friends.</p>
      <br /><br />
      <Column />
      <br /><br />
      <Bar />
      <br /><br />
      {colors.map(color => <Curve lineColor={color} />)}
    </div>
  );
}