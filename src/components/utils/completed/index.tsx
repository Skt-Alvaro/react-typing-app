import React from "react";
import CircleChart from "./circle-chart";
import ResultsCard from "./results-card";
import { WordsHistoryEnum } from "../../../utils/enum";
import { useHistory } from "../../../context/history";
import { useTypingProgress } from "../../../hooks/useTypingProgress";

const Results = () => {
  const [accuracy, setAccuracy] = React.useState<number>(0);
  const { wordsHistory, fullWordsHistory } = useHistory();
  const { time, counter } = useTypingProgress();

  React.useEffect(() => {
    let all = fullWordsHistory.reduce((acc, word) => {
      return acc + word;
    }, 0);

    const accuracy = (fullWordsHistory[WordsHistoryEnum.CORRECT] / all) * 100;

    setAccuracy(accuracy);
  }, [fullWordsHistory]);

  const wpm = counter / (5 * (time / 60));

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
