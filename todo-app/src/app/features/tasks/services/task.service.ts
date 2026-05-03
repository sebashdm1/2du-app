import { Injectable, computed, signal } from '@angular/core';
import { StorageService } from '../../../core/services/storage.service';
import { Task } from '../../../core/models/task.model';
import { generateUUID } from '../../../core/utils/uuid';

@Injectable({ providedIn: 'root' })
export class TaskService {
  readonly tasks = signal<Task[]>([]);
  readonly filterCategoryId = signal<string | null>(null);

  readonly filteredTasks = computed(() => {
    const filter = this.filterCategoryId();
    if (filter === null) return this.tasks();
    return this.tasks().filter(t => t.categoryId === filter);
  });

  constructor(private storage: StorageService) {}

  async loadAll(): Promise<void> {
    this.tasks.set(await this.storage.getTasks());
  }

  async addTask(input: {
    title: string;
    categoryId?: string;
    dueDate?: string;
    priority?: 'high' | 'medium' | 'low';
    description?: string;
    reminderLabel?: string;
  }): Promise<Task> {
    const task: Task = {
      id: generateUUID(),
      title: input.title.trim(),
      completed: false,
      categoryId: input.categoryId ?? null,
      createdAt: Date.now(),
      dueDate: input.dueDate,
      priority: input.priority,
      description: input.description,
      reminderLabel: input.reminderLabel,
    };
    await this.storage.saveTask(task);
    this.tasks.update(list => [...list, task]);
    return task;
  }

  async updateTask(
    id: string,
    patch: Partial<Pick<Task, 'title' | 'categoryId' | 'dueDate' | 'completed' | 'priority' | 'description' | 'reminderLabel'>>
  ): Promise<void> {
    const list = this.tasks();
    const idx = list.findIndex(t => t.id === id);
    if (idx < 0) return;
    const updated: Task = { ...list[idx], ...patch };
    await this.storage.saveTask(updated);
    this.tasks.update(tasks => tasks.map(t => t.id === id ? updated : t));
  }

  async toggleComplete(id: string): Promise<void> {
    const task = this.tasks().find(t => t.id === id);
    if (!task) return;
    await this.updateTask(id, { completed: !task.completed });
  }

  async deleteTask(id: string): Promise<void> {
    await this.storage.deleteTask(id);
    this.tasks.update(list => list.filter(t => t.id !== id));
  }

  async unassignCategory(categoryId: string): Promise<void> {
    const updated = this.tasks().map(t =>
      t.categoryId === categoryId ? { ...t, categoryId: null } : t
    );
    await this.storage.saveAllTasks(updated);
    this.tasks.set(updated);
  }
}
