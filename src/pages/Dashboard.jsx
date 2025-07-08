import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../apis/AxiosInstance";

const COLORS = {
  background: "#fdf6ec",
  maroon: "#800000",
  yellow: "#FFC107",
  cardBg: "#ffffff",
  textLight: "#6b7280",
};

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [recentShayaris, setRecentShayaris] = useState([]);
  const [loading, setLoading] = useState(true); // 🆕 loading state

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, chartRes, recentRes] = await Promise.all([
        axiosInstance.get("/dashboard/stats"),
        axiosInstance.get("/dashboard/chart"),
        axiosInstance.get("/dashboard/recent-shayaris"),
      ]);

      setStats(statsRes.data);
      setChartData(chartRes.data);
      setRecentShayaris(recentRes.data);
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    } finally {
      setLoading(false); // 🛑 Stop loading after data fetched
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#fdf6ec]">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-[#800000] mx-auto mb-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          <p className="text-[#800000] font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <div
        className="ml-64 w-full min-h-screen p-6"
        style={{ backgroundColor: COLORS.background }}
      >
        <h1 className="text-4xl font-bold text-[#800000] mb-10 tracking-wide">
          📊 Hindi Shayari Admin Dashboard
        </h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {stats.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl shadow-lg p-6 text-center transition-transform transform hover:scale-105 hover:shadow-2xl duration-200"
              style={{ background: `linear-gradient(145deg, #fff, #f4f4f4)` }}
            >
              <h2
                className="text-sm uppercase tracking-widest"
                style={{ color: COLORS.textLight }}
              >
                Total {item.name}
              </h2>
              <p className="text-4xl font-bold text-[#800000] mt-3">
                {item.count}
              </p>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div
          className="rounded-2xl shadow-lg p-6 mb-12"
          style={{ backgroundColor: COLORS.cardBg }}
        >
          <h2 className="text-2xl font-semibold text-[#800000] mb-6">
            📈 Shayari Stats by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} barCategoryGap={30}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" style={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="shayaris"
                fill={COLORS.maroon}
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Shayaris */}
        <div
          className="rounded-2xl shadow-lg p-6"
          style={{ backgroundColor: COLORS.cardBg }}
        >
          <h2 className="text-2xl font-semibold text-[#800000] mb-6">
            📝 Recent Shayaris
          </h2>
          <ul className="space-y-4">
            {recentShayaris.map((shayari, i) => (
              <li
                key={i}
                className="bg-[#f9f9f9] rounded-lg p-4 hover:bg-[#f3f3f3] transition"
              >
                <strong className="block text-lg text-[#800000] whitespace-pre-line">
                  {shayari.title.replace(/\\n/g, "\n")}
                </strong>
                <div className="text-sm flex justify-between mt-1 text-gray-600">
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                    {shayari.categoryTitle}
                  </span>
                  <span>{shayari.timeAgo}</span>
                </div>
              </li>
            ))}
            {recentShayaris.length === 0 && (
              <p className="text-gray-500 text-center">
                No recent shayaris found.
              </p>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
