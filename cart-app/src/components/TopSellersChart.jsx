import { Bar } from "react-chartjs-2";
import "../utils/chartConfig";

const TopSellersChart = ({ orders }) => {
  const sellerRevenue = {};

  orders.forEach((o) => {
    sellerRevenue[o.sellerId] =
      (sellerRevenue[o.sellerId] || 0) + o.totalAmount;
  });

  const sorted = Object.entries(sellerRevenue)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const data = {
    labels: sorted.map(([id]) => `Seller ${id.slice(-4)}`),
    datasets: [
      {
        data: sorted.map(([, revenue]) => revenue),
        backgroundColor: "#6366f1",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold mb-4 text-gray-700">
        Top Sellers (Revenue)
      </h3>

      <div className="relative h-[260px]">
        <Bar
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

export default TopSellersChart;
