import React from "react";
import dayjs from "dayjs";

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
        <div className="col-span-1 text-right pr-2 text-sm text-gray-600 border-r">
          {hours.map((hr, i) => (
            <div key={i} className="h-16 border-t border-gray-300 pr-2">
              {hr.toString().padStart(2, "0")}:00
            </div>
          ))}
        </div>
        <div className="col-span-5 relative">
          {hours.map((hour, i) => (
            <div
              key={i}
              onContextMenu={(e) => onRightClick(e, currentDate, hour)}
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
                  event.startMinute / 60) *
                4;
              return (
                <div
                  key={i}
                  className="absolute left-2 right-2 mx-auto text-white p-1 rounded shadow"
                  style={{
                    top: `${top}rem`,
                    height: `${duration}rem`,
                    backgroundColor: event.color,
                  }}
                >
                  <div className="text-xs font-semibold">{event.title}</div>
                  <div className="text-xs">{event.duration}</div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default DayView;
