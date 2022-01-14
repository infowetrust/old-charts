import Curve from "./components/Curve"
import Column from "./components/Column"
import Bar from "./components/Bar"

export default function App() {
  const colors = ["red"]
  return (
    <div>
      {/* for each color in colors array, render a Component using that color for the lineColor */}
      {colors.map(color => <Curve lineColor={color} />)}
      <Column />
      <Bar />
    </div>
  );
}