import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { keysToIgnore, words } from "./utils/constants";

function App() {
  const [counter, setCounter] = React.useState<number>(0);
  const [renderableWords, setRenderableWords] = React.useState<string[]>([
    ...words,
  ]);
  const [charClasses, setCharClasses] = React.useState<{
    [key: string]: string;
  }>({});
  const [originalActiveWord, setOriginalActiveWord] =
    React.useState<string>("");
  const [activeWord, setActiveWord] = React.useState<number>(0);
  const [activeChar, setActiveChar] = React.useState<number>(0);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setOriginalActiveWord(words[activeWord]);
  }, [activeWord]);

  React.useEffect(() => {
    if (!ref.current) return;

    ref.current?.focus();
  }, []);

  const handleAddMoreChars = (key: string) => {
    const currentWord = renderableWords[activeWord];

    if (currentWord.length === activeChar) {
      setRenderableWords((prev) => {
        const newWords = [...prev];
        newWords[activeWord] = currentWord + key;
        return newWords;
      });
    }

    setCharClasses((prev) => {
      const newClasses = { ...prev };
      const elementKey = `${activeWord}-${activeChar}`;
      newClasses[elementKey] = "text-red-500";
      return newClasses;
    });
  };

  const handleBackspace = () => {
    if (counter > 0) {
      const currentWord = renderableWords[activeWord];
      setCharClasses((prev) => {
        const newClasses = { ...prev };
        const elementKey = `${activeWord}-${activeChar - 1}`;
        newClasses[elementKey] = "text-white";
        return newClasses;
      });

      if (
        currentWord.length === activeChar &&
        originalActiveWord.length < activeChar
      ) {
        setRenderableWords((prev) => {
          const newWords = [...prev];
          newWords[activeWord] = currentWord.slice(0, -1);
          return newWords;
        });
      }

      if (activeChar === 0) {
        let find: boolean = false;

        for (let i = 0; i < renderableWords[activeWord - 1].length; i++) {
          if (
            charClasses[`${activeWord - 1}-${i}`] === "text-white" ||
            charClasses[`${activeWord - 1}-${i}`] === undefined
          ) {
            setActiveChar(i);
            find = true;
            break;
          }
        }

        setActiveWord(activeWord - 1);

        if (!find) setActiveChar(renderableWords[activeWord - 1].length);
        return;
      } else setCounter(counter - 1);

      setActiveChar(activeChar - 1);
    }
  };

  const handleSpace = () => {
    if (activeChar > 0) {
      setActiveChar(0);
      setActiveWord(activeWord + 1);
    }
  };

  const onKeyDown = (key: string) => {
    if (keysToIgnore.includes(key)) return;

    if (key === " ") {
      handleSpace();
      return;
    }

    if (key === "Backspace") {
      handleBackspace();
      return;
    }

    handleAddMoreChars(key);

    const element = document.getElementById(
      `${activeWord}-${activeChar}`
    ) as HTMLDivElement;

    if (element)
      setCharClasses((prev) => {
        const newClasses = { ...prev };
        const elementKey = `${activeWord}-${activeChar}`;
        if (key === element.textContent) {
          newClasses[elementKey] = "text-green-500";
        } else {
          newClasses[elementKey] = "text-red-500";
        }
        return newClasses;
      });

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
          {renderableWords.map((word, i) => (
            <div
              key={word}
              className={`text-4xl m-2 ${activeWord === i ? "border-b" : ""}`}
            >
              {word.split("").map((char, index) => (
                <span
                  id={`${i}-${index}`}
                  className={charClasses[`${i}-${index}`] || ""}
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
