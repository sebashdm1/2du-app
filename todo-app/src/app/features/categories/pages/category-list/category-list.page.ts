import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList,
  IonFab, IonFabButton, IonIcon, IonBackButton, IonButtons,
  AlertController, ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, pricetagOutline } from 'ionicons/icons';
import { CategoryService } from '../../services/category.service';
import { CategoryItemComponent } from '../../components/category-item/category-item.component';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';
import { Category } from '../../../../core/models/category.model';
import { TaskService } from '../../../tasks/services/task.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonList,
    IonFab, IonFabButton, IonIcon, IonBackButton, IonButtons,
    CategoryItemComponent,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tasks" />
        </ion-buttons>
        <ion-title>Categorías</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      @if (categoryService.categories().length > 0) {
        <ion-list>
          @for (cat of categoryService.categories(); track cat.id) {
            <app-category-item
              [category]="cat"
              (editRequest)="openForm($event)"
              (deleteRequest)="confirmDelete($event)"
            />
          }
        </ion-list>
      } @else {
        <div class="ion-text-center ion-padding">
          <ion-icon name="pricetag-outline" style="font-size:48px;opacity:0.3" />
          <p>Sin categorías creadas</p>
          <p>Toca + para crear una</p>
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
export class CategoryListPage implements OnInit {
  protected readonly categoryService = inject(CategoryService);
  private readonly taskService = inject(TaskService);
  private readonly modalCtrl = inject(ModalController);
  private readonly alertCtrl = inject(AlertController);

  constructor() {
    addIcons({ addOutline, pricetagOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.categoryService.loadAll();
  }

  async openForm(category?: Category): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CategoryFormComponent,
      componentProps: { category: category ?? null },
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss<{ name: string }>();
    if (role !== 'confirm' || !data) return;
    if (category) {
      await this.categoryService.updateCategory(category.id, { name: data.name });
    } else {
      await this.categoryService.addCategory({ name: data.name });
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
