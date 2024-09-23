import TypingArea from "./components/typing-area";
import Footer from "./components/footer";
import { useTheme } from "./context/theme";
import { useConfig } from "./context/config";
import Logo from "./public/logo";

function App() {
  const { theme } = useTheme();
  const { isTyping } = useConfig();

  return (
    <div
      className={`relative transition-colors duration-500 bg-primary text-secondary theme-${theme}`}
    >
      <div
        className={`flex flex-col items-center absolute top-7 left-0 right-0 mx-auto text-footer-text transition-opacity sm:px-0 px-5 ${
          isTyping ? "opacity-0 duration-150" : "opacity-100 duration-300"
        }`}
      >
        <Logo className="sm:w-[620px]" />
        <h1 className="mt-1 text-center sm:text-base text-sm">
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
