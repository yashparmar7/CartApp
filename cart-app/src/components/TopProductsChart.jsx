import { Bar } from "react-chartjs-2";
import "../utils/chartConfig";

const TopProductsChart = ({ orders }) => {
  const productRevenue = {};

  orders.forEach((o) => {
    o.items.forEach((item) => {
      productRevenue[item.title] =
        (productRevenue[item.title] || 0) + item.price * item.quantity;
    });
  });

  const sorted = Object.entries(productRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const data = {
    labels: sorted.map(([name]) => name),
    datasets: [
      {
        data: sorted.map(([, revenue]) => revenue),
        backgroundColor: "#22c55e",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="bg-white border border-gray-200  rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold mb-4 text-gray-700">
        Top Products (Revenue)
      </h3>

      <div className="relative h-[260px]">
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            indexAxis: "y",
          }}
        />
      </div>
    </div>
  );
};

export default TopProductsChart;
