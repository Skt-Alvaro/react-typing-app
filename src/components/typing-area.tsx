import React from "react";
import Results from "./utils/completed";
import Tooltip from "./utils/tooltip";
import ArrowPath from "../public/icons/arrow-path";
import ChevronRight from "../public/icons/chevron-right";
import { invalidClasses, keysToIgnore } from "../utils/data";
import { useTheme } from "../context/theme";
import { useConfig } from "../context/config";
import { BACKSPACE, SPACE } from "../utils/constants";
import { WordsHistoryEnum } from "../utils/enum";

const TypingArea = () => {
  const { words, wordsNumber, isTyping, setIsTyping, handleGenerateWords } =
    useConfig();
  const [renderableWords, setRenderableWords] = React.useState<string[]>(words);
  const [counter, setCounter] = React.useState<number>(0);
  const [time, setTime] = React.useState<number>(0);
  const [charClasses, setCharClasses] = React.useState<{
    [key: string]: string;
  }>({});
  const [wordClasses, setWordClasses] = React.useState<boolean[]>([]);
  const [activeWord, setActiveWord] = React.useState<number>(0);
  const [activeChar, setActiveChar] = React.useState<number>(0);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [currentParagraphLine, setCurrentParagraphLine] =
    React.useState<number>(1);
  const [scrollValue, setScrollValue] = React.useState<number>(0);
  const [lastAction, setLastAction] = React.useState<string>("");
  const [completed, setCompleted] = React.useState<boolean>(false);
  const [fullWordsHistory, setFullWordsHistory] = React.useState<number[]>([
    0, 0, 0, 0,
  ]);
  const [wordsHistory, setWordsHistory] = React.useState<number[]>([
    0, 0, 0, 0,
  ]);
  const ref = React.useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  React.useEffect(() => {
    if (!ref.current) return;

    ref.current?.focus();
  }, [theme, ref.current]);

  React.useEffect(() => {
    let interval: NodeJS.Timer = {} as NodeJS.Timer;

    if (isTyping) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else if (isTyping && time !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [time, isTyping]);

  /**
   * This effect is called when words change, so this restart all the states.
   */
  React.useEffect(() => {
    setCounter(0);
    setActiveWord(0);
    setActiveChar(0);
    setWordClasses([]);
    setCharClasses({});
    setLastAction("");
    setIsTyping(false);
  }, [words]);

  React.useEffect(() => {
    if (words.length === 0) return;
    if (!ref.current) return;

    setVisible(false);
    setTimeout(() => {
      setRenderableWords(words);
      setVisible(true);
    }, 200);
    ref.current?.focus();
  }, [words]);

  /**
   * This effect is checking when its time to make the scroll to show the new words or scrolling back to top on doing backspace.
   *
   * If the user reach the last word of the second line or subsequent lines, it scrolls to the next line.
   * If the user is doing backspace, it will scroll back to the previous line.
   */
  React.useEffect(() => {
    const isSpace = lastAction === SPACE;

    const prevWordY = document
      .getElementById((activeWord - 1).toString())
      ?.getBoundingClientRect().y;

    const currentWordY = document
      .getElementById(activeWord.toString())
      ?.getBoundingClientRect().y;

    const nextWordY = document
      .getElementById((activeWord + 1).toString())
      ?.getBoundingClientRect().y;

    if (!currentWordY || !prevWordY || !nextWordY) return;

    const shouldScroll = isSpace
      ? currentWordY > prevWordY
      : currentWordY < nextWordY;

    if (shouldScroll) {
      setCurrentParagraphLine(
        isSpace ? currentParagraphLine + 1 : currentParagraphLine - 1
      );

      const newScrollValue = isSpace ? scrollValue + 57 : scrollValue - 57;

      if (currentParagraphLine + 1 > 2) {
        if (!ref.current) return;

        ref.current.scrollTo({
          top: isSpace ? scrollValue + 57 : scrollValue - 57,
          behavior: "smooth",
        });
        setScrollValue(newScrollValue);
      }
    }
  }, [activeWord]);

  /**
   * This effect is checking when user start and stop typing.
   *
   * If the user is typing and stops typing after 3 seconds, it will set `isTyping` to `false`.
   * Showing the footer again.
   */
  React.useEffect(() => {
    if (
      counter > 0 &&
      !charClasses[`${wordsNumber - 1}-${words[wordsNumber - 1].length - 2}`]
    ) {
      setIsTyping(true);
      let n = 1;

      const timer = setInterval(() => {
        n++;
        if (n === 3) {
          clearInterval(timer);
          setIsTyping(false);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [counter]);

  const handleFinish = (action: "next" | "restart") => {
    setCounter(0);
    setActiveWord(0);
    setActiveChar(0);
    setWordClasses([]);
    setCharClasses({});
    setLastAction("");
    setIsTyping(false);
    setCompleted(false);
    setWordsHistory([0, 0, 0, 0]);
    setFullWordsHistory([0, 0, 0, 0]);
    setTime(0);
    setVisible(false);
    setTimeout(() => {
      setRenderableWords(words);
      setVisible(true);
    }, 200);

    if (action === "next") handleGenerateWords(wordsNumber);
  };

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

      setFullWordsHistory((prev) => {
        const newFullWordsHistory = [...prev];
        newFullWordsHistory[WordsHistoryEnum.EXTRA] += 1;
        return newFullWordsHistory;
      });

      setWordsHistory((prev) => {
        const newCorrectIncorrectChars = [...prev];
        newCorrectIncorrectChars[WordsHistoryEnum.EXTRA] += 1;
        return newCorrectIncorrectChars;
      });
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
    setLastAction(BACKSPACE);

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

      setWordsHistory((prev) => {
        const newCorrectIncorrectChars = [...prev];
        newCorrectIncorrectChars[WordsHistoryEnum.EXTRA] -= 1;
        return newCorrectIncorrectChars;
      });
    } else {
      const elementKey = `${activeWord}-${activeChar - 1}`;

      setWordsHistory((prev) => {
        const newWordsHistory = [...prev];
        charClasses[elementKey] === "text-success"
          ? (newWordsHistory[WordsHistoryEnum.CORRECT] -= 1)
          : (newWordsHistory[WordsHistoryEnum.INCORRECT] -= 1);
        return newWordsHistory;
      });
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

    setLastAction(SPACE);
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
   * whether the character is correct ("text-success") or incorrect ("text-error"). Finally, it increments
   * the `counter` and advances the `activeChar` to the next position.
   * If the user has typed all the words, it triggers the `checkIfWordsAreCorrect` function.
   * To know if he typed all correctly, or failed, and end the game.
   *
   * @param {string} key - The key that was pressed by the user.
   */
  const onKeyDown = (key: string) => {
    if (keysToIgnore.includes(key)) return;

    if (key === SPACE) {
      handleSpace();
      return;
    }

    if (key === BACKSPACE) {
      handleBackspace();
      return;
    }

    handleAddMoreChars(key);

    const element = document.getElementById(
      `${activeWord}-${activeChar}`
    ) as HTMLDivElement;

    if (element) {
      setFullWordsHistory((prev) => {
        const newFullWordsHistory = [...prev];
        key === element.textContent
          ? (newFullWordsHistory[WordsHistoryEnum.CORRECT] += 1)
          : (newFullWordsHistory[WordsHistoryEnum.INCORRECT] += 1);
        return newFullWordsHistory;
      });

      setWordsHistory((prev) => {
        const newWordsHistory = [...prev];
        key === element.textContent
          ? (newWordsHistory[WordsHistoryEnum.CORRECT] += 1)
          : (newWordsHistory[WordsHistoryEnum.INCORRECT] += 1);
        return newWordsHistory;
      });

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

    if (charClasses[`${wordsNumber - 1}-${words[wordsNumber - 1].length - 2}`])
      handleComplete(key === element.textContent);

    setCounter(counter + 1);
    setActiveChar(activeChar + 1);
  };

  const handleComplete = (isLastCharCorrect: boolean) => {
    setCompleted(true);
    setIsTyping(false);

    wordClasses.forEach((wordClass: boolean, index) => {
      if (!wordClass) {
        const wordLength = words[index].length;
        Array.from({ length: wordLength }).forEach((_, i) => {
          if (charClasses[`${index}-${i}`] === undefined) {
            setWordsHistory((prev) => {
              const newWordsHistory = [...prev];
              newWordsHistory[WordsHistoryEnum.MISSED] += 1;
              return newWordsHistory;
            });

            setFullWordsHistory((prev) => {
              const newFullWordsHistory = [...prev];
              newFullWordsHistory[WordsHistoryEnum.MISSED] += 1;
              return newFullWordsHistory;
            });
          }
        });
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {completed ? (
        <div className="block space-y-10 mt-10">
          <div className="flex items-center">
            <Results
              fullWordsHistory={fullWordsHistory}
              wordsHistory={wordsHistory}
              time={time === 0 ? 1 : time}
              totalCharacters={counter}
            />
          </div>
          <div className="w-full flex justify-center gap-x-16">
            <Tooltip text="Next test">
              <ChevronRight
                className="w-7 cursor-pointer stroke-secondary"
                onClick={() => handleFinish("next")}
              />
            </Tooltip>
            <Tooltip text="Restart test">
              <ArrowPath
                className="w-7 cursor-pointer stroke-secondary"
                onClick={() => handleFinish("restart")}
              />
            </Tooltip>
          </div>
        </div>
      ) : (
        <div className="w-[96%]">
          <span
            className={`transition-opacity duration-300 text-2xl ml-2 ${
              isTyping ? "opacity-100" : "opacity-0"
            }`}
          >
            {activeWord + 1}/{wordsNumber}
          </span>
          <div
            ref={ref}
            className={`flex flex-wrap focus:outline-none max-h-[170px] overflow-hidden transition-opacity duration-300 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
            onKeyDown={(e) => onKeyDown(e.key)}
            tabIndex={0}
          >
            {visible
              ? renderableWords.map((word, i) => (
                  <div
                    key={word}
                    id={i.toString()}
                    className={`text-4xl m-2 ${
                      activeWord === i
                        ? "border-b-2 border-secondary"
                        : wordClasses[i] === false
                        ? "border-b border-error"
                        : ""
                    }`}
                  >
                    {word.split("").map((char, index) => (
                      <span
                        id={`${i}-${index}`}
                        className={`transition-colors duration-100 ${
                          charClasses[`${i}-${index}`] || ""
                        }`}
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                ))
              : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default TypingArea;
