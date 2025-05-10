import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const LineChartComponent = ({ data, options }: { data: any; options: any }) => {
  return <Line data={data} options={options} />;
};

export default LineChartComponent;
