import React, { useState } from "react";
import dayjs from "dayjs";

const Sidebar = ({ events, setEvents }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const today = dayjs();

  const startDay = currentMonth.startOf("month").day();
  const daysInMonth = currentMonth.daysInMonth();

  const grouped = events.reduce((acc, e) => {
    acc[e.date] = acc[e.date] || [];
    acc[e.date].push(e);
    return acc;
  }, {});

  return (
    <div className="w-72 bg-black text-white p-4 h-screen flex flex-col">
      <button className="mb-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded" onClick={() => {
        const date = today.format("YYYY-MM-DD");
        const startTime = today.format("HH:00");
        const endTime = today.add(1, "hour").format("HH:00");
        const color = "#34D399";
        setEvents(e => [
          ...e,
          { title: "New Event", date, startTime, endTime, duration: `${startTime}-${endTime}`, color, startHour: parseInt(startTime), startMinute:0, endHour: parseInt(endTime), endMinute:0 }
        ]);
      }}>
        + Create Event
      </button>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">{currentMonth.format("MMMM YYYY")}</h2>
        <div className="space-x-2">
          <button onClick={() => setCurrentMonth(m => m.subtract(1, "month"))}>&lt;</button>
          <button onClick={() => setCurrentMonth(m => m.add(1, "month"))}>&gt;</button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-center text-sm text-gray-300 mb-2">
        {["S","M","T","W","T","F","S"].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 text-center text-sm mb-4">
        {Array(startDay).fill().map((_,i) => <div key={i}></div>)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const d = currentMonth.date(i+1);
          const isToday = d.isSame(today, "day");
          return <div key={i} className={`p-1 rounded-full ${isToday?"bg-blue-500":""}`}>{i+1}</div>;
        })}
      </div>
      <div className="mt-4 overflow-auto">
        {Object.entries(grouped).map(([date, dayEvents]) => (
          <div key={date} className="mb-3">
            <h3 className="text-sm font-semibold">{dayjs(date).format("ddd, MMM D")}</h3>
            <ul className="mt-1 pl-2 border-l border-gray-700">
              {dayEvents.map((ev,i) => (
                <li key={i} className="text-sm">
                  <span className="inline-block w-2 h-2 rounded-full mr-2" style={{backgroundColor:ev.color}}></span>
                  {ev.title} <span className="text-gray-400">({ev.time})</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Sidebar;
