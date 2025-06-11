import React from "react";
import { Pie } from "react-chartjs-2";
import {

// PieChart component 
Chart as ChartJS,
ArcElement,
Tooltip,
Legend,
} from "chart.js";
import type { ChartOptions } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type PieChartProps = {
data: {
    labels: string[];
    datasets: {
        data: number[];
        backgroundColor?: string[];
        borderColor?: string[];
        borderWidth?: number;
    }[];
};
options?: ChartOptions<"pie">;
width?: number;
height?: number;
};

const PieChart: React.FC<PieChartProps> = ({ data, options, width, height }) => {
return (
    <div style={{ width: width || 400, height: height || 400 }}>
        <Pie data={data} options={options} />
    </div>
);
};

export default PieChart;