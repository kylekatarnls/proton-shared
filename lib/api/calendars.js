import { API_ROUTES } from '../constants';

const { CALENDAR } = API_ROUTES;

export const queryCalendars = (params) => ({
    url: `${CALENDAR}`,
    method: 'get',
    params
});

export const createCalendar = (data) => ({
    url: `${CALENDAR}`,
    method: 'post',
    data
});

export const setupCalendar = (calendarID, data) => ({
    url: `${CALENDAR}/${calendarID}/keys`,
    method: 'post',
    data
});

export const getCalendar = (calendarID) => ({
    url: `${CALENDAR}/${calendarID}`,
    method: 'get'
});

export const getFullCalendar = (calendarID) => ({
    url: `${CALENDAR}/${calendarID}/bootstrap`,
    method: 'get'
});

export const getCalendarKeys = (calendarID) => ({
    url: `${CALENDAR}/${calendarID}/keys`,
    method: 'get'
});

export const getAllCalendarKeys = (calendarID) => ({
    url: `${CALENDAR}/${calendarID}/keys/all`,
    method: 'get'
});

export const getPassphrases = (calendarID) => ({
    url: `${CALENDAR}/${calendarID}/passphrases`,
    method: 'get'
});

export const getPassphrase = (calendarID) => ({
    url: `${CALENDAR}/${calendarID}/passphrase`,
    method: 'get'
});

export const reactivateCalendarKey = (calendarID, keyID, data) => ({
    url: `${CALENDAR}/${calendarID}/keys/${keyID}`,
    method: 'put',
    data
});

export const getCalendarGroupReset = () => ({
    url: `${CALENDAR}/keys/reset`,
    method: 'get'
});

export const resetCalendarGroup = (data) => ({
    url: `${CALENDAR}/keys/reset`,
    method: 'post',
    data
});

export const pinPassphrase = (calendarID, eaid, data) => ({
    url: `${CALENDAR}/${calendarID}/passphrase/members/${eaid}`,
    method: 'put',
    data
});

export const updateCalendar = (calendarID, data) => ({
    url: `${CALENDAR}/${calendarID}`,
    method: 'put',
    data
});

export const removeCalendar = (calendarID) => ({
    url: `${CALENDAR}/${calendarID}`,
    method: 'delete'
});

export const queryMembers = (calendarID, params) => ({
    url: `${CALENDAR}/${calendarID}/members`,
    method: 'get',
    params
});

export const getAllMembers = (calendarID) => ({
    url: `${CALENDAR}/${calendarID}/members/all`,
    method: 'get'
});

export const addMember = (calendarID, data) => ({
    url: `${CALENDAR}/${calendarID}`,
    method: 'post',
    data
});

export const updateMember = (calendarID, memberID, data) => ({
    url: `${CALENDAR}/${calendarID}/members/${memberID}`,
    method: 'put',
    data
});

export const removeMember = (calendarID, memberID) => ({
    url: `${CALENDAR}/${calendarID}/members/${memberID}`,
    method: 'delete'
});

export const createEvent = (calendarID, data) => ({
    url: `${CALENDAR}/${calendarID}/events`,
    method: 'post',
    data
});

export const queryEvents = (calendarID, params) => ({
    url: `${CALENDAR}/${calendarID}/events`,
    method: 'get',
    params
});

export const getEvent = (calendarID, eventID) => ({
    url: `${CALENDAR}/${calendarID}/events/${eventID}`,
    method: 'get'
});

export const getEventHistory = (calendarID, eventID, params) => ({
    url: `${CALENDAR}/${calendarID}/events/${eventID}/history`,
    method: 'get',
    params
});

export const updateEvent = (calendarID, eventID, data) => ({
    url: `${CALENDAR}/${calendarID}/events/${eventID}`,
    method: 'put',
    data
});

export const addSharedEvent = (calendarID, data) => ({
    url: `${CALENDAR}/${calendarID}/shared/events`,
    method: 'post',
    data
});

export const deleteEvent = (calendarID, eventID) => ({
    url: `${CALENDAR}/${calendarID}/events/${eventID}`,
    method: 'delete'
});

export const getAttendees = (calendarID, eventID) => ({
    url: `${CALENDAR}/${calendarID}/events/${eventID}/attendees`,
    method: 'get'
});

export const addAttendee = (calendarID, eventID, data) => ({
    url: `${CALENDAR}/${calendarID}/events/${eventID}/attendees`,
    method: 'post',
    data
});

export const removeAttendee = (calendarID, eventID, attendeeID) => ({
    url: `${CALENDAR}/${calendarID}/events/${eventID}/attendees/${attendeeID}`,
    method: 'delete'
});

export const updateAttendee = (calendarID, eventID, attendeeID, data) => ({
    url: `${CALENDAR}/${calendarID}/events/${eventID}/attendees/${attendeeID}`,
    method: 'put',
    data
});

export const updateInvite = (uid, params) => ({
    url: `${CALENDAR}/events/${uid}/accept`,
    method: 'get',
    params
});

export const getCalendarSettings = (calendarID) => ({
    url: `${CALENDAR}/${calendarID}/settings`,
    method: 'get'
});

export const updateCalendarSettings = (calendarID, data) => ({
    url: `${CALENDAR}/${calendarID}/settings`,
    method: 'put',
    data
});

export const getCalendarUserSettings = () => ({
    url: 'settings/calendar',
    method: 'get'
});

export const updateCalendarUserSettings = (data) => ({
    url: 'settings/calendar',
    method: 'put',
    data
});

export const getEventsOccurrences = (calendarID, year, params) => ({
    url: `${CALENDAR}/${calendarID}/events/year/${year}`,
    method: 'get',
    params
});

export const queryCalendarAlarms = (calendarID, params) => ({
    url: `${CALENDAR}/${calendarID}/alarms`,
    method: 'get',
    params
});

export const getCalendarAlarm = (calendarID, alarmID) => ({
    url: `${CALENDAR}/${calendarID}/alarms/${alarmID}`,
    method: 'get'
});
