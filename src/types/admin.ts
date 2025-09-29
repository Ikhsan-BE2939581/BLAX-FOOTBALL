export interface AdminUser {
  id: string;
  user_id: string;
  access_level: "superadmin" | "moderator" | "admin";
  granted_at: string;
  user_profiles?: {
    name: string;
    user_id: string;
  };
}

export interface UserManagement {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  gamesPlayed: number;
  lastPlayed: string | null;
}
export interface AdminStats {
  totalPolicies: number;
  pendingVerification: number;
  totalUsers: number;
  activeAdmins: number;
  verificationsToday: number;
  flaggedContent: number;
}

export interface Roles {
  id: string;
  name: string;
}

export interface ReportBooking {
  totalBooking: number;
  totalRevenue: number;
  totalPlayers: number;
  schedules: ScheduleBookingReports[];
}

export interface ScheduleBookingReports {
  scheduleId: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  typeMatch: string;
  status: boolean;
  players: number;
  revenue: number;
}

export interface BookingHistory {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  scheduleName: string;
  venue: string;
  date: string;
  time: string;
  bookingType: "INDIVIDUAL" | "TEAM";
  playerCount: number;
  totalAmount: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "EXPIRED";
  bookedAt: string;
  paymentAt: string;
  totalBookings: number;
  confirmedStatus: number;
  pendingStatus: number;
  failedStatus: number;
}
