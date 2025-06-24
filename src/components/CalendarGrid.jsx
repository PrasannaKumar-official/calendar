import React, { useState } from "react";
import dayjs from "dayjs";
import DayView from "../views/DayView";
import WeekView from "../views/WeekView";
import MonthView from "../views/MonthView";
import YearView from "../views/YearView";
import EventForm from "../components/EventForm";
import { motion, AnimatePresence } from "framer-motion";

const CalendarGrid = ({ events, setEvents }) => {
  const [editingEvent, setEditingEvent] = useState(null);
  const [view, setView] = useState("week");
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    title: "",
    startTime: "",
    endTime: "",
    date: "",
    color: "#2196f3",
  });

  const changeView = (v) => setView(v);
  const goToToday = () => {
    setCurrentDate(dayjs());
    setView("week");
  };

  const handleRC = (e, day, hour) => {
    e.preventDefault();
    setEditingEvent(null); // Clear previous edit
    setModal({ position: "center" });
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
    setModal({ position: "center" });
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

    if (editingEvent) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev === editingEvent ? newEvent : ev
        )
      );
    } else {
      setEvents((prev) => [...prev, newEvent]);
    }

    setModal(null);
    setEditingEvent(null);
  };

  const shift = (dir) => {
    const unit =
      view === "day"
        ? "day"
        : view === "week"
        ? "week"
        : view === "month"
        ? "month"
        : "year";
    setCurrentDate((d) => (dir > 0 ? d.add(1, unit) : d.subtract(1, unit)));
  };

  const getLabel = () => {
    switch (view) {
      case "day":
        return currentDate.format("dddd, MMMM D, YYYY");
      case "week":
        const start = currentDate.startOf("week");
        const end = currentDate.endOf("week");
        return `${start.format("MMM D")} - ${end.format("MMM D, YYYY")}`;
      case "month":
        return currentDate.format("MMMM YYYY");
      case "year":
        return currentDate.format("YYYY");
      default:
        return "";
    }
  };

  const variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="flex-1 bg-white relative p-4">
      {/* Header */}
      <div className="grid grid-cols-3 items-center mb-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={goToToday}
            className="px-4 py-1.5 rounded-full border border-gray-400 text-sm font-medium text-black hover:bg-gray-100 transition"
          >
            Today
          </button>
          <button
            onClick={() => shift(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-400 text-lg font-light hover:bg-gray-100 transition"
            title="Previous"
          >
            ❮
          </button>
          <button
            onClick={() => shift(1)}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-400 text-lg font-light hover:bg-gray-100 transition"
            title="Next"
          >
            ❯
          </button>
          <div className="ml-4 text-lg font-semibold text-gray-800">
            {getLabel()}
          </div>
        </div>

        {/* Center View Buttons */}
        <div className="flex justify-center">
          <div className="flex gap-2">
            {["day", "week", "month", "year"].map((v) => (
              <button
                key={v}
                className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                  view === v
                    ? "bg-red-500 text-white"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => changeView(v)}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* View Content */}
      <AnimatePresence mode="wait">
        {view === "day" && (
          <motion.div key="day" variants={variants} initial="initial" animate="animate" exit="exit">
            <DayView currentDate={currentDate} events={events} onRightClick={handleRC} onEdit={handleEdit} />
          </motion.div>
        )}
        {view === "week" && (
          <motion.div key="week" variants={variants} initial="initial" animate="animate" exit="exit">
            <WeekView currentDate={currentDate} events={events} onRightClick={handleRC} onEdit={handleEdit} />
          </motion.div>
        )}
        {view === "month" && (
          <motion.div key="month" variants={variants} initial="initial" animate="animate" exit="exit">
            <MonthView currentDate={currentDate} events={events} onRightClick={handleRC} />
          </motion.div>
        )}
        {view === "year" && (
          <motion.div key="year" variants={variants} initial="initial" animate="animate" exit="exit">
            <YearView currentDate={currentDate} events={events} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
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
    </div>
  );
};

export default CalendarGrid;
