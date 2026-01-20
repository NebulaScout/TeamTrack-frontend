import React from "react";
import { FiX, FiClock } from "react-icons/fi";
import modalStyles from "@/styles/modals.module.css";

export default function EventModal({
  events,
  setEvents,
  eventForm,
  setEventForm,
  setIsModalOpen,
  formatDateForInput,
}) {
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const hr = hour % 12 || 12;
        const period = hour < 12 ? "AM" : "PM";
        const minutes = min.toString().padStart(2, "0");
        slots.push(`${hr}:${minutes} ${period}`);
      }
    }
    return slots;
  };

  const TIME_SLOT_OPTIONS = generateTimeSlots();

  const handleFormChange = (field, value) => {
    setEventForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();

    const newEvent = {
      id: events.length + 1,
      title: eventForm.title,
      description: eventForm.description,
      date: eventForm.date.toISOString().split("T")[0],
      type: eventForm.type,
      priority: eventForm.priority,
      startTime: eventForm.startTime,
      endTime: eventForm.endTime,
    };

    setEvents([...events, newEvent]);
    setEventForm({
      title: "",
      description: "",
      type: "meeting",
      priority: "Medium",
      date: new Date(),
      startTime: "9:00 AM",
      endTime: "10:00 AM",
    });
    setIsModalOpen(false);
  };
  return (
    <div className={modalStyles.modalOverlay}>
      <div className={modalStyles.modal}>
        <div className={modalStyles.modalHeader}>
          <h2>Create New Event</h2>
          <button
            className={modalStyles.btnClose}
            onClick={() => setIsModalOpen(false)}
          >
            <FiX />
          </button>
        </div>

        <form onSubmit={handleCreateEvent}>
          <div className={modalStyles.formGroup}>
            <label>Event Title</label>
            <input
              type="text"
              placeholder="Enter event title"
              value={eventForm.title}
              onChange={(e) => handleFormChange("title", e.target.value)}
              required
            />
          </div>

          <div className={modalStyles.formGroup}>
            <label>Description</label>
            <textarea
              placeholder="Add event details..."
              value={eventForm.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className={modalStyles.formRow}>
            <div className={modalStyles.formGroup}>
              <label>Event Type</label>
              <select
                value={eventForm.type}
                onChange={(e) => handleFormChange("type", e.target.value)}
              >
                <option value="meeting">Meeting</option>
                <option value="task">Task</option>
                <option value="deadline">Deadline</option>
                <option value="reminder">Reminder</option>
              </select>
            </div>

            <div className={modalStyles.formGroup}>
              <label>Priority</label>
              <select
                value={eventForm.priority}
                onChange={(e) => handleFormChange("priority", e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className={modalStyles.formGroup}>
            <label>Date</label>
            <input
              type="text"
              value={formatDateForInput(eventForm.date)}
              readOnly
              onClick={() => {
                /* Could integrate a date picker here */
              }}
            />
          </div>

          <div className={modalStyles.formRow}>
            <div className={modalStyles.formGroup}>
              <label>Start Time</label>
              <div className={modalStyles.timePickerWrapper}>
                <FiClock />
                <select
                  value={eventForm.startTime}
                  onChange={(e) =>
                    handleFormChange("startTime", e.target.value)
                  }
                >
                  {TIME_SLOT_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={modalStyles.formGroup}>
              <label>End Time</label>
              <div className={modalStyles.timePickerWrapper}>
                <FiClock />
                <select
                  value={eventForm.endTime}
                  onChange={(e) => handleFormChange("endTime", e.target.value)}
                >
                  {TIME_SLOT_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={modalStyles.modalActions}>
            <button
              type="button"
              className={modalStyles.btnCancel}
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className={modalStyles.btnCreate}>
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
