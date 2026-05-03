import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { IonContent, IonIcon, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkOutline, trashOutline, closeOutline, pencilOutline } from 'ionicons/icons';
import { Task } from '../../../../core/models/task.model';
import { AppButtonComponent } from '../../../../shared/components/app-button/app-button.component';

export type TaskDetailAction = 'complete' | 'delete' | 'edit';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonContent, IonIcon, AppButtonComponent],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss',
})
export class TaskDetailComponent {
  @Input({ required: true }) task!: Task;
  @Input() categoryName: string | undefined;

  private readonly modalCtrl = inject(ModalController);

  constructor() {
    addIcons({ checkmarkOutline, trashOutline, closeOutline, pencilOutline });
  }

  priorityLabel(): string {
    if (this.task.priority === 'high') return 'Alta';
    if (this.task.priority === 'medium') return 'Media';
    if (this.task.priority === 'low') return 'Baja';
    return '';
  }

  dismiss(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  complete(): void {
    this.modalCtrl.dismiss('complete', 'action');
  }

  edit(): void {
    this.modalCtrl.dismiss('edit', 'action');
  }

  delete(): void {
    this.modalCtrl.dismiss('delete', 'action');
  }
}
