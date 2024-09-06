import TypingArea from "./components/typing-area";
import Footer from "./components/footer";
import { useTheme } from "./context/theme";

function App() {
  const { theme } = useTheme();

  return (
    <div
      className={`relative transition-colors duration-500 bg-primary text-secondary theme-${theme}`}
    >
      <TypingArea />
      <Footer />
    </div>
  );
}

export default App;
