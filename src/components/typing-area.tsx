import React from "react";
import Results from "./utils/completed";
import Tooltip from "./utils/tooltip";
import ArrowPath from "../public/icons/arrow-path";
import ChevronRight from "../public/icons/chevron-right";
import { keysToIgnore } from "../utils/data";
import { useConfig } from "../context/config";
import { BACKSPACE, SPACE } from "../utils/constants";
import { WordsHistoryEnum } from "../utils/enum";
import { useTypingProgress } from "../hooks/useTypingProgress";
import { useHistory } from "../context/history";

const TypingArea = () => {
  const { words, wordsNumber, isTyping } = useConfig();

  const {
    handleAddMoreChars,
    handleBackspace,
    handleSpace,
    ref,
    activeWord,
    visible,
    lastAction,
    completed,
    activeChar,
    setCharClasses,
    charClasses,
    handleComplete,
    handleFinish,
    counter,
    setCounter,
    setActiveChar,
    renderableWords,
    wordClasses,
  } = useTypingProgress();
  const { setWordsHistory, setFullWordsHistory } = useHistory();

  const [currentParagraphLine, setCurrentParagraphLine] =
    React.useState<number>(1);
  const [scrollValue, setScrollValue] = React.useState<number>(0);

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

  return (
    <div className="flex justify-center items-center h-screen">
      {completed ? (
        <div className="block space-y-10 mt-10">
          <div className="flex items-center">
            <Results />
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
              ? renderableWords.map((word, i: number) => (
                  <div
                    key={i}
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
                        key={index}
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
