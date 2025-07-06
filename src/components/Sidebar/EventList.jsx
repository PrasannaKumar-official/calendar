import React from "react";
import dayjs from "dayjs";

const EventList = ({ events, selectedDate }) => {
  const today = dayjs();
  const tomorrow = today.add(1, "day");

  const isSameDay = (date1, date2) =>
    dayjs(date1).isValid() && dayjs(date1).isSame(date2, "day");

  const todayEvents = events.filter((e) => isSameDay(e.date, today));
  const tomorrowEvents = events.filter((e) => isSameDay(e.date, tomorrow));
  const upcomingEvents = events.filter((e) =>
    dayjs(e.date).isAfter(tomorrow, "day")
  );

  const padTime = (t) => {
    const [h, m = "00"] = t.split(":");
    return `${h.toString().padStart(2, "0")}:${m.padStart(2, "0")}`;
  };

  const formatEventTime = (event) => {
    const date = dayjs(event.date);
    const startTime = padTime(event.startTime);
    const endTime = padTime(event.endTime);

    const start = dayjs(`${event.date}T${startTime}`);
    const end = dayjs(`${event.date}T${endTime}`);

    if (!date.isValid() || !start.isValid() || !end.isValid()) return "Invalid Date";

    return `${date.format("ddd, MMM D")} • ${start.format("h:mm A")} - ${end.format("h:mm A")}`;
  };

  const renderEvents = (eventArray) =>
    eventArray.length === 0 ? (
      <div className="text-gray-400 text-sm italic">No Events</div>
    ) : (
      eventArray.map((e, i) => (
        <div
          key={i}
          className="border-l-4 pl-3 mb-3 py-2 bg-white/5 rounded-md transition hover:bg-white/10 cursor-pointer"
          style={{ borderColor: e.color }}
        >
          <div className="text-xs text-gray-300">{formatEventTime(e)}</div>
          <div
            className="text-sm font-semibold truncate"
            style={{ color: e.color }}
          >
            {e.title}
          </div>
        </div>
      ))
    );

  return (
    <div className="text-sm">
      <div className="mb-4">
        <h3 className="text-white font-bold text-base mb-2">Today</h3>
        {renderEvents(todayEvents)}
      </div>
      <div className="mb-4">
        <h3 className="text-white font-bold text-base mb-2">Tomorrow</h3>
        {renderEvents(tomorrowEvents)}
      </div>
      <div>
        <h3 className="text-white font-bold text-base mb-2">Upcoming</h3>
        {renderEvents(upcomingEvents)}
      </div>
    </div>
  );
};

export default EventList;
