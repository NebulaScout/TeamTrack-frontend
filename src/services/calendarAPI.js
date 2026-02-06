import api from "./APIService";

export const CalendarEventAPI = {
  // Get all events
  getAll: async () => {
    const response = await api.get("/api/v1/calendar/events/");
    return response.data;
  },

  // Get a single event
  getEventById: async (id) => {
    const response = await api.get(`/api/v1/calendar/events/${id}/`);
    return response.data;
  },

  // create an event
  create: async (calendarData) => {
    const response = await api.post("/api/v1/calendar/events/", calendarData);
    return response.data;
  },

  // modify calendar event details
  update: async (id, calendarData) => {
    const response = await api.put(
      `/api/v1/calendar/events/${id}/`,
      calendarData,
    );
    return response.data;
  },

  // delete calendar event
  delete: async (id) => {
    const response = await api.delete(`/api/v1/calendar/events/${id}/`);
    return response.data;
  },
};
