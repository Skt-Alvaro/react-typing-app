import React from "react";
import { gameModeEnum } from "../utils/enum";
import { generate } from "random-words";

interface ConfigContextProps {
  mode: gameModeEnum;
  setMode: React.Dispatch<React.SetStateAction<gameModeEnum>>;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  words: string[];
  setWords: React.Dispatch<React.SetStateAction<string[]>>;
  wordsNumber: number;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  handleGenerateWords: (wordsNumber: number) => void;
}

interface Props {
  children: React.ReactNode;
}

const ConfigContext = React.createContext({} as ConfigContextProps);

export const useConfig = () => React.useContext(ConfigContext);

const ConfigProvider = (props: Props) => {
  const [mode, setMode] = React.useState<gameModeEnum>(gameModeEnum.WORDS);
  const [time, setTime] = React.useState<number>(0);
  const [words, setWords] = React.useState<string[]>([]);
  const [wordsNumber, setWordsNumber] = React.useState<number>(25);
  const [isTyping, setIsTyping] = React.useState<boolean>(false);

  React.useEffect(() => {
    const savedWordsNumber = localStorage.getItem("wordsNumber");
    if (savedWordsNumber) setWordsNumber(Number(savedWordsNumber));
    const generatedWords = generate(
      savedWordsNumber ? Number(savedWordsNumber) : wordsNumber
    ) as string[];
    setWords(generatedWords);
  }, []);

  const handleGenerateWords = (wordsNumber: number) => {
    const generatedWords = generate(wordsNumber) as string[];
    setWordsNumber(wordsNumber);
    setWords(generatedWords);
    localStorage.setItem("wordsNumber", String(wordsNumber));
  };

  const configProviderValue = React.useMemo(
    () => ({
      mode,
      setMode,
      time,
      setTime,
      words,
      setWords,
      wordsNumber,
      isTyping,
      setIsTyping,
      handleGenerateWords,
    }),
    [mode, time, wordsNumber, words, isTyping]
  );

  return (
    <ConfigContext.Provider value={configProviderValue}>
      {props.children}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
