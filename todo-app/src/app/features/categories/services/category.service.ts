import { Injectable, signal } from '@angular/core';
import { StorageService } from '../../../core/services/storage.service';
import { Category } from '../../../core/models/category.model';
import { generateUUID } from '../../../core/utils/uuid';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  readonly categories = signal<Category[]>([]);

  constructor(private storage: StorageService) {}

  async loadAll(): Promise<void> {
    this.categories.set(await this.storage.getCategories());
  }

  async addCategory(input: { name: string; color?: string; icon?: string }): Promise<Category> {
    const category: Category = { id: generateUUID(), name: input.name.trim(), color: input.color, icon: input.icon };
    await this.storage.saveCategory(category);
    this.categories.update(cats => [...cats, category]);
    return category;
  }

  async updateCategory(id: string, patch: Partial<Pick<Category, 'name' | 'color' | 'icon'>>): Promise<void> {
    const cats = this.categories();
    const idx = cats.findIndex(c => c.id === id);
    if (idx < 0) return;
    const updated = { ...cats[idx], ...patch, name: patch.name?.trim() ?? cats[idx].name };
    await this.storage.saveCategory(updated);
    this.categories.update(list => list.map(c => c.id === id ? updated : c));
  }

  async deleteCategory(id: string): Promise<void> {
    await this.storage.deleteCategory(id);
    this.categories.update(cats => cats.filter(c => c.id !== id));
  }
}
