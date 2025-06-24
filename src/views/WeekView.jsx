import React from "react";
import dayjs from "dayjs";

const WeekView = ({ currentDate, events = [], onRightClick, onEdit }) => {
  const days = Array.from({ length: 7 }, (_, i) =>
    currentDate.startOf("week").add(i, "day")
  );
  const hours = Array.from({ length: 23 }, (_, i) => i);
  const today = dayjs();

  return (
    <>
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div></div>
        {days.map((d, i) => (
          <div
            key={i}
            className={`text-center py-3 font-semibold text-base tracking-wide uppercase ${
              d.isSame(today, "day") ? "text-red-500" : "text-gray-800"
            }`}
          >
            {d.format("ddd, MMM D")}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-8 h-[calc(100vh-130px)] overflow-auto relative">
        {/* Time Column */}
        <div className="border-r border-gray-200 pr-2 text-right text-sm text-gray-500">
          {hours.map((h, i) => (
            <div key={i} className="h-16 border-t border-gray-200">
              {`${h.toString().padStart(2, "0")}:00`}
            </div>
          ))}
        </div>

        {/* Day Columns */}
        {days.map((d, di) => (
          <div
            key={di}
            className={`border-l border-gray-200 relative ${
              d.isSame(today, "day") ? "bg-blue-50" : ""
            }`}
          >
            {hours.map((h, hi) => (
              <div
                key={hi}
                className="h-16 border-t border-gray-200 hover:bg-gray-50 transition"
                onContextMenu={(e) => onRightClick(e, d, h)}
                onClick={(e) => onRightClick(e, d, h)}
              />
            ))}

            {/* Events for the day */}
{(events || [])
  .filter((e) => dayjs(e.date).isSame(d, "day"))
  .map((ev, i) => {
    const top = (ev.startHour + ev.startMinute / 60) * 4;
    const dur =
      (ev.endHour +
        ev.endMinute / 60 -
        ev.startHour -
        ev.startMinute / 60) * 4;

    // Font size based on duration
    const fontSize =
      dur >= 4
        ? "text-lg"
        : dur >= 2
        ? "text-base"
        : "text-sm";

    return (
      <div
        key={i}
        onClick={() => onEdit?.(ev)}
        className={`absolute left-1 right-1 p-2 rounded-md shadow-sm cursor-pointer overflow-hidden hover:shadow-md ${fontSize} font-bold`}
        style={{
          top: `${top}rem`,
          height: `${dur}rem`,
          backgroundColor: "#e0f2fe",
          color: "#0f172a",
          borderLeft: `4px solid ${ev.color}`,
        }}
      >
        <div className="text-xs text-gray-600 font-medium">
          {dayjs(`${ev.date}T${ev.startTime}`).format("h:mm A")}
        </div>
        <div className="truncate">{ev.title}</div>
      </div>
    );
  })}

          </div>
        ))}
      </div>
    </>
  );
};

export default WeekView;
