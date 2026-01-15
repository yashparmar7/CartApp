import { Doughnut } from "react-chartjs-2";
import "../utils/chartConfig";

const OrdersStatusChart = ({ orders }) => {
  const placed = orders.filter((o) => o.orderStatus === "placed").length;
  const confirmed = orders.filter((o) => o.orderStatus === "confirmed").length;
  const shipped = orders.filter((o) => o.orderStatus === "shipped").length;
  const delivered = orders.filter((o) => o.orderStatus === "delivered").length;
  const cancelled = orders.filter((o) => o.orderStatus === "cancelled").length;

  const data = {
    labels: ["Placed", "Confirmed", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        data: [placed, confirmed, shipped, delivered, cancelled],
        backgroundColor: [
          "#f59e0b",
          "#3b82f6",
          "#8b5cf6",
          "#22c55e",
          "#ef4444",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 12,
        },
      },
    },
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Orders Status
      </h3>

      <div className="relative h-[200px] sm:h-[240px] lg:h-[280px]">
        <Doughnut key={orders.length} data={data} options={options} />
      </div>
    </div>
  );
};

export default OrdersStatusChart;
