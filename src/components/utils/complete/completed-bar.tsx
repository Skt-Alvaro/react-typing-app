import React from "react";
import BarChart from "../bar-chart";
import { WORDS_HISTORY_LABELS } from "../../../utils/constants";
import { WordsHistoryEnum } from "../../../utils/enum";

interface Props {
  fullWordsHistory: number[];
  wordsHistory: number[];
}

const CompletedBar: React.FC<Props> = ({ fullWordsHistory, wordsHistory }) => {
  const [accuracy, setAccuracy] = React.useState<number>(0);
  const historyFormatted = fullWordsHistory.map((w, i) => ({
    name: WORDS_HISTORY_LABELS[i],
    uv: w,
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
      <BarChart data={historyFormatted} />
      <div>
        {JSON.stringify(fullWordsHistory)}
        <p>acc</p>
        <h3>{accuracy}%</h3>
        <h1>El oooooootrooooo</h1>
        {JSON.stringify(wordsHistory)}
      </div>
    </>
  );
};

export default CompletedBar;
