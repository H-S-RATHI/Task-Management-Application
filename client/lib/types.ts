export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: string
  createdAt: string
  userId: string
}

export interface User {
  id: string
  email: string
}
