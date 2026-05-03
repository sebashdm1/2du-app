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
    CategoryItemComponent, BottomNavComponent,
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="page-header">
          <h2 class="header-title">Categorías</h2>
          <div class="header-sub">{{ categoryService.categories().length }} categorías activas</div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="content-area">
        <div class="add-cat-btn" (click)="openForm()">
          <span>+</span> Nueva categoría
        </div>

        @if (categoryService.categories().length > 0) {
          <div class="cat-list">
            @for (cat of categoryService.categories(); track cat.id) {
              <app-category-item
                [category]="cat"
                [pendingCount]="pendingByCategory(cat.id)"
                (editRequest)="openForm($event)"
                (deleteRequest)="confirmDelete($event)"
              />
            }
          </div>
        } @else {
          <div class="empty-state">
            <p>Sin categorías creadas</p>
            <p class="empty-sub">Toca el botón de arriba para crear una</p>
          </div>
        }
      </div>

      <div class="footer-spacer"></div>
      <app-bottom-nav activeTab="categories" />
    </ion-content>
  `,
  styles: [`
    ion-toolbar {
      --background: #16092E;
      --padding-bottom: 20px;
    }

    .page-header { padding: 12px 20px 0; }
    .header-title { margin: 0; font-size: 26px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
    .header-sub { font-size: 13px; color: #9585B8; margin-top: 2px; }

    .content-area {
      background: #F8F5FF;
      min-height: 100%;
    }

    .add-cat-btn {
      margin: 16px 16px 8px;
      height: 48px;
      border-radius: 14px;
      border: 2px dashed #E91E8C;
      background: rgba(233,30,140,0.04);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 700;
      color: #E91E8C;
      cursor: pointer;
    }

    .cat-list {
      padding: 8px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .empty-state {
      text-align: center;
      padding: 48px 32px;
      color: #9585B8;
    }

    .empty-sub { font-size: 13px; margin-top: 4px; }

    .footer-spacer { height: 84px; }
  `],
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
