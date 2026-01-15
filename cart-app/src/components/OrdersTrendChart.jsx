import { Line } from "react-chartjs-2";
import "../utils/chartConfig";

const OrdersTrendChart = ({ orders }) => {
  const last30Days = [...Array(30)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  });

  const dailyCount = last30Days.map((_, index) => {
    const target = new Date();
    target.setDate(target.getDate() - (29 - index));

    return orders.filter(
      (o) => new Date(o.createdAt).toDateString() === target.toDateString()
    ).length;
  });

  const data = {
    labels: last30Days,
    datasets: [
      {
        label: "Orders",
        data: dailyCount,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.15)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Orders (Last 30 Days)
      </h3>

      <div className="relative h-[260px]">
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
          }}
        />
      </div>
    </div>
  );
};

export default OrdersTrendChart;
