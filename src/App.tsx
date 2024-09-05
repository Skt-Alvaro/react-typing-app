import TypingArea from "./components/typing-area";
import { useTheme } from "./context/theme";
import { themes } from "./utils/data";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`relative transition-colors duration-500 bg-primary text-secondary theme-${theme}`}
    >
      <TypingArea />
      <div>
        <select
          value={theme}
          className="text-black absolute bottom-5 left-3 border px-2 py-1 rounded-lg"
          onChange={(e) => toggleTheme(e.target.value)}
        >
          {themes.map((theme) => (
            <option value={theme.value}>{theme.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default App;
