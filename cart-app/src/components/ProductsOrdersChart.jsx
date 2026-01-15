import { Bar } from "react-chartjs-2";
import "../utils/chartConfig";

const ProductsOrdersChart = ({ productsCount, ordersCount }) => {
  const data = {
    labels: ["Products", "Orders"],
    datasets: [
      {
        label: "Count",
        data: [productsCount, ordersCount],
        backgroundColor: ["#3b82f6", "#ef4444"],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Products vs Orders
      </h3>

      <div className="relative h-[220px]">
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: { ticks: { precision: 0 } },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ProductsOrdersChart;
