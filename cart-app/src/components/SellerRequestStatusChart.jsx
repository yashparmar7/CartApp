import { Doughnut } from "react-chartjs-2";
import "../utils/chartConfig";

const SellerRequestStatusChart = ({ requests }) => {
  const approved = requests.filter((r) => r.status === "APPROVED").length;
  const pending = requests.filter((r) => r.status === "PENDING").length;
  const rejected = requests.filter((r) => r.status === "REJECTED").length;

  const data = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: [approved, pending, rejected],
        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Seller Requests Status
      </h3>

      <div className="relative h-[220px]">
        <Doughnut
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default SellerRequestStatusChart;
