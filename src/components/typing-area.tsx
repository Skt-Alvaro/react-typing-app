import React from "react";
import { useConfig } from "../context/config";
import { useTypingProgress } from "../hooks/useTypingProgress";
import { SPACE } from "../utils/constants";

const TypingArea = () => {
  const [currentParagraphLine, setCurrentParagraphLine] =
    React.useState<number>(1);
  const [scrollValue, setScrollValue] = React.useState<number>(0);
  const { wordsNumber, isTyping } = useConfig();
  const {
    ref,
    activeWord,
    visible,
    lastAction,
    charClasses,
    renderableWords,
    wordClasses,
    onKeyDown,
  } = useTypingProgress();

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

  return (
    <div className="flex justify-center items-center h-screen">
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
    </div>
  );
};

export default TypingArea;
