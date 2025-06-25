import React from "react";
import dayjs from "dayjs";

const CalendarHeader = ({
  currentDate,
  setCurrentDate,
  view,
  setView,
  setSelectedDate,
}) => {
  const goToToday = () => {
    const today = dayjs();
    setCurrentDate(today);
    setView("week");
    if (setSelectedDate) {
      setSelectedDate(today);
    }
  };

  const shift = (dir) => {
    const unit = view;
    setCurrentDate((d) =>
      dir > 0 ? d.add(1, unit) : d.subtract(1, unit)
    );
  };

  const getLabel = () => {
    if (!currentDate || !dayjs.isDayjs(currentDate)) return "";

    switch (view) {
      case "day":
        return currentDate.format("dddd, MMMM D, YYYY");
      case "week":
        return `${currentDate.startOf("week").format("MMM D")} - ${currentDate
          .endOf("week")
          .format("MMM D, YYYY")}`;
      case "month":
        return currentDate.format("MMMM YYYY");
      case "year":
        return currentDate.format("YYYY");
      default:
        return "";
    }
  };

  return (
    <div className="relative flex items-center justify-between mb-4 h-12">
      {/* Left: Navigation & Label */}
      <div className="flex items-center gap-3 z-10">
        <button
          onClick={goToToday}
          className="px-4 py-1.5 rounded-full border border-gray-400 text-sm font-medium text-black hover:bg-gray-100 transition"
        >
          Today
        </button>
        <button
          onClick={() => shift(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-400 text-lg font-light hover:bg-gray-100"
        >
          ❮
        </button>
        <button
          onClick={() => shift(1)}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-400 text-lg font-light hover:bg-gray-100"
        >
          ❯
        </button>
        <div className="ml-4 text-lg font-semibold text-gray-800">
          {getLabel()}
        </div>
      </div>

      {/* Center: View Switcher - Fixed Position */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-2 z-0">
        {["day", "week", "month", "year"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
              view === v
                ? "bg-red-500 text-white"
                : "border border-gray-200 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarHeader;
