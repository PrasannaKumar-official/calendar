import React, { useState, useEffect } from "react";

const EventForm = ({ modal, form = {}, setForm, onSave, onClose }) => {
  const timeOptions = Array.from({ length: 96 }, (_, i) => {
    const h = Math.floor(i / 4).toString().padStart(2, "0");
    const m = (i % 4) * 15;
    return `${h}:${m.toString().padStart(2, "0")}`;
  });

  const predefinedColors = ["#f87171", "#60a5fa", "#34d399", "#facc15"];
  const [customColor, setCustomColor] = useState(form.color || "#a855f7");
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (!form.color) {
      setForm({ ...form, color: customColor });
    }
  }, []);

  const isValid =
    form.title &&
    form.startTime &&
    form.endTime &&
    form.endTime >= form.startTime;

  return (
    <div
      className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-xl shadow-2xl p-6 w-[400px] max-w-[90vw]"
      onKeyDown={(e) => {
        if (e.key === "Enter" && isValid) {
          e.preventDefault();
          onSave();
        }
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800 tracking-wide">
          {modal?.editMode ? "Edit Event" : "Create New Event"}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-red-500 text-2xl font-bold"
        >
          ×
        </button>
      </div>

      {/* Title */}
      <label className="text-sm font-medium text-gray-700">Event Title</label>
      <input
        type="text"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="Meeting with team"
        className="w-full border border-gray-300 px-3 py-2 mb-4 rounded-md text-sm focus:ring-2 focus:ring-blue-200"
      />

      {/* Date */}
      <label className="text-sm font-medium text-gray-700">Date</label>
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        className="w-full border border-gray-300 px-3 py-2 mb-4 rounded-md text-sm focus:ring-2 focus:ring-blue-200"
      />

      {/* Time Range */}
      <label className="text-sm font-medium text-gray-700">Time</label>
      <div className="flex gap-2 mb-4">
        <select
          value={form.startTime}
          onChange={(e) => {
            const newStart = e.target.value;
            const newEnd =
              form.endTime >= newStart ? form.endTime : newStart;
            setForm({ ...form, startTime: newStart, endTime: newEnd });
          }}
          className="flex-1 border border-gray-300 rounded-md px-2 py-2 text-sm"
        >
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>

        <span className="self-center">–</span>

        <select
          value={form.endTime}
          onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          className="flex-1 border border-gray-300 rounded-md px-2 py-2 text-sm"
        >
          {timeOptions
            .filter((t) => t >= form.startTime)
            .map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
        </select>
      </div>

      {/* Color Picker */}
      <label className="text-sm font-medium text-gray-700">Color</label>
      <div className="flex items-center gap-3 mb-4 mt-1">
        {predefinedColors.map((c, i) => (
          <button
            key={i}
            onClick={() => {
              setForm({ ...form, color: c });
              setShowColorPicker(false);
            }}
            className={`w-6 h-6 rounded-full ring-2 ${
              form.color === c
                ? "ring-black ring-offset-2"
                : "ring-transparent"
            }`}
            style={{ backgroundColor: c }}
            title={`Color ${i + 1}`}
          />
        ))}

        {/* Custom Color */}
        <div className="relative">
          <button
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setForm({ ...form, color: customColor });
            }}
            className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center"
            style={{ backgroundColor: customColor }}
            title="Custom Color"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 text-white pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
            </svg>
          </button>
          {showColorPicker && (
            <input
              type="color"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                setForm({ ...form, color: e.target.value });
              }}
              className="absolute top-8 left-0 w-24 h-8 p-0 border-none"
            />
          )}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={onSave}
        disabled={!isValid}
        className={`w-full py-2 rounded-md font-semibold text-sm transition ${
          isValid
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Save Event
      </button>
    </div>
  );
};

export default EventForm;
