import React from "react";
import BarChart from "../bar-chart";
import { WORDS_HISTORY_LABELS } from "../../../utils/constants";

interface Props {
  wordsHistory: number[];
}

const CompletedBar: React.FC<Props> = ({ wordsHistory }) => {
  const historyFormatted = wordsHistory.map((w, i) => ({
    name: WORDS_HISTORY_LABELS[i],
    uv: w,
  }));

  return <BarChart data={historyFormatted} />;
};

export default CompletedBar;
