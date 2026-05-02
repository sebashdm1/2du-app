import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList,
  IonFab, IonFabButton, IonIcon, IonButtons, IonButton,
  IonChip, IonLabel,
  AlertController, ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, checkmarkDoneOutline, pricetagsOutline } from 'ionicons/icons';
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
    IonHeader, IonToolbar, IonTitle, IonContent, IonList,
    IonFab, IonFabButton, IonIcon, IonButtons, IonButton,
    IonChip, IonLabel,
    TaskItemComponent,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Tareas</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="goToCategories()">
            <ion-icon slot="icon-only" name="pricetags-outline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      @if (categoryService.categories().length > 0) {
        <div class="ion-padding-horizontal" style="display:flex;flex-wrap:wrap;gap:4px;padding-top:8px;">
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
              <ion-label>{{ cat.name }}</ion-label>
            </ion-chip>
          }
        </div>
      }

      @if (taskService.filteredTasks().length > 0) {
        <ion-list>
          @for (task of taskService.filteredTasks(); track task.id) {
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
        <div class="ion-text-center ion-padding">
          <ion-icon name="checkmark-done-outline" style="font-size:48px;opacity:0.3" />
          @if (taskService.filterCategoryId() !== null) {
            <p>No hay tareas en esta categoría</p>
            <p>Toca + para agregar una</p>
          } @else {
            <p>Sin tareas por hacer</p>
            <p>Toca + para crear una</p>
          }
        </div>
      }

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button (click)="openForm()">
          <ion-icon name="add-outline" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
})
export class TaskListPage implements OnInit {
  protected readonly taskService = inject(TaskService);
  protected readonly categoryService = inject(CategoryService);

  private readonly modalCtrl = inject(ModalController);
  private readonly alertCtrl = inject(AlertController);
  private readonly router = inject(Router);

  constructor() {
    addIcons({ addOutline, checkmarkDoneOutline, pricetagsOutline });
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([this.taskService.loadAll(), this.categoryService.loadAll()]);
  }

  getCategoryName(categoryId?: string): string | undefined {
    if (!categoryId) return undefined;
    return this.categoryService.categories().find(c => c.id === categoryId)?.name;
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
    }>();
    if (role !== 'confirm' || !data) return;
    if (task) {
      await this.taskService.updateTask(task.id, {
        title: data.title,
        categoryId: data.categoryId ?? null,
        dueDate: data.dueDate,
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
}
