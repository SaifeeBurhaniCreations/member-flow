export type HouseColor = 'red' | 'blue' | 'green' | 'yellow';

export interface Member {
  id: string;
  fullName: string;
  surname: string;
  houseColor: HouseColor;
  address: string;
  itsNumber: string;
  mobileNumber: string;
  grade: string;
  className: string;
  profilePhoto?: string;
  createdAt: Date;
  isActive: boolean;
}

export interface Session {
  id: string;
  name: string;
  location: string;
  date: Date;
  startTime: string;
  endTime: string;
  notes?: string;
  createdAt: Date;
}

export interface Attendance {
  id: string;
  memberId: string;
  sessionId: string;
  isPresent: boolean;
  markedAt: Date;
}

export interface AttendanceStats {
  totalSessions: number;
  attendedSessions: number;
  missedSessions: number;
  attendancePercentage: number;
}
