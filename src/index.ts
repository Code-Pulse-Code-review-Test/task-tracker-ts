import { loadTasks, saveTasks } from './storage';

const FILE = 'tasks.json';

const list = loadTasks(FILE);

if (list.all().length === 0) {
  list.add('Finish lab report', 'high', new Date('2026-10-01'));
  list.add('Buy groceries', 'low');
  const reading = list.add('Read chapter 4', 'medium');
  list.complete(reading.id);
}

console.log('Pending tasks by priority:');
for (const task of list.byPriority()) {
  console.log(`  [${task.priority}] ${task.title}`);
}
console.log(list.summary());

saveTasks(list, FILE);
