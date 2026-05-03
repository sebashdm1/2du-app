import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonContent, IonIcon, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForwardOutline, flagOutline, trashOutline, informationCircleOutline } from 'ionicons/icons';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { TaskService } from '../../../tasks/services/task.service';
import { CategoryService } from '../../../categories/services/category.service';

@Component({
  selector: 'app-settings-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonToolbar, IonContent, IonIcon, BottomNavComponent],
  templateUrl: './settings-home.page.html',
  styleUrl: './settings-home.page.scss',
})
export class SettingsHomePage {
  private readonly router = inject(Router);
  private readonly taskService = inject(TaskService);
  private readonly categoryService = inject(CategoryService);
  private readonly alertCtrl = inject(AlertController);

  constructor() {
    addIcons({ chevronForwardOutline, flagOutline, trashOutline, informationCircleOutline });
  }

  goToFeatureFlags(): void {
    this.router.navigate(['/feature-flags']);
  }

  async confirmReset(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Limpiar datos',
      message: 'Se eliminarán todas las tareas y categorías. Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar todo', role: 'confirm', cssClass: 'danger' },
      ],
    });
    await alert.present();
    const { role } = await alert.onWillDismiss();
    if (role === 'confirm') {
      await Promise.all([
        this.taskService.clearAll(),
        this.categoryService.clearAll(),
      ]);
    }
  }
}
