export interface Student {
  id: string
  studentId: string
  name: string
  email?: string | null
  major?: string | null
  year?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  passwordHash?: string | null
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface FieldOption {
  id: string
  fieldName: string
  value: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Event {
  id: string
  title: string
  typeOptionId?: string | null
  customType?: string | null
  locationOptionId?: string | null
  customLocation?: string | null
  timeOptionId?: string | null
  customTime?: string | null
  dateTime: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  createdById: string
  typeOption?: FieldOption | null
  locationOption?: FieldOption | null
  timeOption?: FieldOption | null
  createdBy: User
}

export interface Attendance {
  id: string
  studentId: string
  eventId: string
  signedInAt: Date
  role?: string | null
  customRole?: string | null
  student: Student
  event: Event
  feedback?: Feedback | null
}

export interface Feedback {
  id: string
  attendanceId: string
  rating?: number | null
  recommendScore?: number | null
  heardViaOptionId?: string | null
  customHeardVia?: string | null
  openEnded?: any
  submittedAt: Date
  attendance: Attendance
  heardViaOption?: FieldOption | null
}

export interface DashboardData {
  totalEvents: number
  totalAttendees: number
  attendanceByType: Record<string, number>
  feedbackMetrics: {
    count: number
    responseRate: number
    averageRating: number
    npsScore: number
  }
}
