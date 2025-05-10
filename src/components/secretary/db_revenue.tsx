import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/pages/api/endpoints";
import Cookies from "js-cookie";
import { FaCoins, FaChartLine, FaCalendarAlt, FaUserTie } from "react-icons/fa";

const RevenueStats: React.FC = () => {
  const [dailyBalance, setDailyBalance] = useState<number | string | null>(
    null
  );
  const [monthlyRevenue, setMonthlyRevenue] = useState<number | string | null>(
    null
  );
  const [yearlyRevenue, setYearlyRevenue] = useState<number | string | null>(
    null
  );
  const [totalDriver, setTotalDriver] = useState<number | string | null>(null);
  const [totalDispatcher, setTotalDispatcher] = useState<
    number | string | null
  >(null);
  const [total, setTotal] = useState<number | string | null>(null);

  const fetchData = async () => {
    const token = Cookies.get("userToken");

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const [dailyRes, monthlyRes, yearlyRes, countTotalDd] = await Promise.all(
        [
          fetch(`/api/proxy?endpoint=${ENDPOINTS.GET_DAILY_BALANCE}`, {
            headers,
          }),
          fetch(`/api/proxy?endpoint=${ENDPOINTS.GET_MONTHLY_REVENUE}`, {
            headers,
          }),
          fetch(`/api/proxy?endpoint=${ENDPOINTS.GET_YEARLY_REVENUE}`, {
            headers,
          }),
          fetch(
            `/api/proxy?endpoint=${ENDPOINTS.COUNT_TOTAL_DRIVER_DISPATCHER}`,
            { headers }
          ),
        ]
      );

      const dailyData = await dailyRes.json();
      const monthlyData = await monthlyRes.json();
      const yearlyData = await yearlyRes.json();
      const countTotalDdData = await countTotalDd.json();

      setDailyBalance(dailyData.balance || 0);
      setMonthlyRevenue(monthlyData.monthly_revenue || 0);
      setYearlyRevenue(yearlyData.yearly_revenue || 0);
      setTotalDriver(countTotalDdData.data.drivers || 0);
      setTotalDispatcher(countTotalDdData.data.dispatchers || 0);
      setTotal(countTotalDdData.total || 0);
    } catch (error) {
      console.error("Failed to fetch revenue data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatAmount = (amount: number | string | null) =>
    amount !== null
      ? `₱${new Intl.NumberFormat("en-PH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(Number(amount))}`
      : "Loading...";

  const cardClass =
    "bg-[#2d665f] text-white p-6 rounded-lg shadow-md flex-1 min-w-[250px] max-w-[300px]";

  return (
    <div className="flex flex-wrap justify-center gap-6 p-6">
      <div className={cardClass}>
        <div className="flex items-center space-x-3 mb-2">
          <FaCoins size={24} />
          <h3 className="text-lg font-semibold">Daily Fees Collected</h3>
        </div>
        <p className="text-xl font-bold">{formatAmount(dailyBalance)}</p>
      </div>

      <div className={cardClass}>
        <div className="flex items-center space-x-3 mb-2">
          <FaChartLine size={24} />
          <h3 className="text-lg font-semibold">Monthly Total Revenue</h3>
        </div>
        <p className="text-xl font-bold">{formatAmount(monthlyRevenue)}</p>
      </div>

      <div className={cardClass}>
        <div className="flex items-center space-x-3 mb-2">
          <FaCalendarAlt size={24} />
          <h3 className="text-lg font-semibold">Yearly Total Revenue</h3>
        </div>
        <p className="text-xl font-bold">{formatAmount(yearlyRevenue)}</p>
      </div>

      <div className={cardClass}>
        <div className="flex items-center space-x-3 mb-2">
          <FaUserTie size={24} />
          <h3 className="text-lg font-semibold">Total Personnel</h3>
        </div>
        <p className="text-md font-bold">
          Driver: {totalDriver ?? "Loading..."}
        </p>
        <p className="text-md font-bold">
          Dispatcher: {totalDispatcher ?? "Loading..."}
        </p>
      </div>
    </div>
  );
};

export default RevenueStats;
