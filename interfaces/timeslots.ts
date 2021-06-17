export interface BasicTimeslot {
  id: number;
}

export interface Timeslot extends BasicTimeslot {
  start: Date;
  duration: number;
}
