import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonContent, IonIcon,
  AlertController, ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sparklesOutline } from 'ionicons/icons';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../../categories/services/category.service';
import { TaskItemComponent } from '../../components/task-item/task-item.component';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { Task } from '../../../../core/models/task.model';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader, IonToolbar, IonContent, IonIcon,
    TaskItemComponent, BottomNavComponent,
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="greeting-row">
          <div class="avatar">SH</div>
          <div class="greeting-text">
            <span class="hello">Buenos días,</span>
            <span class="name">Sebastián ✦</span>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content [scrollY]="true">
      <div class="progress-card">
        <div class="pc-label">Progreso de hoy</div>
        <div class="pc-count">
          {{ completedCount() }}
          <span class="pc-total">de {{ allTasks() }}</span>
        </div>
        <div class="pc-sub">tareas completadas · {{ progressPercent() }}%</div>
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="progressPercent()"></div>
        </div>
      </div>

      @if (categoryService.categories().length > 0) {
        <div class="cat-chips">
          <div
            class="chip"
            [class.active]="taskService.selectedCategoryIds().length === 0"
            (click)="selectAllCategories()"
          >
            <span class="chip-dot" [style.background]="taskService.selectedCategoryIds().length === 0 ? '#fff' : '#9585B8'"></span>
            Todas
          </div>
          @for (cat of categoryService.categories(); track cat.id) {
            <div
              class="chip"
              [class.active]="isCategorySelected(cat.id)"
              (click)="selectCategory(cat.id)"
            >
              <span class="chip-dot" style="background: #E91E8C"></span>
              {{ cat.name }}
            </div>
          }
        </div>
      }

      @if (allTasks() > 0) {
        <div class="section-header">
          <h3>Pendientes</h3>
          <a>{{ pendingTasks().length }}</a>
        </div>
        @if (pendingTasks().length > 0) {
          @for (task of pendingTasks(); track task.id) {
            <app-task-item
              [task]="task"
              [categoryName]="getCategoryName(task.categoryId ?? undefined)"
              (toggleComplete)="onToggle($event)"
              (editRequest)="openForm($event)"
              (deleteRequest)="confirmDelete($event)"
            />
          }
        } @else {
          <p class="empty-msg">No hay tareas pendientes en este filtro.</p>
        }

        <div class="section-header">
          <h3>Completadas</h3>
          <a>{{ completedTasks().length }}</a>
        </div>
        @if (completedTasks().length > 0) {
          @for (task of completedTasks(); track task.id) {
            <app-task-item
              [task]="task"
              [categoryName]="getCategoryName(task.categoryId ?? undefined)"
              (toggleComplete)="onToggle($event)"
              (editRequest)="openForm($event)"
              (deleteRequest)="confirmDelete($event)"
            />
          }
        } @else {
          <p class="empty-msg">Aún no hay tareas completadas.</p>
        }
      } @else {
        <div class="empty-state">
          <ion-icon name="sparkles-outline" class="empty-icon" />
          <p>Sin tareas por hacer</p>
          <p class="empty-sub">Toca + para crear una</p>
        </div>
      }

      <div class="footer-spacer"></div>
      <app-bottom-nav activeTab="tasks" />
    </ion-content>
  `,
  styles: [`
    ion-toolbar {
      --background: #16092E;
      --padding-bottom: 16px;
    }

    .greeting-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 20px 0;
    }

    .avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: #E91E8C;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 14px; color: #fff;
      flex-shrink: 0;
    }

    .greeting-text {
      display: flex; flex-direction: column;
    }

    .hello { font-size: 12px; color: #9585B8; }
    .name  { font-size: 15px; font-weight: 700; color: #fff; }

    .progress-card {
      margin: 16px 16px 0;
      background: linear-gradient(135deg, #2A1558, #3D2080);
      border-radius: 16px;
      padding: 16px;
      color: #fff;
    }

    .pc-label { font-size: 12px; color: rgba(255,255,255,0.6); margin-bottom: 4px; }
    .pc-count { font-size: 28px; font-weight: 800; }
    .pc-total { font-size: 16px; font-weight: 400; opacity: .6; }
    .pc-sub   { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 2px; }

    .progress-bar {
      height: 6px;
      background: rgba(255,255,255,0.2);
      border-radius: 3px;
      margin-top: 12px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #E91E8C;
      border-radius: 3px;
      transition: width 0.4s ease;
    }

    .cat-chips {
      display: flex;
      gap: 8px;
      padding: 16px 16px 0;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .cat-chips::-webkit-scrollbar { display: none; }

    .chip {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      cursor: pointer;
      flex-shrink: 0;
      border: 1.5px solid #EAE0F7;
      color: #9585B8;
      background: #fff;
    }

    .chip.active {
      background: #16092E;
      color: #fff;
      border-color: #16092E;
    }

    .chip-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 16px 8px;
    }

    .section-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      color: #16092E;
    }

    .section-header a {
      font-size: 12px;
      color: #E91E8C;
      font-weight: 600;
    }

    .empty-msg {
      padding: 4px 16px 8px;
      font-size: 13px;
      color: #9585B8;
      margin: 0;
    }

    .empty-state {
      text-align: center;
      padding: 48px 32px;
    }

    .empty-icon {
      font-size: 48px;
      opacity: 0.35;
      color: #9585B8;
    }

    .empty-sub { color: #9585B8; font-size: 13px; }

    .footer-spacer { height: 84px; }
  `],
})
export class TaskListPage implements OnInit {
  protected readonly taskService = inject(TaskService);
  protected readonly categoryService = inject(CategoryService);

  private readonly modalCtrl = inject(ModalController);
  private readonly alertCtrl = inject(AlertController);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    addIcons({ sparklesOutline });
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([this.taskService.loadAll(), this.categoryService.loadAll()]);

    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      if (!params.has('create')) return;
      this.openForm();
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { create: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }

  allTasks(): number { return this.taskService.filteredTasks().length; }
  completedCount(): number { return this.taskService.filteredTasks().filter(t => t.completed).length; }
  progressPercent(): number {
    const all = this.taskService.tasks().length;
    return all === 0 ? 0 : Math.round(this.taskService.tasks().filter(t => t.completed).length / all * 100);
  }
  pendingTasks(): Task[] { return this.taskService.filteredTasks().filter(t => !t.completed); }
  completedTasks(): Task[] { return this.taskService.filteredTasks().filter(t => t.completed); }

  getCategoryName(categoryId?: string): string | undefined {
    if (!categoryId) return undefined;
    return this.categoryService.categories().find(c => c.id === categoryId)?.name;
  }

  isCategorySelected(id: string): boolean { return this.taskService.selectedCategoryIds().includes(id); }
  selectAllCategories(): void { this.taskService.setHomeCategoryFilter(null); }
  selectCategory(id: string): void { this.taskService.setHomeCategoryFilter(id); }

  async openForm(task?: Task): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: TaskFormComponent,
      componentProps: { task: task ?? null },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss<{
      title: string; categoryId?: string; dueDate?: string;
      priority?: 'high' | 'medium' | 'low'; description?: string; reminderLabel?: string;
    }>();
    if (role !== 'confirm' || !data) return;
    if (task) {
      await this.taskService.updateTask(task.id, {
        title: data.title, categoryId: data.categoryId ?? null,
        dueDate: data.dueDate, priority: data.priority,
        description: data.description, reminderLabel: data.reminderLabel,
      });
    } else {
      await this.taskService.addTask(data);
    }
  }

  async onToggle(task: Task): Promise<void> { await this.taskService.toggleComplete(task.id); }

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
    if (role === 'confirm') await this.taskService.deleteTask(task.id);
  }
}
