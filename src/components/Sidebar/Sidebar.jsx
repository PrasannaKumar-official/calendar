import React, { useState } from "react";
import dayjs from "dayjs";
import CreateButton from "./CreateButton";
import MiniCalendar from "./MiniCalendar";
import EventList from "./EventList";
import EventForm from "../EventForm";

const Sidebar = ({ events, setEvents, setCurrentDate, currentDate, setView }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    date: dayjs().format("YYYY-MM-DD"),
    startTime: "09:00",
    endTime: "10:00",
    color: "#2196f3",
  });

  const resetForm = () => {
    setForm({
      title: "",
      date: dayjs().format("YYYY-MM-DD"),
      startTime: "09:00",
      endTime: "10:00",
      color: "#2196f3",
    });
  };

  const saveEvent = () => {
    const [sh, sm] = form.startTime.split(":").map(Number);
    const [eh, em] = form.endTime.split(":").map(Number);

    const newEvent = {
      title: form.title,
      date: form.date, // must be YYYY-MM-DD
      time: form.startTime,
      duration: `${form.startTime}-${form.endTime}`,
      color: form.color,
      startTime: form.startTime,
      endTime: form.endTime,
      startHour: sh,
      startMinute: sm,
      endHour: eh,
      endMinute: em,
    };

    if (!form.title.trim()) return; // prevent empty titles

    setEvents((prev) => [...prev, newEvent]); // ✅ global event update

    // Reset form
    setShowForm(false);
    setForm({
      title: "",
      date: dayjs().format("YYYY-MM-DD"),
      startTime: "09:00",
      endTime: "10:00",
      color: "#2196f3",
    });
  };


  return (
    <div className="w-72 bg-black text-white p-4 border-r border-gray-800 flex flex-col overflow-y-auto relative">
      {/* Create Button */}
    <button
      onClick={() => setShowForm(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg mb-4 font-semibold transition"
    >
      + Create Event
    </button>


      {/* Mini Calendar */}
      <MiniCalendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setCurrentDate={setCurrentDate}
        setView={setView}
      />

      {/* Events */}
      <EventList events={events} selectedDate={selectedDate} />

      {/* Create Event Form - NO OVERLAY */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white text-black shadow-2xl rounded-xl p-6 w-80">
            <EventForm
              modal={{ position: "center" }}
              form={form}
              setForm={setForm}
              onSave={saveEvent}
              onClose={() => {
                setShowForm(false);
                resetForm();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
