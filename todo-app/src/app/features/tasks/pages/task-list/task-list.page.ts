import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonContent, IonIcon,
  AlertController, ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sparklesOutline, funnelOutline } from 'ionicons/icons';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../../categories/services/category.service';
import { TaskItemComponent } from '../../components/task-item/task-item.component';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { TaskDetailComponent } from '../../components/task-detail/task-detail.component';
import { Task } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader, IonToolbar, IonContent, IonIcon,
    TaskItemComponent,
  ],
  templateUrl: './task-list.page.html',
  styleUrl: './task-list.page.scss',
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
    addIcons({ sparklesOutline, funnelOutline });
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

  hasAdvancedFilters(): boolean { return this.taskService.selectedPriorities().length > 0; }
  openFilters(): void { this.router.navigate(['/filters']); }

  async openDetail(task: Task): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: TaskDetailComponent,
      componentProps: {
        task,
        categoryName: this.getCategoryName(task.categoryId ?? undefined),
      },
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      cssClass: 'detail-modal',
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss<string>();
    if (role !== 'action' || !data) return;
    if (data === 'complete') {
      await this.taskService.toggleComplete(task.id);
    } else if (data === 'edit') {
      await this.openForm(task);
    } else if (data === 'delete') {
      await this.confirmDelete(task);
    }
  }

  async openForm(task?: Task): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: TaskFormComponent,
      componentProps: { task: task ?? null },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss<{
      title: string; categoryId?: string;
      priority?: 'high' | 'medium' | 'low'; description?: string;
    }>();
    if (role !== 'confirm' || !data) return;
    if (task) {
      await this.taskService.updateTask(task.id, {
        title: data.title, categoryId: data.categoryId ?? null,
        priority: data.priority, description: data.description,
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
