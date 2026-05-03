import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonChip,
  IonLabel,
  IonCard,
  IonCardContent,
  IonBadge,
  IonList,
  IonItem,
  IonNote,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../../categories/services/category.service';
import { Task } from '../../../../core/models/task.model';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-task-filters',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonChip,
    IonLabel,
    IonCard,
    IonCardContent,
    IonBadge,
    IonList,
    IonItem,
    IonNote,
    IonIcon,
    BottomNavComponent,
  ],
  templateUrl: './task-filters.page.html',
  styleUrl: './task-filters.page.scss',
})
export class TaskFiltersPage implements OnInit {
  readonly taskService = inject(TaskService);
  readonly categoryService = inject(CategoryService);

  private readonly router = inject(Router);

  constructor() {
    addIcons({ arrowBackOutline });
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([this.taskService.loadAll(), this.categoryService.loadAll()]);
  }

  isCategorySelected(categoryId: string): boolean {
    return this.taskService.selectedCategoryIds().includes(categoryId);
  }

  isPrioritySelected(priority: 'high' | 'medium' | 'low'): boolean {
    return this.taskService.selectedPriorities().includes(priority);
  }

  categoryName(categoryId: string | null): string {
    if (!categoryId) return 'Sin categoria';
    return this.categoryService.categories().find((c) => c.id === categoryId)?.name ?? 'Sin categoria';
  }

  priorityLabel(priority?: Task['priority']): string {
    if (priority === 'high') return 'Alta';
    if (priority === 'medium') return 'Media';
    if (priority === 'low') return 'Baja';
    return 'Sin prioridad';
  }

  shortDate(iso: string): string {
    const value = new Date(iso);
    if (Number.isNaN(value.getTime())) return '';
    return `${value.getDate()}/${value.getMonth() + 1}`;
  }

  resultSummary(): string {
    const categories = this.taskService.selectedCategoryIds().length;
    const priorities = this.taskService.selectedPriorities().length;
    if (categories === 0 && priorities === 0) return 'Sin filtros activos';
    return `${categories} categorias · ${priorities} prioridades`;
  }

  clearAll(): void {
    this.taskService.clearAllFilters();
  }

  backToTasks(): void {
    this.router.navigate(['/tasks']);
  }
}
