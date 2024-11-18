import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

interface LineChartProps {
  data: any;
  options: any;
}

const LineChartComponent = ({ data, options }: LineChartProps) => {
  return <Line data={data} options={options} />;
};

export default LineChartComponent;
