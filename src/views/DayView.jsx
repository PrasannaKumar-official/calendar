import React from "react";
import dayjs from "dayjs";

const formatTime12 = (t) => {
  const [h, m] = t.split(":").map(Number);
  const isPM = h >= 12;
  const displayHour = h % 12 || 12;
  return `${displayHour}:${m.toString().padStart(2, "0")} ${isPM ? "PM" : "AM"}`;
};

const DayView = ({ currentDate, events, onRightClick }) => {
  const hours = Array.from({ length: 22 }, (_, i) => i);

  return (
    <>
      <div className="flex items-center justify-between border-b pb-2 mb-2">
        <div className="text-xl font-bold">
          {currentDate.format("ddd").toUpperCase()}{" "}
          <span className="text-2xl">{currentDate.format("D")}</span>
        </div>
        <div className="text-sm text-gray-600">
          {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </div>
      </div>

      <div className="grid grid-cols-6">
        {/* Time column */}
        <div className="col-span-1 text-right pr-2 text-sm text-gray-600 border-r">
          {hours.map((hr, i) => (
            <div key={i} className="h-16 border-t border-gray-300 pr-2">
              {hr.toString().padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {/* Grid with events */}
        <div className="col-span-5 relative">
          {hours.map((hour, i) => (
            <div
              key={i}
              onContextMenu={(e) => onRightClick(e, currentDate, hour)}
              onClick={(e) => onRightClick(e, currentDate, hour)} // Left-click enabled
              className="h-16 border-t border-gray-200 hover:bg-blue-50"
            />
          ))}

          {events
            .filter((event) => dayjs(event.date).isSame(currentDate, "day"))
            .map((event, i) => {
              const top = (event.startHour + event.startMinute / 60) * 4;
              const duration =
                (event.endHour + event.endMinute / 60 -
                  event.startHour -
                  event.startMinute / 60) * 4;

              const fontSize =
                duration > 2.5
                  ? "text-base"
                  : duration > 1.5
                  ? "text-sm"
                  : "text-xs";

              return (
                <div
                  key={i}
                  className={`absolute left-2 right-2 mx-auto text-white p-2 rounded-lg shadow font-semibold ${fontSize}`}
                  style={{
                    top: `${top}rem`,
                    height: `${duration}rem`,
                    backgroundColor: event.color,
                  }}
                >
                  <div className="truncate">{event.title}</div>
                  <div className="text-[0.75rem] opacity-90 font-normal">
                    {formatTime12(event.startTime)} - {formatTime12(event.endTime)}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default DayView;
