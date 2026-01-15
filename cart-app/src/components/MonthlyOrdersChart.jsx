import { Bar } from "react-chartjs-2";
import "../utils/chartConfig";

const MonthlyOrdersChart = ({ orders }) => {
  const monthlyCount = {};

  orders.forEach((order) => {
    const month = new Date(order.createdAt).toLocaleString("en-IN", {
      month: "short",
    });
    monthlyCount[month] = (monthlyCount[month] || 0) + 1;
  });

  const data = {
    labels: Object.keys(monthlyCount),
    datasets: [
      {
        label: "Orders",
        data: Object.values(monthlyCount),
        backgroundColor: "#ef4444",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Monthly Orders
      </h3>

      <div className="relative h-[220px] sm:h-[260px] lg:h-[300px]">
        <Bar key={orders.length} data={data} options={options} />
      </div>
    </div>
  );
};

export default MonthlyOrdersChart;
