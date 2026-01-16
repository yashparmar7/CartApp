import { Line } from "react-chartjs-2";
import "../utils/chartConfig";

const RevenueChart = ({ orders }) => {
  // 1️⃣ Aggregate revenue per day
  const dailyRevenue = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt).toISOString().split("T")[0];

    if (!dailyRevenue[date]) {
      dailyRevenue[date] = 0;
    }

    dailyRevenue[date] += order.totalAmount;
  });

  // 2️⃣ Sort dates (LEFT ➜ RIGHT)
  const labels = Object.keys(dailyRevenue).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  // 3️⃣ Prepare chart data
  const data = {
    labels: labels.map((date) =>
      new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    ),
    datasets: [
      {
        label: "Revenue",
        data: labels.map((date) => dailyRevenue[date]),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.15)",
        fill: true,
        tension: 0.45,
        pointRadius: 3,
        pointBackgroundColor: "#ef4444",
      },
    ],
  };

  // 4️⃣ Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Revenue: ₹${ctx.raw.toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        ticks: {
          callback: (value) => `₹${value.toLocaleString("en-IN")}`,
        },
        grid: {
          color: "#f1f5f9",
        },
      },
    },
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Revenue Trend
      </h3>

      <div className="relative h-[220px] sm:h-[260px] lg:h-[300px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default RevenueChart;
