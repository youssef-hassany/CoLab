export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: "high" | "medium" | "low";
  status: "issued" | "in-progress" | "in-review" | "done";
}

export type TaskStatus = "issued" | "in-progress" | "in-review" | "done";

export interface StatusConfig {
  title: string;
  color: string;
  count: number;
}

export interface TaskCategory {
  id: string;
  categoryName: string;
  categoryColor: string;
}
