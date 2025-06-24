// ✅ CalendarGrid.jsx with Day View + Week View + Month View + Year View + Event Modal
import React, { useState } from "react";
import dayjs from "dayjs";

const CalendarGrid = ({ events, setEvents }) => {
  const [view, setView] = useState("week");
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [newEventModal, setNewEventModal] = useState(null);
  const [formData, setFormData] = useState({ title: "", startTime: "", endTime: "", date: "" });

  const weekStart = currentDate.startOf("week");
  const days = Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day"));
  const hours = Array.from({ length: 22 }, (_, i) => i + 0);

  const handleRightClick = (e, day, hour) => {
    e.preventDefault();
    setNewEventModal({ x: e.clientX, y: e.clientY, date: day.format("YYYY-MM-DD"), hour });
    setFormData({
      title: "",
      startTime: `${hour.toString().padStart(2, "0")}:00`,
      endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
      date: day.format("YYYY-MM-DD"),
    });
  };

  const handleCreateEvent = () => {
    const [sh, sm] = formData.startTime.split(":" ).map(Number);
    const [eh, em] = formData.endTime.split(":" ).map(Number);
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    const newEvent = {
      title: formData.title,
      date: formData.date,
      time: formData.startTime,
      duration: `${formData.startTime} - ${formData.endTime}`,
      color,
      startTime: formData.startTime,
      endTime: formData.endTime,
      startHour: sh,
      startMinute: sm,
      endHour: eh,
      endMinute: em,
    };
    setEvents((prev) => [...prev, newEvent]);
    setNewEventModal(null);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto p-4 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button className="border px-3 py-1 rounded shadow text-sm" onClick={() => setCurrentDate(dayjs())}>
          Today
        </button>
        <div className="flex gap-2">
          {["Day", "Week", "Month", "Year"].map((label) => (
            <button
              key={label}
              onClick={() => setView(label.toLowerCase())}
              className={`px-3 py-1 rounded ${view === label.toLowerCase() ? "bg-red-500 text-white" : "bg-white border"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <input type="text" placeholder="Search" className="w-48 border rounded px-2 py-1" />
      </div>

      {/* Day View */}
      {view === "day" && (
        <>
          <div className="flex items-center justify-between border-b pb-2 mb-2">
            <div className="text-xl font-bold">
              {currentDate.format("ddd").toUpperCase()} <span className="text-2xl">{currentDate.format("D")}</span>
            </div>
            <div className="text-sm text-gray-600">{Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
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
                  onContextMenu={(e) => handleRightClick(e, currentDate, hour)}
                  className="h-16 border-t border-gray-200 hover:bg-blue-50"
                />
              ))}
              {events
                .filter((event) => dayjs(event.date).isSame(currentDate, "day"))
                .map((event, i) => {
                  const top = (event.startHour + event.startMinute / 60) * 4;
                  const duration =
                    (event.endHour + event.endMinute / 60 - event.startHour - event.startMinute / 60) * 4;
                  return (
                    <div
                      key={i}
                      className="absolute left-2 right-2 mx-auto text-white p-1 rounded shadow"
                      style={{ top: `${top}rem`, height: `${duration}rem`, backgroundColor: event.color }}
                    >
                      <div className="text-xs font-semibold">{event.title}</div>
                      <div className="text-xs">{event.duration}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}

      {/* Week View */}
      {view === "week" && (
        <>
          <div className="grid grid-cols-8 border-b border-gray-300">
            <div></div>
            {days.map((day, i) => (
              <div key={i} className="text-center font-semibold py-2">
                {day.format("ddd, MMM D")}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-8 h-[calc(100vh-130px)] overflow-y-auto relative">
            <div className="border-r border-gray-300 text-right pr-2 text-sm text-gray-600">
              {hours.map((hr, i) => (
                <div key={i} className="h-16 border-t">
                  {hr.toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>
            {days.map((day, dayIdx) => (
              <div key={dayIdx} className="border-l border-gray-200 relative">
                {hours.map((hour, hourIdx) => (
                  <div
                    key={hourIdx}
                    className="h-16 border-t border-gray-200 hover:bg-blue-50"
                    onContextMenu={(e) => handleRightClick(e, day, hour)}
                  ></div>
                ))}
                {events
                  .filter((event) => dayjs(event.date).isSame(day, "day"))
                  .map((event, i) => {
                    const top = (event.startHour + event.startMinute / 60) * 4;
                    const duration =
                      (event.endHour + event.endMinute / 60 - event.startHour - event.startMinute / 60) * 4;
                    return (
                      <div
                        key={i}
                        className="absolute left-0 right-0 mx-1 text-white p-1 rounded shadow"
                        style={{ top: `${top}rem`, height: `${duration}rem`, backgroundColor: event.color }}
                      >
                        <div className="text-xs font-semibold">{event.title}</div>
                        <div className="text-xs">{event.duration}</div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Month View */}
      {view === "month" && (
        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center font-bold border-b pb-1">
              {d}
            </div>
          ))}
          {Array.from({ length: currentDate.startOf("month").day() }).map((_, i) => (
            <div key={`empty-${i}`} className="h-24 bg-gray-100"></div>
          ))}
          {Array.from({ length: currentDate.daysInMonth() }, (_, i) => {
            const date = currentDate.date(i + 1);
            return (
              <div key={i} className="h-24 border p-1 relative">
                <div className="text-sm font-semibold">{i + 1}</div>
                <div className="absolute top-5 left-1 right-1 text-xs">
                  {events
                    .filter((e) => dayjs(e.date).isSame(date, "day"))
                    .slice(0, 3)
                    .map((e, j) => (
                      <div key={j} className="truncate text-white px-1 rounded mb-0.5" style={{ backgroundColor: e.color }}>
                        {e.title}
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Year View */}
      {view === "year" && (
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 12 }, (_, i) => {
            const monthDate = currentDate.month(i);
            return (
              <div key={i} className="p-2 border rounded shadow bg-white">
                <div className="font-bold text-center mb-2">{monthDate.format("MMMM")}</div>
                <div className="grid grid-cols-7 text-xs gap-0.5">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                    <div key={d} className="text-center font-medium text-gray-500">{d}</div>
                  ))}
                  {Array.from({ length: monthDate.startOf("month").day() }).map((_, i) => (
                    <div key={`space-${i}`}></div>
                  ))}
                  {Array.from({ length: monthDate.daysInMonth() }, (_, d) => {
                    const dateObj = monthDate.date(d + 1);
                    const hasEvent = events.some((e) => dayjs(e.date).isSame(dateObj, "day"));
                    return (
                      <div key={d} className="text-center">
                        <div className={`inline-block w-5 h-5 rounded-full ${hasEvent ? "bg-red-400" : ""}`}>{d + 1}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {newEventModal && (
        <div
          className="absolute bg-white p-4 border rounded shadow z-50 w-64"
          style={{ top: newEventModal.y, left: newEventModal.x }}
        >
          <h3 className="font-semibold mb-2">Add Event</h3>
          <input
            type="text"
            placeholder="Event Title"
            className="w-full border mb-2 px-2 py-1"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <input
            type="time"
            className="w-full border mb-2 px-2 py-1"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
          />
          <input
            type="time"
            className="w-full border mb-2 px-2 py-1"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
          />
          <input
            type="date"
            className="w-full border mb-2 px-2 py-1"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <button onClick={handleCreateEvent} className="bg-blue-500 text-white w-full py-1 rounded">
            Add Event
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarGrid;
