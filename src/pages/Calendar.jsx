import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import styles from "@/styles/dashboard.module.css";
import calendarStyles from "@/styles/calendar.module.css";
import EventModal from "@/components/EventModal";
import { CalendarEventAPI } from "@/services/calendarAPI";
import {
  mapCalendarEventToAPI,
  mapEventsFromAPI,
  mapEventFromAPI,
} from "@/utils/calendarEventMapper";

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
// TODO: Add Calendar implementation in add event button to prevent errors

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState("month");
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    eventType: "Meeting",
    priority: "Medium",
    eventDate: "",
    startTime: "",
    endTime: "",
  });

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiEvents = await CalendarEventAPI.getAll();
      const mappedEvents = mapEventsFromAPI(apiEvents);
      console.log("Mapped Events: ", mappedEvents);
      setEvents(mappedEvents);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Failed to load events. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Create event handler
  const handleCreateEvent = async (eventData) => {
    try {
      const apiData = mapCalendarEventToAPI(eventData);
      const newEvent = await CalendarEventAPI.create(apiData);
      const mappedEvent = mapEventFromAPI(newEvent);
      setEvents((prev) => [...prev, mappedEvent]);
      return { success: true };
    } catch (err) {
      console.error("Failed to create a calendar event: ", err);
      return {
        success: false,
        error: "Failed to create event. Please try again.",
      };
    }
  };

  // // Delete event handler
  // const handleDeleteEvent = async (eventId) => {
  //   try {
  //     await CalendarEventAPI.delete(eventId);
  //     setEvents((prev) => prev.filter((event) => event.id !== eventId));
  //     return { success: true };
  //   } catch (err) {
  //     console.error("Failed to delete event: ", err);
  //     return {
  //       success: false,
  //       error: "Failed to delete event. Please try again.",
  //     };
  //   }
  // };

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

  const calendarGrid = useMemo(() => {
    console.log("Building Calendar...");
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
  }, [currentDate]);

  const findEventsForDate = (date) => {
    const dateKey = date.toISOString().split("T")[0];
    return events.filter((event) => event.eventDate === dateKey);
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
      Meeting: calendarStyles.meetingEvent,
      Task: calendarStyles.taskEvent,
      Deadline: calendarStyles.deadlineEvent,
      Reminder: calendarStyles.reminderEvent,
    };
    return styleMap[eventType] || calendarStyles.meetingEvent;
  };

  const handleDayClick = useCallback((date) => {
    console.log("Clicked date object: ", date);
    console.log(
      "Day:",
      date.getDate(),
      "Month:",
      date.getMonth() + 1,
      "Year:",
      date.getFullYear(),
    );

    setEventForm((prev) => ({ ...prev, eventDate: date }));
    setIsModalOpen(true);
  }, []);

  // const calendarGrid = buildMonthGrid();

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

          {/* Loading state */}
          {isLoading && (
            <div className={calendarStyles.loadingState}>Loading events...</div>
          )}

          {/* Error state */}
          {error && <div className={calendarStyles.errorState}>{error}</div>}

          {/* Monthly View */}
          {!isLoading && selectedView === "month" && (
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
          {!isLoading && selectedView === "week" && (
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
            eventForm={eventForm}
            setEventForm={setEventForm}
            setIsModalOpen={setIsModalOpen}
            formatDateForInput={formatDateForInput}
            onCreateEvent={handleCreateEvent}
          />
        )}
      </main>
    </div>
  );
}
