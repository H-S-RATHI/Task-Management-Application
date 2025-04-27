export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: "Low" | "Medium" | "High"
  createdAt: string
  userId: string
}

export interface User {
  id: string
  email: string
}
