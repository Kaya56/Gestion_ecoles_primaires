import React from "react";
import {

// BarChart component 
BarChart as RechartsBarChart,
Bar,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
Legend,
ResponsiveContainer,
} from "recharts";

type BarChartProps = {
data: Array<Record<string, any>>;
xKey: string;
barKeys: string[];
colors?: string[];
height?: number;
};

const BarChart: React.FC<BarChartProps> = ({
data,
xKey,
barKeys,
colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"],
height = 300,
}) => (
<ResponsiveContainer width="100%" height={height}>
    <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {barKeys.map((key, idx) => (
            <Bar key={key} dataKey={key} fill={colors[idx % colors.length]} />
        ))}
    </RechartsBarChart>
</ResponsiveContainer>
);

export default BarChart;