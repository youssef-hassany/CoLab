export type TaskStatus = "ISSUED" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface StatusConfig {
  title: string;
  color: string;
  count?: number;
}

interface TasksByStatus {
  ISSUED: Task[];
  IN_PROGRESS: Task[];
  IN_REVIEW: Task[];
  DONE: Task[];
}

export interface TaskCategory {
  id: string;
  categoryName: string;
  categoryColor: string;
}
