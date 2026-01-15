import { Line } from "react-chartjs-2";
import "../utils/chartConfig";

const RevenueOrdersChart = ({ orders }) => {
  const daily = {};

  orders.forEach((o) => {
    const d = new Date(o.createdAt).toLocaleDateString("en-IN");
    daily[d] = daily[d] || { revenue: 0, count: 0 };
    daily[d].revenue += o.totalAmount;
    daily[d].count += 1;
  });

  const labels = Object.keys(daily);

  const data = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: labels.map((l) => daily[l].revenue),
        borderColor: "#ef4444",
        tension: 0.4,
      },
      {
        label: "Orders",
        data: labels.map((l) => daily[l].count),
        borderColor: "#3b82f6",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold mb-4 text-gray-700">
        Revenue vs Orders
      </h3>

      <div className="relative h-[260px]">
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>
  );
};

export default RevenueOrdersChart;
