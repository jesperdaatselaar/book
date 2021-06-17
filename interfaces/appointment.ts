import { BasicTimeslot, Timeslot } from "./timeslots";
import { BasicUser, User } from "./user";

export interface BasicAppointment {
  timeslot: BasicTimeslot;
  user: BasicUser;
}

export interface Appointment extends BasicAppointment {
  id: number;
}

export interface DetailedAppointment extends BasicAppointment {
  timeslot: Timeslot;
  user: User;
}
