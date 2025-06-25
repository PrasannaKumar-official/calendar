import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import DayView from "../views/DayView";
import WeekView from "../views/WeekView";
import MonthView from "../views/MonthView";
import YearView from "../views/YearView";

const CalendarViewRenderer = ({
  view,
  currentDate,
  events,
  handleRC,
  handleEdit,
  onEventClick,
}) => {
  const variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <AnimatePresence mode="wait">
      {view === "day" && (
        <motion.div
          key="day"
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
        >
          <DayView
            currentDate={currentDate}
            events={events}
            onRightClick={handleRC}
            onEdit={handleEdit}
            onEventClick={onEventClick} 
          />
        </motion.div>
      )}

      {view === "week" && (
        <motion.div
          key="week"
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="overflow-hidden"
        >
          <WeekView
            currentDate={currentDate}
            events={events}
            onRightClick={handleRC}
            onEdit={handleEdit}
            onEventClick={onEventClick}
          />
        </motion.div>
      )}

      {view === "month" && (
        <motion.div
          key="month"
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <MonthView
            currentDate={currentDate}
            events={events}
            onRightClick={handleRC}
            onEventClick={onEventClick}
          />
        </motion.div>
      )}

      {view === "year" && (
        <motion.div
          key="year"
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
        >
          <YearView currentDate={currentDate} events={events} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CalendarViewRenderer;
