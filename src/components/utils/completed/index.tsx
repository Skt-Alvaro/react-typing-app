import React from "react";
import { WORDS_HISTORY_LABELS } from "../../../utils/constants";
import { WordsHistoryEnum } from "../../../utils/enum";
import CircleChart from "./circle-chart";
import ResultsCard from "./results-card";

interface Props {
  fullWordsHistory: number[];
  wordsHistory: number[];
}

const Results: React.FC<Props> = ({ fullWordsHistory, wordsHistory }) => {
  const [accuracy, setAccuracy] = React.useState<number>(0);
  const historyFormatted = fullWordsHistory.map((w, i) => ({
    name: WORDS_HISTORY_LABELS[i],
    value: w,
  }));

  React.useEffect(() => {
    let all = fullWordsHistory.reduce((acc, word) => {
      return acc + word;
    }, 0);

    const accuracy = (fullWordsHistory[WordsHistoryEnum.CORRECT] / all) * 100;

    setAccuracy(accuracy);
  }, [fullWordsHistory]);

  return (
    <>
      <CircleChart data={historyFormatted} />
      <ResultsCard data={2} />
    </>
  );
};

export default Results;
