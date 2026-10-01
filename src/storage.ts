import { existsSync, readFileSync, writeFileSync } from 'fs';
import { Priority, Task } from './task';
import { TaskList } from './taskList';

// dates are kept as ISO strings in the file, older files have no tags
interface StoredTask {
  id: number;
  title: string;
  priority: Priority;
  done: boolean;
  dueDate?: string;
  tags?: string[];
}

export function saveTasks(list: TaskList, path: string): void {
  const stored: StoredTask[] = list.all().map((t) => ({ ...t, dueDate: t.dueDate?.toISOString() }));
  writeFileSync(path, JSON.stringify(stored, null, 2), 'utf8');
}

export function loadTasks(path: string): TaskList {
  if (!existsSync(path)) {
    return new TaskList();
  }

  const stored = JSON.parse(readFileSync(path, 'utf8')) as StoredTask[];
  const tasks: Task[] = stored.map((t) => ({
    ...t,
    dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
    tags: t.tags ?? [],
  }));
  return TaskList.fromTasks(tasks);
}
