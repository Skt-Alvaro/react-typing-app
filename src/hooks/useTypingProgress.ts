import React from "react";
import { useHistory } from "../context/history";
import { endingActions, WordsHistoryEnum } from "../utils/enum";
import { BACKSPACE, SPACE } from "../utils/constants";
import { useConfig } from "../context/config";
import { invalidClasses, validKeys } from "../utils/data";
import { useTheme } from "../context/theme";

export const useTypingProgress = () => {
  const { words, wordsNumber, isTyping, setIsTyping, handleGenerateWords } =
    useConfig();
  const [renderableWords, setRenderableWords] = React.useState<string[]>(words);
  const [charClasses, setCharClasses] = React.useState<{
    [key: string]: string;
  }>({});
  const [wordClasses, setWordClasses] = React.useState<boolean[]>([]);
  const [activeWord, setActiveWord] = React.useState<number>(0);
  const [activeChar, setActiveChar] = React.useState<number>(0);
  const [visible, setVisible] = React.useState<boolean>(true);
  const [lastAction, setLastAction] = React.useState<string>("");
  const ref = React.useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const {
    counter,
    setCounter,
    time,
    setTime,
    completed,
    setCompleted,
    endingType,
    setEndingType,
    setWordsHistory,
    setFullWordsHistory,
  } = useHistory();

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

  React.useEffect(() => {
    setCounter(0);
    setActiveWord(0);
    setActiveChar(0);
    setWordClasses([]);
    setCharClasses({});
    setLastAction("");
    setIsTyping(false);
    setWordsHistory([0, 0, 0, 0]);
    setFullWordsHistory([0, 0, 0, 0]);
    setTime(0);
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

  React.useEffect(() => {
    if (!completed && endingType !== null)
      if (endingType !== null) handleFinish(endingType);
      else handleFinish(endingActions.NEXT);
  }, [completed]);

  /**
   * Handle the extra characters addition at the end of a word when user keeps typing
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
        const incorrectNumber = newWordsHistory[WordsHistoryEnum.INCORRECT];
        if (charClasses[elementKey] === "text-success") {
          newWordsHistory[WordsHistoryEnum.CORRECT] -= 1;
        } else if (incorrectNumber > 0) {
          newWordsHistory[WordsHistoryEnum.INCORRECT] -= 1;
        }
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

  const handleFinish = (action: endingActions) => {
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

    if (action === endingActions.NEXT) handleGenerateWords(wordsNumber);
    setEndingType(null);
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
    if (!validKeys.includes(key)) return;

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

  return {
    handleBackspace,
    handleSpace,
    handleAddMoreChars,
    handleFinish,
    handleComplete,
    onKeyDown,
    charClasses,
    setCharClasses,
    visible,
    ref,
    time,
    activeWord,
    activeChar,
    lastAction,
    completed,
    counter,
    setCounter,
    setActiveChar,
    renderableWords,
    wordClasses,
  };
};
