import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonContent, AlertController, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { CategoryService } from '../../services/category.service';
import { CategoryItemComponent } from '../../components/category-item/category-item.component';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';
import { Category } from '../../../../core/models/category.model';
import { TaskService } from '../../../tasks/services/task.service';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader, IonToolbar, IonContent,
    CategoryItemComponent,
  ],
  templateUrl: './category-list.page.html',
  styleUrl: './category-list.page.scss',
})
export class CategoryListPage implements OnInit {
  protected readonly categoryService = inject(CategoryService);
  private readonly taskService = inject(TaskService);
  private readonly modalCtrl = inject(ModalController);
  private readonly alertCtrl = inject(AlertController);

  constructor() {
    addIcons({ addOutline });
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([this.categoryService.loadAll(), this.taskService.loadAll()]);
  }

  pendingByCategory(categoryId: string): number {
    return this.taskService.tasks().filter(t => !t.completed && t.categoryId === categoryId).length;
  }

  async openForm(category?: Category): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CategoryFormComponent,
      componentProps: { category: category ?? null },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss<{ name: string; icon?: string; color?: string }>();
    if (role !== 'confirm' || !data) return;
    if (category) {
      await this.categoryService.updateCategory(category.id, { name: data.name, icon: data.icon, color: data.color });
    } else {
      await this.categoryService.addCategory({ name: data.name, icon: data.icon, color: data.color });
    }
  }

  async confirmDelete(category: Category): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar categoría',
      message: `¿Eliminar "${category.name}"? Las tareas asignadas quedarán sin categoría.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'confirm', cssClass: 'danger' },
      ],
    });
    await alert.present();
    const { role } = await alert.onWillDismiss();
    if (role === 'confirm') {
      await this.taskService.unassignCategory(category.id);
      await this.categoryService.deleteCategory(category.id);
    }
  }
}
