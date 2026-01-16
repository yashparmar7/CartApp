import { Line } from "react-chartjs-2";
import "../utils/chartConfig";

const RevenueOrdersChart = ({ orders }) => {
  const daily = {};

  orders.forEach((o) => {
    const date = new Date(o.createdAt).toISOString().split("T")[0];

    if (!daily[date]) {
      daily[date] = { revenue: 0, count: 0 };
    }

    daily[date].revenue += o.totalAmount;
    daily[date].count += 1;
  });

  const labels = Object.keys(daily).sort((a, b) => new Date(a) - new Date(b));

  const data = {
    labels,
    datasets: [
      {
        label: "Revenue (₹)",
        data: labels.map((l) => daily[l].revenue),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.15)",
        tension: 0.4,
        fill: true,
        pointRadius: 3,
      },
      {
        label: "Orders",
        data: labels.map((l) => daily[l].count),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.15)",
        tension: 0.4,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  // STEP 4: chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            if (ctx.dataset.label.includes("Revenue")) {
              return `Revenue: ₹${ctx.raw.toLocaleString("en-IN")}`;
            }
            return `Orders: ${ctx.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
        },
      },
      y: {
        grid: {
          color: "#f1f5f9",
        },
      },
    },
  };

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold mb-4 text-gray-700">
        Revenue vs Orders
      </h3>

      <div className="relative h-[260px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default RevenueOrdersChart;
