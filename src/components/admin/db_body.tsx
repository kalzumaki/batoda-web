import { useEffect, useState } from "react";
import { ENDPOINTS } from "@/pages/api/endpoints";
import Cookies from "js-cookie";

const DbBody: React.FC = () => {
  const [dailyBalance, setDailyBalance] = useState<number | string | null>(
    null
  );
  const [monthlyRevenue, setMonthlyRevenue] = useState<number | string | null>(
    null
  );
  const [yearlyRevenue, setYearlyRevenue] = useState<number | string | null>(
    null
  );

  const [activeUsers, setActiveUsers] = useState<number | string | null>();
  const [totalDriver, setTotalDriver] = useState<number | string | null>();
  const [totalDispatcher, setTotalDispatcher] = useState<
    number | string | null
  >();
  const [total, setTotal] = useState<number | string | null>();

  const fetchData = async () => {
    const token = Cookies.get("userToken");

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const [dailyRes, monthlyRes, yearlyRes, countActiveUsers, countTotalDd] =
        await Promise.all([
          fetch(`/api/proxy?endpoint=${ENDPOINTS.GET_DAILY_BALANCE}`, {
            headers,
          }),
          fetch(`/api/proxy?endpoint=${ENDPOINTS.GET_MONTHLY_REVENUE}`, {
            headers,
          }),
          fetch(`/api/proxy?endpoint=${ENDPOINTS.GET_YEARLY_REVENUE}`, {
            headers,
          }),
          fetch(`/api/proxy?endpoint=${ENDPOINTS.COUNT_ACTIVE_USERS}`, {
            headers,
          }),
          fetch(
            `/api/proxy?endpoint=${ENDPOINTS.COUNT_TOTAL_DRIVER_DISPATCHER}`,
            {
              headers,
            }
          ),
        ]);

      const dailyData = await dailyRes.json();
      const monthlyData = await monthlyRes.json();
      const yearlyData = await yearlyRes.json();
      const countActiveUsersData = await countActiveUsers.json();
      const countTotalDdData = await countTotalDd.json();

      setDailyBalance(dailyData.balance || 0);
      setMonthlyRevenue(monthlyData.monthly_revenue || 0);
      setYearlyRevenue(yearlyData.yearly_revenue || 0);
      setActiveUsers(countActiveUsersData.active_users || 0);
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

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center p-6">
      <div className="bg-[#2d665f] text-white p-6 rounded-lg shadow-md w-full md:w-1/3">
        <h3 className="text-lg font-semibold">Daily Fees Collected</h3>
        <p className="mt-2 text-xl font-bold">{formatAmount(dailyBalance)}</p>
      </div>
      <div className="bg-[#2d665f] text-white p-6 rounded-lg shadow-md w-full md:w-1/3">
        <h3 className="text-lg font-semibold">Monthly Total Revenue</h3>
        <p className="mt-2 text-xl font-bold">{formatAmount(monthlyRevenue)}</p>
      </div>
      <div className="bg-[#2d665f] text-white p-6 rounded-lg shadow-md w-full md:w-1/3">
        <h3 className="text-lg font-semibold">Yearly Total Revenue</h3>
        <p className="mt-2 text-xl font-bold">{formatAmount(yearlyRevenue)}</p>
      </div>
      <div className="bg-[#2d665f] text-white p-6 rounded-lg shadow-md w-full md:w-1/3">
        <h3 className="text-lg font-semibold">Active Users</h3>
        <p className="mt-2 text-xl font-bold">
          {activeUsers !== null ? activeUsers : "Loading..."}
        </p>
      </div>

      <div className="bg-[#2d665f] text-white p-6 rounded-lg shadow-md w-full md:w-1/3">
        <h3 className="text-lg font-semibold">Total</h3>
        <p className="mt-2 text-xl font-bold">
          Driver: {totalDriver !== null ? totalDriver : "Loading..."}
        </p>
        <p className="mt-2 text-xl font-bold">
          Dispatcher:{" "}
          {totalDispatcher !== null ? totalDispatcher : "Loading..."}
        </p>
      </div>
    </div>
  );
};

export default DbBody;
