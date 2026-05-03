import { Injectable, computed, signal } from '@angular/core';
import { StorageService } from '../../../core/services/storage.service';
import { Task } from '../../../core/models/task.model';
import { generateUUID } from '../../../core/utils/uuid';

type TaskPriority = NonNullable<Task['priority']>;

@Injectable({ providedIn: 'root' })
export class TaskService {
  readonly tasks = signal<Task[]>([]);
  readonly selectedCategoryIds = signal<string[]>([]);
  readonly selectedPriorities = signal<TaskPriority[]>([]);

  readonly filteredTasks = computed(() => {
    const selectedCategories = this.selectedCategoryIds();
    const selectedPriorities = this.selectedPriorities();

    return this.tasks().filter((task) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        (task.categoryId !== null && selectedCategories.includes(task.categoryId));

      const matchesPriority =
        selectedPriorities.length === 0 ||
        (task.priority !== undefined && selectedPriorities.includes(task.priority));

      return matchesCategory && matchesPriority;
    });
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
    this.selectedCategoryIds.update((ids) => ids.filter((id) => id !== categoryId));
  }

  setHomeCategoryFilter(categoryId: string | null): void {
    if (categoryId === null) {
      this.selectedCategoryIds.set([]);
      return;
    }
    this.selectedCategoryIds.set([categoryId]);
  }

  toggleCategoryFilter(categoryId: string): void {
    this.selectedCategoryIds.update((ids) =>
      ids.includes(categoryId)
        ? ids.filter((id) => id !== categoryId)
        : [...ids, categoryId]
    );
  }

  togglePriorityFilter(priority: TaskPriority): void {
    this.selectedPriorities.update((priorities) =>
      priorities.includes(priority)
        ? priorities.filter((value) => value !== priority)
        : [...priorities, priority]
    );
  }

  clearAllFilters(): void {
    this.selectedCategoryIds.set([]);
    this.selectedPriorities.set([]);
  }
}
