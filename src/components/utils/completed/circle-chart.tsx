import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { WORDS_HISTORY_LABELS } from "../../../utils/constants";
import { pieChartColors } from "../../../utils/data";

interface Props {
  data: number[];
}

const CircleChart: React.FC<Props> = ({ data }) => {
  let zero_counters = 0;
  const historyFormatted = data.map((w, i) => {
    if (w > 0) zero_counters += 1;

    return {
      name: WORDS_HISTORY_LABELS[i],
      value: w,
    };
  });

  return (
    <ResponsiveContainer width={250} height={400}>
      <PieChart width={250} height={400}>
        <Tooltip />
        <Pie
          data={historyFormatted}
          cx={120}
          cy={200}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={zero_counters === 1 ? 0 : 5}
          dataKey="value"
        >
          {historyFormatted.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={pieChartColors[index % pieChartColors.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CircleChart;