import Curve from "./components/Curve"

export default function App() {
  const colors = ["red", "blue", "goldenrod"]
  return (
    <div>
      {/* for each color in colors array, render a Curve component using that color for the lineColor */}
      {colors.map(color => <Curve lineColor={color} />)}
    </div>
  );
}