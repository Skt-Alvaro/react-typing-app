import TypingArea from "./components/typing-area";
import Footer from "./components/footer";
import { useTheme } from "./context/theme";
import Logo from "./public/logo";
import { useConfig } from "./context/config";

function App() {
  const { theme } = useTheme();
  const { isTyping } = useConfig();

  return (
    <div
      className={`relative transition-colors duration-500 bg-primary text-secondary theme-${theme}`}
    >
      <div
        className={`flex flex-col items-center absolute top-7 left-0 right-0 mx-auto w-[40%] text-footer-text transition-opacity ${
          isTyping ? "opacity-0 duration-150" : "opacity-100 duration-300"
        }`}
      >
        <Logo />
        <h1 className="mt-1">
          Master the art of speed and precision. A minimalistic typing
          experience.
        </h1>
      </div>
      <TypingArea />
      <Footer />
    </div>
  );
}

export default App;
