import React from "react";
import dayjs from "dayjs";

const MonthView = ({ currentDate, events }) => {
  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = currentDate.daysInMonth();

  const days = [];

  // Previous month padding
  for (let i = startDay - 1; i >= 0; i--) {
    const day = startOfMonth.subtract(i + 1, "day");
    days.push({ date: day, current: false });
  }

  // Current month days
  for (let i = 0; i < daysInMonth; i++) {
    const day = startOfMonth.add(i, "day");
    days.push({ date: day, current: true });
  }

  // Next month padding to complete grid (up to 42 cells for 6 rows)
  const totalCells = Math.ceil(days.length / 7) * 7;
  const extraDays = totalCells - days.length;
  for (let i = 1; i <= extraDays; i++) {
    const day = endOfMonth.add(i, "day");
    days.push({ date: day, current: false });
  }

  return (
    <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-md overflow-hidden h-[calc(100vh-130px)]">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
        <div
          key={d}
          className="text-center font-semibold bg-white border-b border-gray-200 pb-2 text-base text-gray-800 py-3 tracking-wide uppercase"
        >
          {d}
        </div>
      ))}
      {days.map(({ date, current }, i) => (
        <div
          key={i}
          className={`p-1 text-xs relative border border-gray-200 ${
            current ? "bg-white" : "bg-gray-50 text-gray-400"
          }`}
          style={{ minHeight: "6.5rem" }}
        >
          <div className="text-sm font-medium text-right pr-1">{date.date()}</div>
          <div className="absolute top-6 left-1 right-1 text-xs">
            {events
              .filter((e) => dayjs(e.date).isSame(date, "day"))
              .slice(0, 3)
              .map((e, j) => (
                <div
                  key={j}
                  className="truncate text-white px-1 rounded mb-0.5"
                  style={{ backgroundColor: e.color }}
                >
                  {e.title}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MonthView;