import React from "react";
import { endingActions } from "../utils/enum";

interface HistoryContextProps {
  counter: number;
  setCounter: React.Dispatch<React.SetStateAction<number>>;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  completed: boolean;
  setCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  endingType: endingActions | null;
  setEndingType: React.Dispatch<React.SetStateAction<endingActions | null>>;
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
  const [counter, setCounter] = React.useState<number>(0);
  const [time, setTime] = React.useState<number>(0);
  const [completed, setCompleted] = React.useState<boolean>(false);
  const [endingType, setEndingType] = React.useState<endingActions | null>(
    null
  );

  const [fullWordsHistory, setFullWordsHistory] = React.useState<number[]>([
    0, 0, 0, 0,
  ]);

  const [wordsHistory, setWordsHistory] = React.useState<number[]>([
    0, 0, 0, 0,
  ]);

  const historyProviderValue = React.useMemo(
    () => ({
      counter,
      setCounter,
      time,
      setTime,
      completed,
      setCompleted,
      endingType,
      setEndingType,
      wordsHistory,
      setWordsHistory,
      fullWordsHistory,
      setFullWordsHistory,
    }),
    [counter, time, completed, endingType, wordsHistory, fullWordsHistory]
  );

  return (
    <HistoryContext.Provider value={historyProviderValue}>
      {props.children}
    </HistoryContext.Provider>
  );
};

export default HistoryProvider;
