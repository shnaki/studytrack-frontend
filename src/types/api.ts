// --- User ---
export type User = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export type CreateUserRequest = {
  name: string // 1-100文字
}

// --- Subject ---
export type Subject = {
  id: string
  userId: string
  name: string
  createdAt: string
  updatedAt: string
}

export type CreateSubjectRequest = {
  name: string // 1-200文字
}

export type UpdateSubjectRequest = {
  name: string // 1-200文字
}

// --- Study Log ---
export type StudyLog = {
  id: string
  userId: string
  subjectId: string
  studiedAt: string
  minutes: number
  note: string
  createdAt: string
}

export type CreateStudyLogRequest = {
  subjectId: string
  studiedAt: string
  minutes: number // 1-1440
  note?: string // max 1000文字
}

// --- Goal ---
export type Goal = {
  id: string
  userId: string
  subjectId: string
  targetMinutesPerWeek: number
  startDate: string
  endDate?: string
  createdAt: string
  updatedAt: string
}

export type UpsertGoalRequest = {
  targetMinutesPerWeek: number // min 1
  startDate: string // YYYY-MM-DD
  endDate?: string // YYYY-MM-DD
}

// --- Stats ---
export type SubjectWeeklyStats = {
  subjectId: string
  subjectName: string
  totalMinutes: number
  targetMinutesPerWeek: number
  achievementRate: number
}

export type WeeklyStats = {
  weekStart: string
  subjects: SubjectWeeklyStats[] | null
  totalMinutes: number
}

// --- Error ---
export type ApiErrorDetail = {
  location?: string
  message?: string
  value?: unknown
}

export type ApiError = {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  errors?: ApiErrorDetail[] | null
}
