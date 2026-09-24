import { describe, expect, it } from 'vitest';
import { TaskList } from '../src/taskList';

describe('TaskList', () => {
  it('adds a task with a trimmed title', () => {
    const list = new TaskList();
    const task = list.add('  write tests  ');
    expect(task.title).toBe('write tests');
    expect(task.done).toBe(false);
  });

  it('rejects an empty title', () => {
    const list = new TaskList();
    expect(() => list.add('   ')).toThrow();
  });

  it('sorts pending tasks by priority', () => {
    const list = new TaskList();
    list.add('a', 'low');
    list.add('b', 'high');
    list.add('c', 'medium');
    expect(list.byPriority().map((t) => t.title)).toEqual(['b', 'c', 'a']);
  });

  it('does not count finished tasks as overdue', () => {
    const list = new TaskList();
    const task = list.add('old', 'medium', new Date('2020-01-01'));
    expect(list.overdue()).toHaveLength(1);
    list.complete(task.id);
    expect(list.overdue()).toHaveLength(0);
  });

  it('builds a summary', () => {
    const list = new TaskList();
    const first = list.add('one');
    list.add('two');
    list.complete(first.id);
    expect(list.summary()).toBe('1/2 tasks done');
  });
});
