const StepProgress = ({ step }) => {
  const steps = ["Address", "Payment", "Done"];

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between">
        {steps.map((label, index) => {
          const current = index + 1;
          const active = step === current;
          const completed = step > current;

          return (
            <div key={label} className="flex-1 flex items-center">
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-sm font-semibold
                ${
                  completed
                    ? "bg-green-500 text-white"
                    : active
                    ? "bg-red-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {completed ? "✓" : current}
              </div>

              <span
                className={`ml-2 text-xs sm:text-sm font-medium
                ${active ? "text-red-600" : "text-gray-500"}`}
              >
                {label}
              </span>

              {index !== steps.length - 1 && (
                <div className="flex-1 h-[2px] mx-2 sm:mx-4 bg-gray-300" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
