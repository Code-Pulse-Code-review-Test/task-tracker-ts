import { isOverdue, Priority, Task } from './task';

const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export class TaskList {
  private tasks: Task[] = [];
  private nextId = 1;

  // rebuild a list from saved tasks, new ids carry on after the highest one
  static fromTasks(tasks: Task[]): TaskList {
    const list = new TaskList();
    list.tasks = tasks.map((t) => ({ ...t, tags: [...t.tags] }));
    list.nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
    return list;
  }

  add(title: string, priority: Priority = 'medium', dueDate?: Date, tags: string[] = []): Task {
    const trimmed = title.trim();
    if (!trimmed) {
      throw new Error('Task title cannot be empty');
    }

    const task: Task = { id: this.nextId++, title: trimmed, priority, done: false, dueDate, tags: normaliseTags(tags) };
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

  tag(id: number, tag: string): void {
    const task = this.find(id);
    task.tags = normaliseTags([...task.tags, tag]);
  }

  all(): Task[] {
    return this.tasks.map((t) => ({ ...t, tags: [...t.tags] }));
  }

  withTag(tag: string): Task[] {
    const wanted = tag.trim().toLowerCase();
    return this.pending().filter((t) => t.tags.includes(wanted));
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

// lower case, no blanks, no repeats
function normaliseTags(tags: string[]): string[] {
  const cleaned = tags.map((t) => t.trim().toLowerCase()).filter((t) => t !== '');
  return [...new Set(cleaned)];
}
