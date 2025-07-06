import React, { useState } from "react";
import dayjs from "dayjs";
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
    if (!form.title.trim()) return;

    const [sh, sm] = form.startTime.split(":").map(Number);
    const [eh, em] = form.endTime.split(":").map(Number);

    const newEvent = {
      title: form.title,
      date: form.date,
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

    setEvents((prev) => [...prev, newEvent]);
    setShowForm(false);
    resetForm();
  };

  return (
    <div className="w-72 bg-black text-white p-4 border-r border-gray-800 flex flex-col overflow-y-auto">
      {/* Create Button */}
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg mb-4 font-semibold transition cursor-pointer"
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

      {/* Event List */}
      <EventList events={events} selectedDate={selectedDate} />

      {/* Modal Form - No overlay background */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto bg-white text-black rounded-xl shadow-2xl w-[400px] max-w-full p-5">
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
