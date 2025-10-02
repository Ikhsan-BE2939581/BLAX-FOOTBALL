export interface Schedule {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  openSlots: string;
  bookedSlots: string;
  totalSlots: string;
  feePlayer: string;
  feeGk: string;
  typeEvent: string;
  typeMatch: string;
  imageUrl: string;
  description: string;
  gmapLink: string;
  address: string;
  facilities: Facilites[];
}

export interface ScheduleDetail extends Schedule {
  rules: Rules[];
  lineUp: object;
}

interface Facilites {
  id?: string;
  name: string;
}

export interface Rules {
  id?: string;
  description: string;
}

export interface ScheduleOverview {
  id: string;
  date: string;
  time: string;
  feeGk: number;
  feePlayer: number;
  name: string;
  venue: string;
  team: number;
  typeEvent: string;
  typeMatch: string;
  imageUrl: string;
  openSlots: number;
  bookedSlots: number;
  totalSlots: number;
  revenue: number;
  status: string;
  rules: Rules[];
  facilities: Facilites[];
}
