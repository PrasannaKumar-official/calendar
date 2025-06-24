import React, { useState } from "react";
import dayjs from "dayjs";
import DayView from "./DayView";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import YearView from "./YearView";
import { motion, AnimatePresence } from "framer-motion";

const CalendarGrid = ({ events, setEvents }) => {
  const [view, setView] = useState("week");
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title: "", startTime: "", endTime: "", date: "" });

  const changeView = (v) => setView(v);
  const goToToday = () => {
    setCurrentDate(dayjs());
    setView("week");
  };

  const handleRC = (e, day, hour) => {
    e.preventDefault();
    setModal({ x: e.clientX, y: e.clientY, date: day.format("YYYY-MM-DD"), hour });
    setForm({
      title: "",
      date: day.format("YYYY-MM-DD"),
      startTime: `${hour.toString().padStart(2, "0")}:00`,
      endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
    });
  };

  const saveEv = () => {
    const [sh, sm] = form.startTime.split(":" ).map(Number);
    const [eh, em] = form.endTime.split(":" ).map(Number);
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const ne = {
      title: form.title,
      date: form.date,
      time: form.startTime,
      duration: `${form.startTime}-${form.endTime}`,
      color,
      startTime: form.startTime,
      endTime: form.endTime,
      startHour: sh,
      startMinute: sm,
      endHour: eh,
      endMinute: em,
    };
    setEvents((e) => [...e, ne]);
    setModal(null);
  };

  const shift = (dir) => {
    const unit = view === "day" ? "day" : view === "week" ? "week" : view === "month" ? "month" : "year";
    setCurrentDate((d) => (dir > 0 ? d.add(1, unit) : d.subtract(1, unit)));
  };

  const variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="flex-1 bg-white relative p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => shift(-1)}
            disabled={view === "day"}
            className={`px-3 py-1 rounded-md border border-gray-300 text-sm hover:bg-gray-100 transition ${view === "day" ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            &larr;
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 rounded-md border border-gray-300 text-sm hover:bg-gray-100 transition"
          >
            Today
          </button>
          <button
            onClick={() => shift(1)}
            disabled={view === "year"}
            className={`px-3 py-1 rounded-md border border-gray-300 text-sm hover:bg-gray-100 transition ${view === "year" ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            &rarr;
          </button>
        </div>

        <div className="flex gap-2">
          {['day', 'week', 'month', 'year'].map((v) => (
            <button
              key={v}
              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                view === v
                  ? 'bg-red-500 text-white'
                  : 'border border-gray-100 text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => changeView(v)}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        <input
          placeholder="Search"
          className="border border-gray-300 px-2 py-1 rounded-md text-sm"
        />
      </div>

      <AnimatePresence mode="wait">
        {view === "day" && (
          <motion.div key="day" variants={variants} initial="initial" animate="animate" exit="exit">
            <DayView currentDate={currentDate} events={events} onRightClick={handleRC} />
          </motion.div>
        )}
        {view === "week" && (
          <motion.div key="week" variants={variants} initial="initial" animate="animate" exit="exit">
            <WeekView currentDate={currentDate} events={events} onRightClick={handleRC} />
          </motion.div>
        )}
        {view === "month" && (
          <motion.div key="month" variants={variants} initial="initial" animate="animate" exit="exit">
            <MonthView currentDate={currentDate} events={events} />
          </motion.div>
        )}
        {view === "year" && (
          <motion.div key="year" variants={variants} initial="initial" animate="animate" exit="exit">
            <YearView currentDate={currentDate} events={events} />
          </motion.div>
        )}
      </AnimatePresence>

      {modal && (
        <div
          className="absolute bg-white border border-gray-300 rounded p-4 shadow-md z-10"
          style={{ top: modal.y, left: modal.x }}
        >
          <h3 className="font-semibold mb-2">Add Event</h3>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border border-gray-300 mb-2 w-full px-2 py-1 rounded-md text-sm"
          />
          <input
            type="time"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            className="border border-gray-300 mb-2 w-full px-2 py-1 rounded-md text-sm"
          />
          <input
            type="time"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            className="border border-gray-300 mb-2 w-full px-2 py-1 rounded-md text-sm"
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="border border-gray-300 mb-2 w-full px-2 py-1 rounded-md text-sm"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={saveEv}
              className="bg-blue-500 text-white px-4 py-1 rounded-md flex-1 text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setModal(null)}
              className="border border-gray-300 px-4 py-1 rounded-md flex-1 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarGrid;
