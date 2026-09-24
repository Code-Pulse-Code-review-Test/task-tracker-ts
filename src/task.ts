export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  priority: Priority;
  done: boolean;
  dueDate?: Date;
}

export function isOverdue(task: Task, today: Date = new Date()): boolean {
  if (task.done || !task.dueDate) return false;
  return task.dueDate.getTime() < today.getTime();
}
