import React from "react";
import CircleChart from "./circle-chart";
import ResultsCard from "./results-card";
import { WordsHistoryEnum } from "../../../utils/enum";

interface Props {
  fullWordsHistory: number[];
  wordsHistory: number[];
  time: number;
  totalCharacters: number;
}

const Results: React.FC<Props> = ({
  fullWordsHistory,
  wordsHistory,
  time,
  ...props
}) => {
  const [accuracy, setAccuracy] = React.useState<number>(0);

  React.useEffect(() => {
    let all = fullWordsHistory.reduce((acc, word) => {
      return acc + word;
    }, 0);

    const accuracy = (fullWordsHistory[WordsHistoryEnum.CORRECT] / all) * 100;

    setAccuracy(accuracy);
  }, [fullWordsHistory]);

  const wpm = props.totalCharacters / (5 * (time / 60));

  return (
    <>
      <CircleChart data={wordsHistory} />
      <ResultsCard
        accuracy={accuracy}
        wpm={wpm}
        time={time}
        wordsHistory={wordsHistory}
      />
    </>
  );
};

export default Results;
