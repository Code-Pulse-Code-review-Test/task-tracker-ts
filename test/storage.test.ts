import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import { loadTasks, saveTasks } from '../src/storage';
import { TaskList } from '../src/taskList';

describe('storage', () => {
  const dir = mkdtempSync(join(tmpdir(), 'tasks-'));
  const file = join(dir, 'tasks.json');

  afterEach(() => rmSync(file, { force: true }));

  it('starts empty when there is no file yet', () => {
    expect(loadTasks(file).all()).toHaveLength(0);
  });

  it('keeps tasks, done flags and due dates between runs', () => {
    const list = new TaskList();
    const report = list.add('lab report', 'high', new Date('2026-10-01'));
    list.add('groceries', 'low');
    list.complete(report.id);
    saveTasks(list, file);

    const loaded = loadTasks(file);
    expect(loaded.all()).toHaveLength(2);
    expect(loaded.find(report.id).done).toBe(true);
    expect(loaded.find(report.id).dueDate).toEqual(new Date('2026-10-01'));
    expect(loaded.summary()).toBe('1/2 tasks done');
  });

  it('gives new tasks ids after the saved ones', () => {
    const list = new TaskList();
    list.add('one');
    list.add('two');
    saveTasks(list, file);

    const loaded = loadTasks(file);
    expect(loaded.add('three').id).toBe(3);
  });

  it('keeps tags and loads old files without them', () => {
    const list = new TaskList();
    list.add('tagged', 'low', undefined, ['uni']);
    saveTasks(list, file);
    expect(loadTasks(file).find(1).tags).toEqual(['uni']);

    writeFileSync(file, JSON.stringify([{ id: 1, title: 'old', priority: 'low', done: false }]));
    expect(loadTasks(file).find(1).tags).toEqual([]);
  });
});
