import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import CalendarGrid from "./components/CalendarGrid";
import eventsData from "./data/events.json";

const App = () => {
  const [events, setEvents] = useState([]); // Global event state

  useEffect(() => {
    // Normalize JSON format to include required fields
    const normalized = eventsData.map((e) => ({
      title: e.title,
      date: e.date || new Date().toISOString().slice(0, 10),
      time: e.startTime,
      duration: `${e.startTime} - ${e.endTime}`,
      color: e.color || "#3b82f6",
      startTime: e.startTime,
      endTime: e.endTime,
    }));
    setEvents(normalized);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar events={events} setEvents={setEvents} />
      <CalendarGrid events={events} setEvents={setEvents} />
    </div>
  );
};

export default App;