const DateRangeSwitch = ({ value, onChange }) => {
  const ranges = [7, 30, 90];

  return (
    <div className="flex gap-2">
      {ranges.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`px-3 py-1.5 text-sm rounded-lg border transition
            ${
              value === r
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }
          `}
        >
          Last {r} days
        </button>
      ))}
    </div>
  );
};

export default DateRangeSwitch;
