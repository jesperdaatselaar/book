const { google } = require("googleapis");

class Event {
  constructor(auth) {
    this.auth = auth;
    this.calendar = google.calendar({ version: "v3", auth });
  }

  // Create event, return event
  async create(title, description, startTime, endTime, location) {
    let details = {
      summary: title,
      description: description,
      location: location,
      start: {
        dateTime: startTime,
        timeZone: "Europe/Amsterdam",
      },
      end: {
        dateTime: endTime,
        timeZone: "Europe/Amsterdam",
      },
    };
    try {
      return await this.calendar.events.insert({
        calendarId: process.env.calendarId,
        resource: details,
      });
    } catch (err) {
      return err;
    }
  }

  // Return Array of Events after now
  async getAll() {
    try {
      return await this.calendar.events.list({
        auth: this.auth,
        calendarId: process.env.calendarId,
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      });
    } catch (err) {
      return err;
    }
  }
  async getByDate(date) {
    console.log(date);
    try {
      return await this.calendar.events.list({
        auth: this.auth,
        calendarId: process.env.calendarId,
        timeMin: new Date(date),
        timeMax: new Date(date + 1000 * 60 * 60 * 24),
        singleEvents: true,
        orderBy: "startTime",
      });
    } catch (err) {
      return err;
    }
  }
  // Return event by (eventId)
  async getById(id) {
    try {
      return await this.calendar.events.get({
        calendarId: process.env.calendarId,
        eventId: id,
      });
    } catch (err) {
      return err;
    }
  }

  // Change event by (eventId), return event
  async change(id, title, description, startTime, endTime, location) {
    let original = (await this.getById(id)).data;
    let details = {
      summary: title || original.summary,
      description: description || original.description,
      location: location || original.location,
      start: {
        dateTime: startTime || original.startTime,
        timeZone: "Europe/Amsterdam",
      },
      end: {
        dateTime: endTime || original.endTime,
        timeZone: "Europe/Amsterdam",
      },
    };
    try {
      return await this.calendar.events.patch({
        auth: this.auth,
        calendarId: process.env.calendarId,
        eventId: id,
        resource: details,
      });
    } catch (err) {
      return err;
    }
  }

  async delete(id) {
    try {
      return await this.calendar.events.delete({
        calendarId: process.env.calendarId,
        eventId: id,
      });
    } catch (err) {
      return err;
    }
  }

  async addAttendee(id, email) {
    let details = {
      attendees: [
        {
          email: email,
        },
      ],
    };
    try {
      return await this.calendar.events.patch({
        auth: this.auth,
        calendarId: process.env.calendarId,
        eventId: id,
        resource: details,
      });
    } catch (err) {
      return err;
    }
  }

  async removeAttendee(id) {
    let details = {
      attendees: [],
    };
    try {
      return await this.calendar.events.patch({
        auth: this.auth,
        calendarId: process.env.calendarId,
        eventId: id,
        resource: details,
      });
    } catch (err) {
      return err;
    }
  }
}

module.exports = Event;
