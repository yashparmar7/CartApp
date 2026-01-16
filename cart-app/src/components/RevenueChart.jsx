import { Line } from "react-chartjs-2";
import "../utils/chartConfig";

const RevenueChart = ({ orders }) => {
  const data = {
    labels: orders.map((order) =>
      new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    ),
    datasets: [
      {
        label: "Revenue",
        data: orders.map((order) => order.totalAmount),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.15)",
        fill: true,
        tension: 0.45,
        pointRadius: 3,
        pointBackgroundColor: "#ef4444",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `₹${ctx.raw}`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        ticks: {  
          callback: (value) => `₹${value}`,
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
        <Line key={orders.length} data={data} options={options} />
      </div>
    </div>
  );
};

export default RevenueChart;
