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
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="backToTasks()">
            <ion-icon slot="icon-only" name="arrow-back-outline" />
          </ion-button>
        </ion-buttons>
        <ion-title>Filtrar Tareas</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" (click)="clearAll()">Limpiar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card class="ion-margin">
        <ion-card-content>
          <p class="section-label">Categorias</p>
          <div class="chips-wrap">
            @for (category of categoryService.categories(); track category.id) {
              <ion-chip
                [color]="isCategorySelected(category.id) ? 'primary' : 'medium'"
                (click)="taskService.toggleCategoryFilter(category.id)"
              >
                <ion-label>{{ category.icon || '🏷️' }} {{ category.name }}</ion-label>
              </ion-chip>
            }
          </div>

          <p class="section-label">Prioridad</p>
          <div class="chips-wrap">
            <ion-chip [color]="isPrioritySelected('high') ? 'danger' : 'medium'" (click)="taskService.togglePriorityFilter('high')">
              <ion-label>🔴 Alta</ion-label>
            </ion-chip>
            <ion-chip [color]="isPrioritySelected('medium') ? 'warning' : 'medium'" (click)="taskService.togglePriorityFilter('medium')">
              <ion-label>🟠 Media</ion-label>
            </ion-chip>
            <ion-chip [color]="isPrioritySelected('low') ? 'success' : 'medium'" (click)="taskService.togglePriorityFilter('low')">
              <ion-label>🟢 Baja</ion-label>
            </ion-chip>
          </div>
        </ion-card-content>
      </ion-card>

      <div class="results-head ion-padding-horizontal ion-padding-top">
        <ion-badge color="tertiary">{{ taskService.filteredTasks().length }} resultados</ion-badge>
        <ion-note>{{ resultSummary() }}</ion-note>
      </div>

      <ion-list>
        @for (task of taskService.filteredTasks(); track task.id) {
          <ion-item>
            <ion-label>
              <h3>{{ task.title }}</h3>
              <p>{{ categoryName(task.categoryId) }} · {{ priorityLabel(task.priority) }}</p>
            </ion-label>
            @if (task.dueDate) {
              <ion-note slot="end">{{ shortDate(task.dueDate) }}</ion-note>
            }
          </ion-item>
        }
      </ion-list>

      <div style="height:84px"></div>
      <app-bottom-nav activeTab="tasks" />
    </ion-content>
  `,
  styles: [
    `
      .section-label {
        margin: 0 0 8px;
        font-weight: 600;
      }

      .chips-wrap {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 10px;
      }

      .results-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    `,
  ],
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
