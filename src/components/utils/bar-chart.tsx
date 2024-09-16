import React from "react";
import {
  BarChart as TinyBarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  YAxis,
} from "recharts";

interface Props {
  data: { name: string; uv: number }[];
}

const BarChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="50%" height="50%">
      <TinyBarChart width={150} height={40} data={data}>
        <Tooltip
          cursor={false}
          labelClassName="text-black"
          itemStyle={{ color: "#000" }}
        />
        <XAxis
          dataKey="name"
          tick={{ fill: "var(--color-secondary)" }}
          axisLine={{ stroke: "var(--color-secondary)" }}
          tickLine={{ stroke: "var(--color-secondary)" }}
        />
        <YAxis
          dataKey="uv"
          tick={{ fill: "var(--color-secondary)" }}
          axisLine={{ stroke: "var(--color-secondary)" }}
          tickLine={{ stroke: "var(--color-secondary)" }}
          padding={{ bottom: 1 }}
        />
        <Bar dataKey="uv" fill="var(--color-footer-text-hover)" />
      </TinyBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
