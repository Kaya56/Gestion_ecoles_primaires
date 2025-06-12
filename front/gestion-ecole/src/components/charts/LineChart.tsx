import React from "react";
import {

// LineChart component 
LineChart as RechartsLineChart,
Line,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
Legend,
ResponsiveContainer
} from "recharts";

type DataPoint = {
name: string;
[key: string]: number | string;
};

type LineChartProps = {
data: DataPoint[];
lines: { dataKey: string; stroke?: string; name?: string }[];
xKey?: string;
height?: number;
};

const LineChart: React.FC<LineChartProps> = ({
data,
lines,
xKey = "name",
height = 300
}) => (
<ResponsiveContainer width="100%" height={height}>
    <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {lines.map((line, idx) => (
            <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke || "#8884d8"}
                name={line.name}
                activeDot={{ r: 8 }}
            />
        ))}
    </RechartsLineChart>
</ResponsiveContainer>
);

export default LineChart;