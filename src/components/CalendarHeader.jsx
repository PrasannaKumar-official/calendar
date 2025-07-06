import React from "react";
import dayjs from "dayjs";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const CalendarHeader = ({
  currentDate,
  setCurrentDate,
  view,
  setView,
  setSelectedDate,
  setEvents,
}) => {
  const goToToday = () => {
    const today = dayjs();
    setCurrentDate(today);
    setView("week");
    if (setSelectedDate) setSelectedDate(today);
  };

  const shift = (dir) => {
    const unit = view;
    setCurrentDate((d) => (dir > 0 ? d.add(1, unit) : d.subtract(1, unit)));
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    try {
      const json = JSON.parse(text);
      const parsed = json.map((ev) => {
        const [sh, sm] = ev.startTime.split(":").map(Number);
        const [eh, em] = ev.endTime.split(":").map(Number);
        return {
          ...ev,
          date: dayjs().format("YYYY-MM-DD"),
          startHour: sh,
          startMinute: sm,
          endHour: eh,
          endMinute: em,
          duration: `${ev.startTime} - ${ev.endTime}`,
        };
      });

      setEvents((prev) => [...prev, ...parsed]);
    } catch (err) {
      alert("⚠️ Invalid JSON format.");
      console.error(err);
    }
  };

  return (
    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between mb-4 h-auto sm:h-14 px-2 gap-y-3 sm:gap-y-0">
      {/* Left: Navigation & Label */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap z-10">
        <button
          onClick={goToToday}
          className="px-4 py-1.5 rounded-full border border-gray-400 text-sm font-medium text-black hover:bg-gray-100 transition cursor-pointer"
        >
          Today
        </button>

        <button
          onClick={() => shift(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-400 text-lg font-light hover:bg-gray-100 cursor-pointer"
        >
          ❮
        </button>

        <button
          onClick={() => shift(1)}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-400 text-lg font-light hover:bg-gray-100 cursor-pointer"
        >
          ❯
        </button>

        <div className="ml-2 text-base sm:text-lg font-semibold text-gray-800">
          {getLabel()}
        </div>
      </div>

      {/* Center: View Switcher */}
      <div className="flex justify-center gap-2 sm:absolute sm:left-1/2 sm:-translate-x-1/2 z-0">
        {["day", "week", "month", "year"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition cursor-pointer ${
              view === v
                ? "bg-blue-600 text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* Right: Upload Button */}
      <div className="z-10 flex justify-end">
        <label className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white text-sm px-4 py-1.5 rounded-full shadow-md cursor-pointer transition">
          <CloudUploadIcon style={{ fontSize: "18px" }} />
          Upload JSON
          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>
    </div>
  );
};

export default CalendarHeader;
