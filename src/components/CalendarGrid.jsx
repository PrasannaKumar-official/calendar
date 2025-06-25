import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import CalendarHeader from "./CalendarHeader";
import CalendarViewRenderer from "./CalendarViewRenderer";
import EventForm from "./EventForm";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CalendarGrid = ({
  events,
  setEvents,
  currentDate,
  setCurrentDate,
  view,
  setView,
  setSelectedDate,
}) => {
  const [editingEvent, setEditingEvent] = useState(null);
  const [modal, setModal] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form, setForm] = useState({
    title: "",
    startTime: "",
    endTime: "",
    date: "",
    color: "#2196f3",
  });

  const isFirstLoad = useRef(true);
  const prevDateRef = useRef(currentDate);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (!dayjs(currentDate).isSame(prevDateRef.current, "day")) {
      setView(view); // trigger refresh
    }
    prevDateRef.current = currentDate;
  }, [currentDate]);

  const handleRC = (e, day, hour) => {
    e.preventDefault();
    setEditingEvent(null);
    setModal({ position: "center" });
    if (setSelectedDate) setSelectedDate(day);
    setForm({
      title: "",
      date: day.format("YYYY-MM-DD"),
      startTime: `${hour.toString().padStart(2, "0")}:00`,
      endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
      color: "#2196f3",
    });
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      color: event.color,
    });
    setModal({ position: "center", editMode: true });
    setSelectedEvent(null);
  };

  const handleDelete = (event) => {
    setEvents((prev) => prev.filter((ev) => ev !== event));
    setSelectedEvent(null);
  };

  const saveEv = () => {
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

    // ✅ Overlapping allowed — remove conflict alert
    if (editingEvent) {
      setEvents((prev) =>
        prev.map((ev) => (ev === editingEvent ? newEvent : ev))
      );
    } else {
      setEvents((prev) => [...prev, newEvent]);
    }

    setModal(null);
    setEditingEvent(null);
  };

  return (
    <div className="flex-1 bg-white relative p-4">
      {/* Header */}
      <CalendarHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        view={view}
        setView={setView}
        setEvents={setEvents}
      />

      {/* View Renderer */}
      <CalendarViewRenderer
        view={view}
        currentDate={currentDate}
        events={events}
        handleRC={handleRC}
        handleEdit={handleEdit}
        onEventClick={setSelectedEvent}
      />

      {/* Modal Form */}
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <EventForm
            modal={modal}
            form={form}
            setForm={setForm}
            onSave={saveEv}
            onClose={() => {
              setModal(null);
              setEditingEvent(null);
            }}
          />
        </div>
      )}

      {/* Mini Event Info Popup */}
      {selectedEvent && (
        <div className="fixed top-[20%] left-1/2 transform -translate-x-1/2 bg-white shadow-2xl border border-gray-200 rounded-xl p-5 w-72 z-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              {selectedEvent.title}
            </h3>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-gray-500 hover:text-red-500 text-xl font-bold"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {selectedEvent.startTime} – {selectedEvent.endTime}
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => handleEdit(selectedEvent)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              <EditIcon fontSize="small" /> Edit
            </button>
            <button
              onClick={() => handleDelete(selectedEvent)}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium text-sm"
            >
              <DeleteIcon fontSize="small" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarGrid;
