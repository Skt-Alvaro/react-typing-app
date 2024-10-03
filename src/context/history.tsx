import React from "react";
import { WordsHistoryEnum } from "../utils/enum";

interface HistoryContextProps {
  wordsHistory: number[];
  setWordsHistory: React.Dispatch<React.SetStateAction<number[]>>;
  fullWordsHistory: number[];
  setFullWordsHistory: React.Dispatch<React.SetStateAction<number[]>>;
}

interface Props {
  children: React.ReactNode;
}

const HistoryContext = React.createContext({} as HistoryContextProps);

export const useHistory = () => React.useContext(HistoryContext);

const HistoryProvider = (props: Props) => {
  const [fullWordsHistory, setFullWordsHistory] = React.useState<number[]>([
    WordsHistoryEnum.CORRECT,
    WordsHistoryEnum.INCORRECT,
    WordsHistoryEnum.EXTRA,
    WordsHistoryEnum.MISSED,
  ]);

  const [wordsHistory, setWordsHistory] = React.useState<number[]>([
    WordsHistoryEnum.CORRECT,
    WordsHistoryEnum.INCORRECT,
    WordsHistoryEnum.EXTRA,
    WordsHistoryEnum.MISSED,
  ]);

  const historyProviderValue = React.useMemo(
    () => ({
      wordsHistory,
      setWordsHistory,
      fullWordsHistory,
      setFullWordsHistory,
    }),
    [wordsHistory, fullWordsHistory]
  );

  return (
    <HistoryContext.Provider value={historyProviderValue}>
      {props.children}
    </HistoryContext.Provider>
  );
};

export default HistoryProvider;
