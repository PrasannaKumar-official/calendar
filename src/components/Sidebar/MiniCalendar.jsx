// src/components/Sidebar/MiniCalendar.jsx
import React from "react";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const MiniCalendar = ({ selectedDate, setSelectedDate, setCurrentDate, setView }) => {
  const today = dayjs();

  if (!selectedDate || !dayjs.isDayjs(selectedDate)) {
    return <div className="text-white text-sm">Loading calendar...</div>;
  }

  const startOfMonth = selectedDate.startOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = selectedDate.daysInMonth();

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(startOfMonth.date(i));
  }

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setCurrentDate(date);
    setView("day");
  };

  const goToMonth = (dir) => {
    const newDate =
      dir === "prev" ? selectedDate.subtract(1, "month") : selectedDate.add(1, "month");
    setSelectedDate(newDate);
  };

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl font-bold text-white">
          {selectedDate.format("MMMM")}
          <span className="text-red-500 text-lg ml-2 font-semibold">
            {selectedDate.format("YYYY")}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => goToMonth("prev")}
            className="text-white hover:bg-gray-700 p-1 rounded-full transition cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft fontSize="medium" />
          </button>
          <button
            onClick={() => goToMonth("next")}
            className="text-white hover:bg-gray-700 p-1 rounded-full transition cursor-pointer"
            title="Next Month"
          >
            <ChevronRight fontSize="medium" />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {Array.from({ length: 42 }).map((_, i) => {
          const date = days[i];
          const isToday = date && date.isSame(today, "day");
          const isSelected = date && date.isSame(selectedDate, "day");

          return (
            <div
              key={i}
              onClick={() => date && handleDateClick(date)}
              className={`h-8 w-8 flex items-center justify-center rounded-full text-base transition
                ${isSelected
                  ? "bg-white text-black font-bold"
                  : isToday
                  ? "bg-red-500 text-white font-semibold"
                  : "text-gray-300 hover:bg-gray-700"} 
                ${date ? "cursor-pointer" : ""}
              `}
              title={date ? date.format("DD MMM YYYY") : ""}
            >
              {date ? date.date() : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
