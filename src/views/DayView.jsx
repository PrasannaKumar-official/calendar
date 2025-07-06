import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";

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

const isOverlapping = (a, b) => {
  const startA = dayjs(`${a.date}T${a.startTime}`);
  const endA = dayjs(`${a.date}T${a.endTime}`);
  const startB = dayjs(`${b.date}T${b.startTime}`);
  const endB = dayjs(`${b.date}T${b.endTime}`);
  return startA.isBefore(endB) && endA.isAfter(startB);
};

const groupOverlappingEvents = (dayEvents) => {
  const columns = [];

  dayEvents.forEach((ev) => {
    let placed = false;
    for (const col of columns) {
      if (!col.some((e) => isOverlapping(e, ev))) {
        col.push(ev);
        placed = true;
        break;
      }
    }
    if (!placed) {
      columns.push([ev]);
    }
  });

  return columns;
};

const DayView = ({ currentDate, events, onRightClick, onEventClick }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const todayEvents = events.filter((e) =>
    dayjs(e.date).isSame(currentDate, "day")
  );
  const columns = groupOverlappingEvents(todayEvents);
  const totalColumns = columns.length;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentDate.format("YYYY-MM-DD")} // ⬅️ key makes animation rerun
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
      >
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

          {/* Time slots */}
          <div className="col-span-5 relative">
            {hours.map((hour) => (
              <div
                key={hour}
                onContextMenu={(e) => onRightClick(e, currentDate, hour)}
                onClick={(e) => onRightClick(e, currentDate, hour)}
                className="h-16 border-t border-gray-200 hover:bg-blue-50 cursor-pointer transition"
              />
            ))}

            {/* Render overlapping events */}
            {columns.map((column, colIndex) =>
              column.map((event, i) => {
                const [sh, sm] = event.startTime?.split(":").map(Number) || [0, 0];
                const [eh, em] = event.endTime?.split(":").map(Number) || [0, 0];

                const startHour = event.startHour ?? sh;
                const startMinute = event.startMinute ?? sm;
                const endHour = event.endHour ?? eh;
                const endMinute = event.endMinute ?? em;

                const top = (startHour + startMinute / 60) * 4;
                const duration =
                  (endHour + endMinute / 60 - startHour - startMinute / 60) * 4;

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
                    key={`${event.title}-${i}-${colIndex}`}
                    onClick={() => onEventClick(event)}
                    className={`cursor-pointer absolute text-white text-opacity-90 p-2.5 rounded-lg shadow-sm font-medium ${fontSize}`}
                    style={{
                      top: `${top}rem`,
                      height: `${duration}rem`,
                      backgroundColor: hexToRgba(event.color, 0.7),
                      left: `${(colIndex / totalColumns) * 100}%`,
                      width: `${100 / totalColumns}%`,
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
              })
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DayView;
