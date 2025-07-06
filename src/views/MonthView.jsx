import React from "react";
import dayjs from "dayjs";

// Utility to format 24-hour to 12-hour time
const formatTime12 = (t) => {
  const [h, m] = t.split(":").map(Number);
  const isPM = h >= 12;
  const displayHour = h % 12 || 12;
  return `${displayHour}:${m.toString().padStart(2, "0")} ${isPM ? "PM" : "AM"}`;
};

const MonthView = ({ currentDate, events, onRightClick, onEventClick }) => {
  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = currentDate.daysInMonth();

  const days = [];

  // Fill previous month's padding days
  for (let i = startDay - 1; i >= 0; i--) {
    const day = startOfMonth.subtract(i + 1, "day");
    days.push({ date: day, current: false });
  }

  // Fill current month's days
  for (let i = 0; i < daysInMonth; i++) {
    const day = startOfMonth.add(i, "day");
    days.push({ date: day, current: true });
  }

  // Fill next month's padding days to complete 6 weeks grid (42 cells)
  const totalCells = Math.ceil(days.length / 7) * 7;
  const extraDays = totalCells - days.length;
  for (let i = 1; i <= extraDays; i++) {
    const day = endOfMonth.add(i, "day");
    days.push({ date: day, current: false });
  }

  return (
    <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-md overflow-hidden h-[calc(100vh-130px)]">
      {/* Day headings */}
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
        <div
          key={d}
          className="text-center font-semibold bg-white border-b border-gray-200 pb-2 text-base text-gray-800 py-3 tracking-wide uppercase"
        >
          {d}
        </div>
      ))}

      {/* Calendar cells */}
      {days.map(({ date, current }, i) => {
        const dayEvents = events.filter((e) => dayjs(e.date).isSame(date, "day")).slice(0, 3);
        const eventCount = dayEvents.length;

        const fontSize =
          eventCount === 1 ? "text-[0.95rem]" :
          eventCount === 2 ? "text-sm" : "text-xs";

        const padding =
          eventCount === 1 ? "py-1 px-2" :
          eventCount === 2 ? "py-1 px-1.5" : "py-0.5 px-1";

        return (
          <div
            key={i}
            className={`p-1 text-xs relative border border-gray-200 cursor-pointer ${
              current ? "bg-white" : "bg-gray-50 text-gray-400"
            }`}
            style={{ minHeight: "6.5rem" }}
            onClick={(e) => onRightClick(e, date, 9)} // Default 9AM
          >
            <div className="text-sm font-medium text-right pr-1">{date.date()}</div>

            {/* Events */}
            <div className="absolute top-6 left-1 right-1 space-y-1">
              {dayEvents.map((e, j) => (
                <div
                  key={j}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    onEventClick(e); // ✅ Show popup
                  }}
                  className={`rounded-md text-white font-semibold shadow-sm truncate ${padding} ${fontSize}`}
                  style={{ backgroundColor: e.color }}
                  title={`${e.title} (${formatTime12(e.startTime)} - ${formatTime12(e.endTime)})`}
                >
                  <div>{e.title}</div>
                  <div className="opacity-90 text-[0.7rem]">{formatTime12(e.startTime)}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MonthView;
