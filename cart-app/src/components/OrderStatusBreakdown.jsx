import { Bar } from "react-chartjs-2";
import "../utils/chartConfig";

const OrderStatusBreakdown = ({ orders }) => {
  const statusCount = {
    placed: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  orders.forEach((o) => {
    statusCount[o.orderStatus] = (statusCount[o.orderStatus] || 0) + 1;
  });

  const data = {
    labels: Object.keys(statusCount),
    datasets: [
      {
        data: Object.values(statusCount),
        backgroundColor: "#6366f1",
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Order Status Breakdown
      </h3>

      <div className="relative h-[260px]">
        <Bar
          data={data}
          options={{
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
          }}
        />
      </div>
    </div>
  );
};

export default OrderStatusBreakdown;
