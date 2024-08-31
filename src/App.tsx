import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const words = ["hola", "almeja", "bandido", "camion"];
  const [char, setChar] = React.useState<string>("");
  const [sentence, setSentence] = React.useState<string>("");
  const [counter, setCounter] = React.useState<number>(0);
  const [started, setStarted] = React.useState<boolean>(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useCallback(() => {
    ref.current?.focus();
  }, []);

  React.useEffect(() => {
    if (!ref.current) return;

    const newSentence = words.join(" ");
    setSentence(newSentence);

    ref.current?.focus();
  }, []);

  React.useEffect(() => {
    if (char === "Backspace") return;

    if (sentence[counter - 1] === char) {
      document
        .getElementById((counter - 1).toString())
        ?.setAttribute("style", "color: green;");
    } else {
      document
        .getElementById((counter - 1).toString())
        ?.setAttribute("style", "color: red;");
    }
  }, [counter]);

  const onKeyDown = (key: string) => {
    if (key === "Backspace") {
      if (counter > 0) setCounter(counter - 1);
      document
        .getElementById((counter - 1).toString())
        ?.setAttribute("style", "color: white;");
    } else {
      setCounter(counter + 1);
    }
    setChar(key);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div
          ref={ref}
          className="flex flex-wrap px-20 focus:outline-none"
          onKeyDown={(e) => onKeyDown(e.key)}
          tabIndex={0}
        >
          {sentence.split("").map((char, index) => (
            <span
              key={index}
              id={index.toString()}
              className={`${char === " " ? "px-1" : ""}`}
            >
              {char}
            </span>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
