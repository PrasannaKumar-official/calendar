import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import CalendarGrid from "./components/CalendarGrid";
import initialEvents from "./data/events.json";

const App = () => {
  const [events, setEvents] = useState(initialEvents || []);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar events={events} setEvents={setEvents} />
      <CalendarGrid events={events} setEvents={setEvents} />
    </div>
  );
};

export default App;
