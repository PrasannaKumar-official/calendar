import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import CalendarGrid from "./components/CalendarGrid";
import initialEvents from "./data/events.json";
import dayjs from "dayjs";

const App = () => {
  const [events, setEvents] = useState(initialEvents || []);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [view, setView] = useState("week");
  const [selectedDate, setSelectedDate] = useState(dayjs()); // ✅ Added

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        events={events}
        setEvents={setEvents}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        setView={setView}
        selectedDate={selectedDate} // ✅ Now works
        setSelectedDate={setSelectedDate}
      />

      <CalendarGrid
        events={events}
        setEvents={setEvents}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        view={view}
        setView={setView}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
};

export default App;
