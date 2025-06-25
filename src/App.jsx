import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import CalendarGrid from "./components/CalendarGrid";
import initialEvents from "./data/events.json";
import dayjs from "dayjs";

const App = () => {
  const [events, setEvents] = useState(initialEvents || []);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [view, setView] = useState("week"); // 👈 Add this

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        events={events}
        setEvents={setEvents}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        setView={setView}
      />
      <CalendarGrid
        events={events}
        setEvents={setEvents}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        view={view}
        setView={setView}
      />
    </div>
  );
};

export default App;
