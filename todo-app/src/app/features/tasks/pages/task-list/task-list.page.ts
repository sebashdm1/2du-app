import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButtons,
  IonButton,
  IonChip,
  IonLabel,
  IonCard,
  IonCardContent,
  IonAvatar,
  IonProgressBar,
  IonBadge,
  AlertController,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline,
  checkmarkDoneOutline,
  pricetagsOutline,
  settingsOutline,
  sparklesOutline,
} from 'ionicons/icons';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../../categories/services/category.service';
import { TaskItemComponent } from '../../components/task-item/task-item.component';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { Task } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonFab,
    IonFabButton,
    IonIcon,
    IonButtons,
    IonButton,
    IonChip,
    IonLabel,
    IonCard,
    IonCardContent,
    IonAvatar,
    IonProgressBar,
    IonBadge,
    TaskItemComponent,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Tareas</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="goToFeatureFlags()" aria-label="Feature flags">
            <ion-icon slot="icon-only" name="settings-outline" />
          </ion-button>
          <ion-button (click)="goToCategories()">
            <ion-icon slot="icon-only" name="pricetags-outline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <section class="hero ion-padding">
        <div class="hero-head">
          <ion-avatar>
            <div class="avatar-face">S</div>
          </ion-avatar>
          <div>
            <p class="hero-subtitle">Buen dia</p>
            <h1>Sebastian, vamos por hoy</h1>
          </div>
        </div>

        <ion-card class="progress-card">
          <ion-card-content>
            <div class="progress-head">
              <p>Progreso de tareas</p>
              <ion-badge color="success">{{ completionPercent() }}%</ion-badge>
            </div>
            <ion-progress-bar [value]="completionRatio()" color="success" />
            <div class="progress-meta">
              <span>Total: {{ totalTasks() }}</span>
              <span>Pendientes: {{ pendingCount() }}</span>
              <span>Completadas: {{ completedCount() }}</span>
            </div>
          </ion-card-content>
        </ion-card>
      </section>

      @if (categoryService.categories().length > 0) {
        <div class="chips-wrap ion-padding-horizontal">
          <ion-chip
            [color]="taskService.filterCategoryId() === null ? 'primary' : 'medium'"
            (click)="taskService.filterCategoryId.set(null)"
          >
            <ion-label>Todas</ion-label>
          </ion-chip>
          @for (cat of categoryService.categories(); track cat.id) {
            <ion-chip
              [color]="taskService.filterCategoryId() === cat.id ? 'primary' : 'medium'"
              (click)="taskService.filterCategoryId.set(cat.id)"
            >
              <ion-label>{{ cat.icon || '🏷️' }} {{ cat.name }}</ion-label>
            </ion-chip>
          }
        </div>
      }

      @if (totalTasks() > 0) {
        <div class="section-title ion-padding-horizontal ion-margin-top">
          <h2>Pendientes</h2>
          <ion-badge color="warning">{{ pendingCount() }}</ion-badge>
        </div>
        @if (pendingTasks().length > 0) {
          <ion-list>
            @for (task of pendingTasks(); track task.id) {
              <app-task-item
                [task]="task"
                [categoryName]="getCategoryName(task.categoryId ?? undefined)"
                (toggleComplete)="onToggle($event)"
                (editRequest)="openForm($event)"
                (deleteRequest)="confirmDelete($event)"
              />
            }
          </ion-list>
        } @else {
          <p class="empty-section ion-padding-horizontal">No tienes tareas pendientes en este filtro.</p>
        }

        <div class="section-title ion-padding-horizontal ion-margin-top">
          <h2>Completadas</h2>
          <ion-badge color="success">{{ completedCount() }}</ion-badge>
        </div>
        @if (completedTasks().length > 0) {
          <ion-list>
            @for (task of completedTasks(); track task.id) {
              <app-task-item
                [task]="task"
                [categoryName]="getCategoryName(task.categoryId ?? undefined)"
                (toggleComplete)="onToggle($event)"
                (editRequest)="openForm($event)"
                (deleteRequest)="confirmDelete($event)"
              />
            }
          </ion-list>
        } @else {
          <p class="empty-section ion-padding-horizontal">Aun no completas tareas en este filtro.</p>
        }
      } @else {
        <div class="ion-text-center ion-padding empty-state">
          <ion-icon name="sparkles-outline" style="font-size:48px;opacity:0.35" />
          <p>Sin tareas por hacer</p>
          <p>Toca + para crear una</p>
        </div>
      }

      <ion-card class="flags-card ion-margin">
        <ion-card-content>
          <p>Demo de configuracion remota</p>
          <ion-button fill="outline" size="small" (click)="goToFeatureFlags()">
            Ver Feature Flags
          </ion-button>
        </ion-card-content>
      </ion-card>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button (click)="openForm()">
          <ion-icon name="add-outline" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styles: [
    `
      .hero {
        background: linear-gradient(135deg, #f7fafc 0%, #fff9f0 100%);
      }

      .hero-head {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .hero-head h1 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 700;
      }

      .hero-subtitle {
        margin: 0;
        color: var(--ion-color-medium);
        font-size: 0.85rem;
      }

      .avatar-face {
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
        background: var(--ion-color-primary);
        color: #fff;
        font-weight: 700;
      }

      .progress-card {
        margin: 0;
      }

      .progress-head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .progress-head p {
        margin: 0;
        font-weight: 600;
      }

      .progress-meta {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        gap: 6px;
        font-size: 0.8rem;
        color: var(--ion-color-medium-shade);
      }

      .chips-wrap {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        padding-top: 8px;
      }

      .section-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .section-title h2 {
        margin: 0;
        font-size: 1rem;
      }

      .empty-section {
        color: var(--ion-color-medium-shade);
        font-size: 0.9rem;
      }

      .flags-card {
        margin-bottom: 84px;
      }

      .flags-card p {
        margin: 0 0 8px;
        font-weight: 600;
      }

      .empty-state {
        padding-bottom: 24px;
      }
    `,
  ],
})
export class TaskListPage implements OnInit {
  protected readonly taskService = inject(TaskService);
  protected readonly categoryService = inject(CategoryService);

  private readonly modalCtrl = inject(ModalController);
  private readonly alertCtrl = inject(AlertController);
  private readonly router = inject(Router);

  constructor() {
    addIcons({
      addOutline,
      checkmarkDoneOutline,
      pricetagsOutline,
      settingsOutline,
      sparklesOutline,
    });
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([this.taskService.loadAll(), this.categoryService.loadAll()]);
  }

  totalTasks(): number {
    return this.taskService.filteredTasks().length;
  }

  completedCount(): number {
    return this.taskService.filteredTasks().filter((task) => task.completed).length;
  }

  pendingCount(): number {
    return this.totalTasks() - this.completedCount();
  }

  completionRatio(): number {
    const total = this.totalTasks();
    if (total === 0) return 0;
    return this.completedCount() / total;
  }

  completionPercent(): number {
    return Math.round(this.completionRatio() * 100);
  }

  pendingTasks(): Task[] {
    return this.taskService.filteredTasks().filter((task) => !task.completed);
  }

  completedTasks(): Task[] {
    return this.taskService.filteredTasks().filter((task) => task.completed);
  }

  getCategoryName(categoryId?: string): string | undefined {
    if (!categoryId) return undefined;
    return this.categoryService.categories().find((c) => c.id === categoryId)?.name;
  }

  async openForm(task?: Task): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: TaskFormComponent,
      componentProps: { task: task ?? null },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss<{
      title: string;
      categoryId?: string;
      dueDate?: string;
      priority?: 'high' | 'medium' | 'low';
      description?: string;
      reminderLabel?: string;
    }>();
    if (role !== 'confirm' || !data) return;
    if (task) {
      await this.taskService.updateTask(task.id, {
        title: data.title,
        categoryId: data.categoryId ?? null,
        dueDate: data.dueDate,
        priority: data.priority,
        description: data.description,
        reminderLabel: data.reminderLabel,
      });
    } else {
      await this.taskService.addTask(data);
    }
  }

  async onToggle(task: Task): Promise<void> {
    await this.taskService.toggleComplete(task.id);
  }

  async confirmDelete(task: Task): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar tarea',
      message: `¿Eliminar "${task.title}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'confirm', cssClass: 'danger' },
      ],
    });
    await alert.present();
    const { role } = await alert.onWillDismiss();
    if (role === 'confirm') {
      await this.taskService.deleteTask(task.id);
    }
  }

  goToCategories(): void {
    this.router.navigate(['/categories']);
  }

  goToFeatureFlags(): void {
    this.router.navigate(['/feature-flags']);
  }
}
