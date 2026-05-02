import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { Category } from '../models/category.model';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor(private storage: Storage) {}

  async initialize(): Promise<void> {
    await this.storage.defineDriver(CordovaSQLiteDriver);
    await this.storage.create();
  }

  async getTasks(): Promise<Task[]> {
    return (await this.storage.get('tasks')) ?? [];
  }

  async saveTask(task: Task): Promise<void> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex((t) => t.id === task.id);
    if (index >= 0) {
      tasks[index] = task;
    } else {
      tasks.push(task);
    }
    await this.storage.set('tasks', tasks);
  }

  async deleteTask(taskId: string): Promise<void> {
    const tasks = await this.getTasks();
    await this.storage.set('tasks', tasks.filter((t) => t.id !== taskId));
  }

  async saveAllTasks(tasks: Task[]): Promise<void> {
    await this.storage.set('tasks', tasks);
  }

  async getCategories(): Promise<Category[]> {
    return (await this.storage.get('categories')) ?? [];
  }

  async saveCategory(category: Category): Promise<void> {
    const categories = await this.getCategories();
    const index = categories.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      categories[index] = category;
    } else {
      categories.push(category);
    }
    await this.storage.set('categories', categories);
  }

  async deleteCategory(categoryId: string): Promise<void> {
    const categories = await this.getCategories();
    await this.storage.set('categories', categories.filter((c) => c.id !== categoryId));
  }

  async saveAllCategories(categories: Category[]): Promise<void> {
    await this.storage.set('categories', categories);
  }
}
