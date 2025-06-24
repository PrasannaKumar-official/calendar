import React, { useState } from "react";
import dayjs from "dayjs";
import { FaClock, FaEdit, FaTrash } from "react-icons/fa";

const Sidebar = ({ events, setEvents }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [editEvent, setEditEvent] = useState(null);
  const [formData, setFormData] = useState({ title: "", time: "", duration: "" });

  const startOfMonth = currentMonth.startOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = currentMonth.daysInMonth();
  const today = dayjs();

  const handlePrevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {});

  const deleteEvent = (target) => {
    setEvents(events.filter((e) => e !== target));
  };

  const openEditForm = (event) => {
    setEditEvent(event);
    setFormData({ title: event.title, time: event.time, duration: event.duration });
  };

  const handleEditSubmit = () => {
    if (!formData.title) return;
    const updated = events.map((e) => (e === editEvent ? { ...e, ...formData } : e));
    setEvents(updated);
    setEditEvent(null);
    setFormData({ title: "", time: "", duration: "" });
  };

  return (
    <div className="w-72 bg-black text-white p-4 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">{currentMonth.format("MMMM YYYY")}</h2>
        <div className="space-x-2">
          <button onClick={handlePrevMonth} className="px-2">{"<"}</button>
          <button onClick={handleNextMonth} className="px-2">{">"}</button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-sm text-gray-300 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 text-center text-sm mb-4">
        {Array.from({ length: startDay }).map((_, idx) => <div key={idx}></div>)}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dateObj = currentMonth.date(idx + 1);
          const isToday = dateObj.isSame(today, "day");
          return (
            <div key={idx} className={`p-1 rounded-full ${isToday ? "bg-blue-500 text-white font-bold" : ""}`}>{idx + 1}</div>
          );
        })}
      </div>

      <div className="mt-4 space-y-4 overflow-y-auto">
        {Object.keys(groupedEvents).map((date) => (
          <div key={date}>
            <h3 className="text-sm font-semibold text-gray-300">{dayjs(date).format("dddd, MMM D")}</h3>
            <ul className="pl-2 border-l border-gray-700 mt-1 space-y-2">
              {groupedEvents[date].map((event, i) => (
                <li key={i} className="text-sm bg-gray-800 p-2 rounded relative">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      <span className="font-medium text-white">{event.title}</span>
                      <p className="text-gray-400 text-xs ml-4 flex items-center gap-1">
                        <FaClock className="text-blue-400" /> {event.time} ({event.duration})
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <FaEdit className="text-yellow-400 cursor-pointer" onClick={() => openEditForm(event)} />
                      <FaTrash className="text-red-500 cursor-pointer" onClick={() => deleteEvent(event)} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {editEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white text-black p-4 rounded shadow-md w-80">
            <h2 className="text-lg font-semibold mb-2">Edit Event</h2>
            <input
              type="text"
              placeholder="Event Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border px-2 py-1 mb-2"
            />
            <input
              type="text"
              placeholder="Time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full border px-2 py-1 mb-2"
            />
            <input
              type="text"
              placeholder="Duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full border px-2 py-1 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditEvent(null)} className="px-3 py-1 border rounded">
                Cancel
              </button>
              <button onClick={handleEditSubmit} className="px-3 py-1 bg-blue-500 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;