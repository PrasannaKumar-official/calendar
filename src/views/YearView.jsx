import React, { useState } from "react";
import dayjs from "dayjs";

const YearView = ({ currentDate, events }) => {
  const year = currentDate.year();
  const today = dayjs();
  const [hovered, setHovered] = useState(null); // { id, date, events }

  return (
    <div className="grid grid-cols-4 gap-6 px-6 py-4 min-h-[calc(100vh-3rem)] pb-20">
      {Array.from({ length: 12 }, (_, monthIdx) => {
        const monthDate = dayjs(`${year}-${monthIdx + 1}-01`);
        const startDay = monthDate.startOf("month").day();
        const daysInMonth = monthDate.daysInMonth();

        return (
          <div
            key={monthIdx}
            className="p-4 bg-white rounded-lg border border-gray-200 relative"
          >
            {/* Month Name */}
            <div className="text-center text-sm font-semibold text-red-500 mb-3 cursor-pointer">
              {monthDate.format("MMMM")}
            </div>

            {/* Weekday Initials */}
            <div className="grid grid-cols-7 text-xs text-gray-500 gap-y-1 mb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                <div key={d} className="text-center font-medium">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 text-sm text-center text-gray-800 gap-y-1">
              {/* Empty slots before 1st of month */}
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`sp-${i}`} className="text-gray-300">•</div>
              ))}

              {/* Actual days */}
              {Array.from({ length: daysInMonth }, (_, dayIdx) => {
                const dateObj = monthDate.date(dayIdx + 1);
                const cellEvents = events.filter((e) =>
                  dayjs(e.date).isSame(dateObj, "day")
                );
                const isToday = dateObj.isSame(today, "day");
                const id = `${monthIdx}-${dayIdx}`;

                return (
                  <div
                    key={dayIdx}
                    className="relative inline-flex justify-center group"
                    onMouseEnter={() =>
                      setHovered({
                        id,
                        date: dateObj.format("MMM D, YYYY"),
                        events: cellEvents,
                      })
                    }
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div
                      className={`w-6 h-6 flex items-center justify-center text-sm rounded-full cursor-pointer transition
                        ${isToday
                          ? "bg-red-500 text-white"
                          : cellEvents.length
                          ? "bg-yellow-200 text-black font-semibold"
                          : ""}`}
                    >
                      {dayIdx + 1}
                    </div>

                    {/* Tooltip: normal below OR right if month in last row */}
                    {hovered?.id === id && (
                      <div
                        className={`absolute z-10 ${
                          monthIdx >= 9
                            ? "bottom-8 left-full ml-2"
                            : "top-8 left-1/2 -translate-x-1/2"
                        } w-48 bg-white border border-gray-300 rounded shadow text-xs p-2
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                      >
                        <div className="font-semibold mb-1 text-center">
                          {hovered.date}
                        </div>
                        {hovered.events.length === 0 ? (
                          <div className="text-center italic text-gray-400">
                            No events
                          </div>
                        ) : (
                          hovered.events.map((ev, i) => (
                            <div key={i} className="mb-1">
                              <div className="text-gray-900 font-medium">
                                {ev.title}
                              </div>
                              <div className="text-gray-500">
                                {ev.duration}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default YearView;
