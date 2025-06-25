import React from "react";
import dayjs from "dayjs";

// Convert hex to RGBA
const hexToRgba = (hex, alpha = 0.7) => {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const formatTime12 = (t) => {
  const [h, m] = t.split(":").map(Number);
  const isPM = h >= 12;
  const displayHour = h % 12 || 12;
  return `${displayHour}:${m.toString().padStart(2, "0")} ${isPM ? "PM" : "AM"}`;
};

const DayView = ({ currentDate, events, onRightClick, onEventClick }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-2 mb-2">
        <div className="text-xl font-bold">
          {currentDate.format("ddd").toUpperCase()}{" "}
          <span className="text-2xl">{currentDate.format("D")}</span>
        </div>
        <div className="text-sm text-gray-600">
          {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="grid grid-cols-6 relative min-h-[1600px]">
        {/* Time column */}
        <div className="col-span-1 text-right pr-2 text-sm text-gray-600 border-r">
          {hours.map((hr) => (
            <div key={hr} className="h-16 border-t border-gray-300 pr-2">
              {hr.toString().padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {/* Slots and Events */}
        <div className="col-span-5 relative">
          {hours.map((hour) => (
            <div
              key={hour}
              onContextMenu={(e) => onRightClick(e, currentDate, hour)}
              onClick={(e) => onRightClick(e, currentDate, hour)}
              className="h-16 border-t border-gray-200 hover:bg-blue-50"
            />
          ))}

          {/* Events */}
          {events
            .filter((event) => dayjs(event.date).isSame(currentDate, "day"))
            .map((event, i) => {
              const top = (event.startHour + event.startMinute / 60) * 4;
              const duration =
                (event.endHour + event.endMinute / 60 - event.startHour - event.startMinute / 60) * 4;

              const fontSize =
                duration > 3
                  ? "text-lg"
                  : duration > 2
                  ? "text-base"
                  : duration > 1
                  ? "text-sm"
                  : "text-xs";

              return (
                <div
                  key={i}
                  onClick={() => onEventClick(event)} 
                  className={`cursor-pointer absolute left-2 right-2 mx-auto text-white text-opacity-90 p-2.5 rounded-lg shadow-sm font-medium ${fontSize}`}
                  style={{
                    top: `${top}rem`,
                    height: `${duration}rem`,
                    backgroundColor: hexToRgba(event.color, 0.7),
                  }}
                >
                  <div className="text-lg font-bold leading-tight truncate">
                    {event.title}
                  </div>
                  <div className="text-sm font-medium opacity-90">
                    {formatTime12(event.startTime)} - {formatTime12(event.endTime)}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default DayView;
