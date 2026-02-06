import {
  PRIORITY_MAP,
  PRIORITY_TO_API,
  EVENT_TYPE_MAP,
  EVENT_TYPE_TO_API,
} from "./enumMappings";

const formatTimeForAPI = (timeString) => {
  if (!timeString) return null;

  return `${timeString}:00.000Z`;
};

// Transform API response to frontend format
export const mapEventFromAPI = (apiCalendarEvent) => ({
  id: apiCalendarEvent.id,
  title: apiCalendarEvent.title,
  description: apiCalendarEvent.description || "",
  eventType: EVENT_TYPE_MAP[apiCalendarEvent.event_type] || "Meeting",
  priority: PRIORITY_MAP[apiCalendarEvent.priority] || "Low",
  eventDate: apiCalendarEvent.event_date,
  startTime: apiCalendarEvent.start_time,
  endTime: apiCalendarEvent.end_time,
  createdAt: apiCalendarEvent.created_at,
});

// Transform frontend data to API request format
export const mapCalendarEventToAPI = (calendarEvent) => ({
  title: calendarEvent.title,
  description: calendarEvent.description || "",
  event_type: EVENT_TYPE_TO_API[calendarEvent.eventType] || "MEETNG",
  priority: PRIORITY_TO_API[calendarEvent.priority] || "LOW",
  event_date: calendarEvent.eventDate,
  start_time: formatTimeForAPI(calendarEvent.startTime),
  end_time: formatTimeForAPI(calendarEvent.endTime),
});

// Transform an array of API calendar events
export const mapEventsFromAPI = (apiCalendarEvents) =>
  apiCalendarEvents.map(mapEventFromAPI);
