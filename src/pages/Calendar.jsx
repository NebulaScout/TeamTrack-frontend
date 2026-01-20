import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import styles from "@/styles/dashboard.module.css";
import calendarStyles from "@/styles/calendar.module.css";
import { initialEvents } from "@/utils/mockData";
import EventModal from "@/components/EventModal";

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getDaySuffix = (day) => {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const formatDateForInput = (date) => {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  const suffix = getDaySuffix(day);
  return `${month} ${day}${suffix}, ${year}`;
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState("month");
  const [events, setEvents] = useState(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    type: "meeting",
    priority: "Medium",
    date: new Date(),
    startTime: "9:00 AM",
    endTime: "10:00 AM",
  });

  const navigateToPrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const navigateToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const buildMonthGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startingWeekday = firstDayOfMonth.getDay();
    const totalDaysInMonth = lastDayOfMonth.getDate();

    const gridDays = [];

    // Add days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingWeekday - 1; i >= 0; i--) {
      gridDays.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isAdjacentMonth: true,
      });
    }

    // Add days of current month
    for (let day = 1; day <= totalDaysInMonth; day++) {
      gridDays.push({
        date: new Date(year, month, day),
        isAdjacentMonth: false,
      });
    }

    // Add days from next month to complete the grid
    const remainingSlots = 42 - gridDays.length;
    for (let i = 1; i <= remainingSlots; i++) {
      gridDays.push({
        date: new Date(year, month + 1, i),
        isAdjacentMonth: true,
      });
    }

    return gridDays;
  };

  const findEventsForDate = (date) => {
    const dateKey = date.toISOString().split("T")[0];
    return events.filter((event) => event.date === dateKey);
  };

  const checkIfToday = (date) => {
    const today = new Date(); // Using current date
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getEventStyleClass = (eventType) => {
    const styleMap = {
      meeting: calendarStyles.meetingEvent,
      task: calendarStyles.taskEvent,
      deadline: calendarStyles.deadlineEvent,
      reminder: calendarStyles.reminderEvent,
    };
    return styleMap[eventType] || calendarStyles.taskEvent;
  };

  const handleDayClick = (date) => {
    setEventForm((prev) => ({ ...prev, date }));
    setIsModalOpen(true);
  };

  const calendarGrid = buildMonthGrid();

  return (
    <div className={styles.dashboardContainer}>
      <SideBar />
      <main className={styles.mainContent}>
        <Header title="Calendar" pageIntro="View and manage your schedule" />

        <div className={calendarStyles.calendarWrapper}>
          {/* Calendar Controls */}
          <div className={calendarStyles.calendarControls}>
            <div className={calendarStyles.monthNavigation}>
              <button
                className={calendarStyles.arrowBtn}
                onClick={navigateToPrevMonth}
              >
                <FiChevronLeft />
              </button>
              <h2 className={calendarStyles.monthTitle}>
                {MONTH_NAMES[currentDate.getMonth()]}{" "}
                {currentDate.getFullYear()}
              </h2>
              <button
                className={calendarStyles.arrowBtn}
                onClick={navigateToNextMonth}
              >
                <FiChevronRight />
              </button>
            </div>

            <div className={calendarStyles.controlActions}>
              <div className={calendarStyles.viewSelector}>
                <button
                  className={`${calendarStyles.viewBtn} ${selectedView === "month" ? calendarStyles.viewBtnSelected : ""}`}
                  onClick={() => setSelectedView("month")}
                >
                  Month
                </button>
                <button
                  className={`${calendarStyles.viewBtn} ${selectedView === "week" ? calendarStyles.viewBtnSelected : ""}`}
                  onClick={() => setSelectedView("week")}
                >
                  Week
                </button>
              </div>
              <button
                className={calendarStyles.newEventBtn}
                onClick={() => setIsModalOpen(true)}
              >
                <FiPlus /> Add Event
              </button>
            </div>
          </div>

          {/* Monthly View */}
          {selectedView === "month" && (
            <div className={calendarStyles.monthlyCalendar}>
              <div className={calendarStyles.dayLabels}>
                {WEEKDAY_NAMES.map((day) => (
                  <div key={day} className={calendarStyles.dayLabel}>
                    {day}
                  </div>
                ))}
              </div>
              <div className={calendarStyles.calendarDays}>
                {calendarGrid.map((dayInfo, idx) => {
                  const dayEvents = findEventsForDate(dayInfo.date);
                  const isToday = checkIfToday(dayInfo.date);
                  return (
                    <div
                      key={idx}
                      className={`${calendarStyles.calendarDay} ${dayInfo.isAdjacentMonth ? calendarStyles.adjacentMonth : ""} ${isToday ? calendarStyles.currentDay : ""} ${dayEvents.length > 0 ? calendarStyles.hasEvents : ""}`}
                      onClick={() => handleDayClick(dayInfo.date)}
                    >
                      <div className={calendarStyles.dateNumber}>
                        {dayInfo.date.getDate()}
                      </div>
                      <div className={calendarStyles.dayEventsList}>
                        {dayEvents.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className={`${calendarStyles.calendarEvent} ${getEventStyleClass(event.type)}`}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className={calendarStyles.calendarEvent}>
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Weekly View */}
          {selectedView === "week" && (
            <div className={calendarStyles.weeklyCalendar}>
              <div className={calendarStyles.weekHeader}>
                <div className={calendarStyles.hourColumn}></div>
                {WEEKDAY_NAMES.map((day, idx) => {
                  const weekStart = new Date(currentDate);
                  weekStart.setDate(
                    currentDate.getDate() - currentDate.getDay() + idx,
                  );
                  const isToday = checkIfToday(weekStart);
                  return (
                    <div
                      key={day}
                      className={`${calendarStyles.weekDayColumn} ${isToday ? calendarStyles.currentDay : ""}`}
                    >
                      <div className={calendarStyles.weekDayText}>{day}</div>
                      <div className={calendarStyles.weekDateNumber}>
                        {weekStart.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={calendarStyles.weekBody}>
                {Array.from({ length: 12 }, (_, i) => i + 7).map((hour) => (
                  <div key={hour} className={calendarStyles.hourRow}>
                    <div className={calendarStyles.hourLabel}>
                      {hour > 12 ? hour - 12 : hour}:00{" "}
                      {hour >= 12 ? "PM" : "AM"}
                    </div>
                    {WEEKDAY_NAMES.map((_, dayIdx) => (
                      <div
                        key={dayIdx}
                        className={calendarStyles.hourSlot}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add Event Modal */}
        {isModalOpen && (
          <EventModal
            events={events}
            setEvents={setEvents}
            eventForm={eventForm}
            setEventForm={setEventForm}
            setIsModalOpen={setIsModalOpen}
            formatDateForInput={formatDateForInput}
          />
        )}
      </main>
    </div>
  );
}
