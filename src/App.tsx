import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { invalidClasses, keysToIgnore, words } from "./utils/constants";

function App() {
  const [counter, setCounter] = React.useState<number>(0);
  const [renderableWords, setRenderableWords] = React.useState<string[]>([
    ...words,
  ]);
  const [charClasses, setCharClasses] = React.useState<{
    [key: string]: string;
  }>({});
  const [wordClasses, setWordClasses] = React.useState<boolean[]>([]);
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

  /**
   * Adds more characters when typing after reaching the final length of the current word.
   *
   * Updates the `renderableWords` array by appending the typed character to the current word
   * if the user has typed to the end of the word. Additionally, it updates the `charClasses`
   * object to apply a "text-red-500" class to the newly added character.
   *
   * @param {string} key - The character typed by the user.
   */
  const handleAddMoreChars = (key: string) => {
    const currentWord = renderableWords[activeWord];

    if (currentWord.length === activeChar) {
      setRenderableWords((prev) =>
        prev.map((word, index) =>
          index === activeWord ? currentWord + key : word
        )
      );
    }

    setCharClasses((prev) => {
      const newClasses = { ...prev };
      const elementKey = `${activeWord}-${activeChar}`;
      newClasses[elementKey] = "text-red-500";
      return newClasses;
    });
  };

  /**
   * Handles the backspace key press.
   *
   * Removes the last character from the current word and updates the `charClasses` object to change
   * the style of the character to "text-white". If the `currentWord` has more characters than the original
   * word (as displayed on the screen), it will remove the extra characters until the word matches
   * the original length again. Additionally, it manages navigation between words when deleting
   * the first character of the current word.
   */
  const handleBackspace = () => {
    if (counter === 0) return;

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
      setRenderableWords((prev) =>
        prev.map((word, index) =>
          index === activeWord ? currentWord.slice(0, -1) : word
        )
      );
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
  };

  /**
   * Handles the space key press.
   *
   * Verifies if the current word contains an invalid class (such as "text-red-500", `undefined`, or "text-white").
   * If it finds any invalid class, it updates the `wordClasses` array for the current word to `false`, indicating
   * an error, which will trigger a red border below the word. If no invalid class is found, it updates the
   * `wordClasses` array to `true`, indicating the word is correct. The function then resets `activeChar`
   * to 0 and advances to the next word by incrementing `activeWord`.
   */
  const handleSpace = () => {
    if (activeChar === 0) return;

    const currentWordClasses = [...wordClasses];
    const wordLength = renderableWords[activeWord].length;
    const hasInvalidClass = Array.from({ length: wordLength }).some((_, i) =>
      invalidClasses.includes(charClasses[`${activeWord}-${i}`])
    );

    if (hasInvalidClass) {
      currentWordClasses[activeWord] = false;
    } else {
      currentWordClasses[activeWord] = currentWordClasses[activeWord] || true;
    }

    setActiveChar(0);
    setActiveWord(activeWord + 1);
    setWordClasses(currentWordClasses);
  };

  /**
   * Handles key press events.
   *
   * Ignores specific keys based on `keysToIgnore`. If the space bar is pressed, it triggers the `handleSpace`
   * function. If the backspace key is pressed, it triggers the `handleBackspace` function. For other keys,
   * it calls `handleAddMoreChars` to add the character to the current word. The function then checks if the
   * typed character matches the expected character in the word, updating the `charClasses` object to reflect
   * whether the character is correct ("text-green-500") or incorrect ("text-red-500"). Finally, it increments
   * the `counter` and advances the `activeChar` to the next position.
   *
   * @param {string} key - The key that was pressed by the user.
   */
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
              className={`text-4xl m-2 ${
                activeWord === i
                  ? "border-b"
                  : wordClasses[i] === false
                  ? "border-b border-red-500"
                  : ""
              }`}
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
