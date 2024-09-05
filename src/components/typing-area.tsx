import React from "react";
import { invalidClasses, keysToIgnore, words } from "../utils/data";
import { useTheme } from "../context/theme";

const TypingArea = () => {
  const [counter, setCounter] = React.useState<number>(0);
  const [allWordsLength, setAllWordsLength] = React.useState<number>(0);
  const [renderableWords, setRenderableWords] = React.useState<string[]>([
    ...words,
  ]);
  const [charClasses, setCharClasses] = React.useState<{
    [key: string]: string;
  }>({});
  const [wordClasses, setWordClasses] = React.useState<boolean[]>([]);
  const [activeWord, setActiveWord] = React.useState<number>(0);
  const [activeChar, setActiveChar] = React.useState<number>(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  React.useEffect(() => {
    if (!ref.current) return;

    ref.current?.focus();
  }, [theme]);

  React.useEffect(() => {
    let n = 0;

    words.forEach((word) => (n += word.length));

    setAllWordsLength(n);
  }, []);

  /**
   * Adds more characters when typing after reaching the final length of the current word.
   *
   * Updates the `renderableWords` array by appending the typed character to the current word
   * if the user has typed to the end of the word. Additionally, it updates the `charClasses`
   * object to apply a "text-error" class to the newly added character.
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
      newClasses[elementKey] = "text-error";
      return newClasses;
    });
  };

  /**
   * Handles the backspace key press.
   *
   * Removes the last character from the current word and updates the `charClasses` object to change
   * the style of the character to "text-secondary". If the `currentWord` has more characters than the original
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
      newClasses[elementKey] = "text-secondary";
      return newClasses;
    });

    if (
      currentWord.length === activeChar &&
      words[activeWord].length < activeChar
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
          charClasses[`${activeWord - 1}-${i}`] === "text-secondary" ||
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
   * Verifies if the current word contains an invalid class (such as "text-error", `undefined`, or "text-secondary").
   * If it finds any invalid class, it updates the `wordClasses` array for the current word to `false`, indicating
   * an error, which will trigger a red border below the word. If no invalid class is found, it updates the
   * `wordClasses` array to `true`, indicating the word is correct. The function then resets `activeChar`
   * to 0 and advances to the next word by incrementing `activeWord`.
   */
  const handleSpace = () => {
    if (activeChar === 0 || renderableWords[activeWord + 1] === undefined)
      return;

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
   * Checks if all words and their characters are correct by verifying their associated classes.
   *
   * The function iterates through all the words and characters, checking if their associated class
   * in `charClasses` is "text-success". If it finds any character that doesn't have this class,
   * it returns `false`, unless it is the last character of the last word, in which case it checks
   * if the last element's text color matches the provided `lastElementTextColor` parameter.
   * The `lastElementTextColor` is because the `charClasses` state is not updated with the last character.
   *
   * @param {string} lastElementTextColor - The expected class of the last character in the last word.
   * @returns {boolean} - Returns `true` if all characters are correct; otherwise, returns `false`.
   */
  const checkIfWordsAreCorrect = (lastElementTextColor: string) => {
    for (let wordIndex = 0; wordIndex < renderableWords.length; wordIndex++) {
      const word = renderableWords[wordIndex];
      for (let charIndex = 0; charIndex < word.length; charIndex++) {
        const charClass = charClasses[`${wordIndex}-${charIndex}`];
        if (charClass !== "text-success") {
          if (
            wordIndex === words.length - 1 &&
            charIndex === words[wordIndex].length - 1
          ) {
            return lastElementTextColor === "text-success";
          } else return false; // Finds a class that is not "text-success"
        }
      }
    }
    return true; // All classes are text-success
  };

  /**
   * Handles key press events.
   *
   * Ignores specific keys based on `keysToIgnore`. If the space bar is pressed, it triggers the `handleSpace`
   * function. If the backspace key is pressed, it triggers the `handleBackspace` function. For other keys,
   * it calls `handleAddMoreChars` to add the character to the current word. The function then checks if the
   * typed character matches the expected character in the word, updating the `charClasses` object to reflect
   * whether the character is correct ("text-success") or incorrect ("text-error"). Finally, it increments
   * the `counter` and advances the `activeChar` to the next position.
   * If the user has typed all the words, it triggers the `checkIfWordsAreCorrect` function.
   * To know if he typed all correctly, or failed, and end the game.
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

    if (element) {
      setCharClasses((prev) => {
        const newClasses = { ...prev };
        const elementKey = `${activeWord}-${activeChar}`;
        if (key === element.textContent) {
          newClasses[elementKey] = "text-success";
        } else {
          newClasses[elementKey] = "text-error";
        }
        return newClasses;
      });
    }

    if (counter === allWordsLength - 1) {
      const lastElementTextColor =
        key === element.textContent ? "text-success" : "text-error";

      if (checkIfWordsAreCorrect(lastElementTextColor)) {
        alert("Congrats!");
      } else alert("Failed");
    }

    setCounter(counter + 1);
    setActiveChar(activeChar + 1);
  };

  return (
    <div className="flex justify-center items-center h-screen">
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
                ? "border-b border-error"
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
    </div>
  );
};

export default TypingArea;
