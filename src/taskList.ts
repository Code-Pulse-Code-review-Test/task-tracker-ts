import { isOverdue, Priority, Task } from './task';

const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

// TODO: save tasks to a file so they survive a restart
export class TaskList {
  private tasks: Task[] = [];
  private nextId = 1;

  add(title: string, priority: Priority = 'medium', dueDate?: Date): Task {
    const trimmed = title.trim();
    if (!trimmed) {
      throw new Error('Task title cannot be empty');
    }

    const task: Task = { id: this.nextId++, title: trimmed, priority, done: false, dueDate };
    this.tasks.push(task);
    return task;
  }

  complete(id: number): void {
    const task = this.find(id);
    task.done = true;
  }

  remove(id: number): void {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  find(id: number): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new Error(`No task with id ${id}`);
    }
    return task;
  }

  pending(): Task[] {
    return this.tasks.filter((t) => !t.done);
  }

  byPriority(): Task[] {
    return [...this.pending()].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  overdue(today: Date = new Date()): Task[] {
    return this.tasks.filter((t) => isOverdue(t, today));
  }

  summary(): string {
    const doneCount = this.tasks.length - this.pending().length;
    return `${doneCount}/${this.tasks.length} tasks done`;
  }
}
