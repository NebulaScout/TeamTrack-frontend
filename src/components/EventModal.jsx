import React, { useState } from "react";
import { FiX, FiClock } from "react-icons/fi";
import modalStyles from "@/styles/modals.module.css";

// Convert time string to 24hr format for datetime
// const convertTo24Hour = (timeStr) => {
//   const [time, period] = timeStr.split(" ");
//   let [hours, minutes] = timeStr.split(":").map(Number);

//   if (period === "PM" && hours !== 12) {
//     hours += 12;
//   } else if (period === "AM" && hours === 12) {
//     hours = 0;
//   }

//   return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
// };

// Combine date and time into ISO datetime string
// const combineDateAndTime = (date, timeStr) => {
//   const time24 = convertTo24Hour(timeStr)
//   const year = date.getFullYear()
//   const month = (date.getMonth() + 1).toString().padStart(2, "0")
//   const day = date.getDate().toString().padStart(2, "0")

//   return `${year}-${month}-${day}T${time24}`
// }

export default function EventModal({
  eventForm,
  setEventForm,
  setIsModalOpen,
  formatDateForInput,
  onCreateEvent,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

  // console.log("eventForm.eventDate:", eventForm.eventDate);
  // console.log("getDate()", eventForm.eventDate.getDate());

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Format date in local timezone
    const formatLocalDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    const eventData = {
      title: eventForm.title,
      description: eventForm.description,
      eventType: eventForm.eventType,
      priority: eventForm.priority,
      eventDate: formatLocalDate(eventForm.eventDate),
      startTime: eventForm.startTime,
      endTime: eventForm.endTime,
    };

    console.log("Event data: ", eventData);

    const result = await onCreateEvent(eventData);

    if (result.success) {
      setEventForm({
        title: "",
        description: "",
        eventType: "Meeting",
        priority: "Medium",
        eventDate: new Date(),
        startTime: "9:00 AM",
        endTime: "10:00 AM",
      });

      setIsModalOpen(false);
    } else {
      setError(result.error);
    }

    setIsSubmitting(false);
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
          {error && <div className={modalStyles.errorMessage}>{error}</div>}

          <div className={modalStyles.formGroup}>
            <label>Event Title</label>
            <input
              type="text"
              placeholder="Enter event title"
              value={eventForm.title}
              onChange={(e) => handleFormChange("title", e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={modalStyles.formGroup}>
            <label>Description</label>
            <textarea
              placeholder="Add event details..."
              value={eventForm.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className={modalStyles.formRow}>
            <div className={modalStyles.formGroup}>
              <label>Event Type</label>
              <select
                value={eventForm.type}
                onChange={(e) => handleFormChange("type", e.target.value)}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
              value={formatDateForInput(eventForm.eventDate)}
              readOnly
              onClick={() => {
                /* Integrate a date picker here */
              }}
            />
          </div>

          <div className={modalStyles.formRow}>
            <div className={modalStyles.formGroup}>
              <label>Start Time</label>
              {/* <div className={modalStyles.timePickerWrapper}>
                <FiClock />
                <select
                  value={eventForm.startTime}
                  onChange={(e) =>
                    handleFormChange("startTime", e.target.value)
                  }
                  disabled={isSubmitting}
                >
                  {TIME_SLOT_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div> */}
              <input
                type="time"
                value={eventForm.startTime}
                onChange={(e) => handleFormChange("startTime", e.target.value)}
              />
            </div>

            <div className={modalStyles.formGroup}>
              <label>End Time</label>
              {/* <div className={modalStyles.timePickerWrapper}>
                <FiClock />
                <select
                  value={eventForm.endTime}
                  onChange={(e) => handleFormChange("endTime", e.target.value)}
                  disabled={isSubmitting}
                >
                  {TIME_SLOT_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div> */}
              <input
                type="time"
                value={eventForm.endTime}
                onChange={(e) => handleFormChange("endTime", e.target.value)}
              />
            </div>
          </div>

          <div className={modalStyles.modalActions}>
            <button
              type="button"
              className={modalStyles.btnCancel}
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={modalStyles.btnCreate}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
