// src/components/Sidebar/EventList.jsx
import React from "react";
import dayjs from "dayjs";

const EventList = ({ events, selectedDate }) => {
  const today = dayjs();
  const tomorrow = today.add(1, "day");

  const isSameDay = (date1, date2) => dayjs(date1).isSame(date2, "day");

  const todayEvents = events.filter((e) => isSameDay(e.date, today));
  const tomorrowEvents = events.filter((e) => isSameDay(e.date, tomorrow));
  const upcomingEvents = events.filter(
    (e) => dayjs(e.date).isAfter(tomorrow, "day")
  );

  const renderEvents = (eventArray) =>
    eventArray.length === 0 ? (
      <div className="text-gray-500 text-xs">No Events</div>
    ) : (
      eventArray.map((e, i) => (
        <div key={i} className="border-l-4 pl-3 mb-2" style={{ borderColor: e.color }}>
          <div className="text-xs text-gray-400">
            {dayjs(`${e.date}T${e.startTime}`).format("ddd, MMM D")} •{" "}
            {dayjs(`${e.date}T${e.startTime}`).format("h:mm A")} -{" "}
            {dayjs(`${e.date}T${e.endTime}`).format("h:mm A")}
          </div>
          <div className="text-base font-semibold truncate" style={{ color: e.color }}>
            {e.title}
          </div>
        </div>
      ))
    );

  return (
    <div className="text-sm">
      <div className="mb-4">
        <h3 className="text-white font-semibold text-lg mb-2">Today</h3>
        {renderEvents(todayEvents)}
      </div>
      <div className="mb-4">
        <h3 className="text-white font-semibold text-lg mb-2">Tomorrow</h3>
        {renderEvents(tomorrowEvents)}
      </div>
      <div>
        <h3 className="text-white font-semibold text-lg mb-2">Upcoming</h3>
        {renderEvents(upcomingEvents)}
      </div>
    </div>
  );
};

export default EventList;
