import { BasicTimeslot, Timeslot } from "./timeslots";
import { BasicCustomer, Customer } from "./customer";

export interface BasicAppointment {
  timeslot: BasicTimeslot;
  Customer: BasicCustomer;
}

export interface Appointment extends BasicAppointment {
  id: number;
}

export interface DetailedAppointment extends BasicAppointment {
  timeslot: Timeslot;
  Customer: Customer;
}
