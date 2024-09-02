import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [counter, setCounter] = React.useState<number>(0);
  const [words, setWords] = React.useState<string[]>([
    "hola",
    "almeja",
    "bandido",
    "camion",
  ]);
  const [originalActiveWord, setOriginalActiveWord] =
    React.useState<string>("");
  const [activeWord, setActiveWord] = React.useState<number>(0);
  const [activeChar, setActiveChar] = React.useState<number>(0);
  const ref = React.useRef<HTMLDivElement>(null);

  // React.useCallback(() => {
  //   ref.current?.focus();
  // }, []);

  React.useEffect(() => {
    setOriginalActiveWord(words[activeWord]);
  }, [activeWord]);

  React.useEffect(() => {
    if (!ref.current) return;

    ref.current?.focus();
  }, []);

  const handleAddMoreChars = (key: string) => {
    const currentWord = words[activeWord];

    if (currentWord.length === activeChar) {
      setWords((prev) => {
        const newWords = [...prev];
        newWords[activeWord] = currentWord + key;
        return newWords;
      });
    }
  };

  const handleBackspace = () => {
    if (counter > 0) {
      const element = document.getElementById(
        `${activeWord}-${activeChar === 0 ? activeChar : activeChar - 1}`
      ) as HTMLDivElement;

      const currentWord = words[activeWord];
      element.removeAttribute("class");

      if (
        currentWord.length === activeChar &&
        originalActiveWord.length < activeChar
      ) {
        setWords((prev) => {
          const newWords = [...prev];
          newWords[activeWord] = currentWord.slice(0, -1);
          return newWords;
        });
      }

      if (activeChar === 0) {
        setActiveWord(activeWord - 1);
        setActiveChar(counter);
        return;
      } else setCounter(counter - 1);

      setActiveChar(activeChar - 1);
    }
  };

  const handleSpace = () => {
    setActiveChar(0);
    setActiveWord(activeWord + 1);
  };

  const onKeyDown = (key: string) => {
    const ignoredKeys = [
      "Shift",
      "Control",
      "Alt",
      "Meta", // Modifier keys
      "CapsLock",
      "Tab",
      "Escape", // Function keys
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight", // Arrow keys
      "VolumeUp",
      "VolumeDown",
      "AudioVolumeUp",
      "AudioVolumeDown",
      "VolumeMute", // Volume keys
      "F1",
      "F2",
      "F3",
      "F4",
      "F5",
      "F6",
      "F7",
      "F8",
      "F9",
      "F10",
      "F11",
      "F12", // Function keys
    ];

    if (ignoredKeys.includes(key)) return;

    if (key === " ") {
      handleSpace();
      return;
    }

    if (key === "Backspace") {
      handleBackspace();
      return;
    }

    const element = document.getElementById(
      `${activeWord}-${activeChar}`
    ) as HTMLDivElement;

    handleAddMoreChars(key);

    if (key === element?.textContent) element.classList.add("text-green-500");
    else element?.classList.add("text-red-500");

    setCounter(counter + 1);
    setActiveChar(activeChar + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="flex flex-col">
          <span>active word: {activeWord}</span>
          <span>active char: {activeChar}</span>
          <span>counter: {counter}</span>
        </div>
        <div
          ref={ref}
          className="flex flex-wrap px-20 focus:outline-none"
          onKeyDown={(e) => onKeyDown(e.key)}
          tabIndex={0}
        >
          {words.map((word, i) => (
            <div
              key={word}
              className={`text-4xl m-2 ${activeWord === i ? "border-b" : ""}`}
            >
              {word.split("").map((char, index) => (
                <span
                  id={`${i}-${index}`}
                  // className={`${
                  //   activeChar === index && activeWord === i
                  //     ? "text-red-500 text-wrap"
                  //     : ""
                  // }`}
                >
                  {char}
                </span>
              ))}
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
