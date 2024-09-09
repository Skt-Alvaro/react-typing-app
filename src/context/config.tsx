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
  setWordsNumber: React.Dispatch<React.SetStateAction<number>>;
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

  React.useEffect(() => {
    const generatedWords = generate(wordsNumber) as string[];
    setWords(generatedWords);
  }, [wordsNumber]);

  const configProviderValue = React.useMemo(
    () => ({
      mode,
      setMode,
      time,
      setTime,
      words,
      setWords,
      wordsNumber,
      setWordsNumber,
    }),
    [mode, time, wordsNumber, words]
  );

  return (
    <ConfigContext.Provider value={configProviderValue}>
      {props.children}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
