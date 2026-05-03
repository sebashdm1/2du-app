import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  IonItemSliding, IonItem, IonItemOptions, IonItemOption,
  IonCheckbox, IonLabel, IonBadge, IonNote, IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, pencilOutline } from 'ionicons/icons';
import { Task } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonItemSliding, IonItem, IonItemOptions, IonItemOption,
    IonCheckbox, IonLabel, IonBadge, IonNote, IonIcon,
  ],
  template: `
    <ion-item-sliding>
      <ion-item-options side="start">
        <ion-item-option color="danger" (click)="deleteRequest.emit(task)">
          <ion-icon slot="icon-only" name="trash-outline" />
        </ion-item-option>
      </ion-item-options>

      <ion-item>
        <ion-checkbox
          slot="start"
          [checked]="task.completed"
          (ionChange)="toggleComplete.emit(task)"
        />
        <ion-label>
          <h2 [style.text-decoration]="task.completed ? 'line-through' : 'none'"
              [style.opacity]="task.completed ? '0.5' : '1'">
            {{ task.title }}
          </h2>
          @if (task.description) {
            <p style="margin:4px 0 6px;color:var(--ion-color-medium-shade)">
              {{ shortDescription(task.description) }}
            </p>
          }
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            @if (task.priority) {
              <ion-badge [color]="priorityColor(task.priority)">{{ priorityText(task.priority) }}</ion-badge>
            }
            @if (task.reminderLabel) {
              <ion-badge color="tertiary">Recordatorio: {{ task.reminderLabel }}</ion-badge>
            }
          </div>
          @if (categoryName) {
            <ion-badge color="medium">{{ categoryName }}</ion-badge>
          }
        </ion-label>
        @if (task.dueDate) {
          <ion-note slot="end">{{ formatDate(task.dueDate) }}</ion-note>
        }
      </ion-item>

      <ion-item-options side="end">
        <ion-item-option color="primary" (click)="editRequest.emit(task)">
          <ion-icon slot="icon-only" name="pencil-outline" />
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  `,
})
export class TaskItemComponent implements OnInit {
  @Input({ required: true }) task!: Task;
  @Input() categoryName: string | undefined;

  @Output() toggleComplete = new EventEmitter<Task>();
  @Output() editRequest = new EventEmitter<Task>();
  @Output() deleteRequest = new EventEmitter<Task>();

  ngOnInit(): void {
    addIcons({ trashOutline, pencilOutline });
  }

  formatDate(iso: string): string {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  priorityText(priority: NonNullable<Task['priority']>): string {
    if (priority === 'high') return 'Alta';
    if (priority === 'medium') return 'Media';
    return 'Baja';
  }

  priorityColor(priority: NonNullable<Task['priority']>): 'danger' | 'warning' | 'success' {
    if (priority === 'high') return 'danger';
    if (priority === 'medium') return 'warning';
    return 'success';
  }

  shortDescription(value: string): string {
    const clean = value.trim();
    if (clean.length <= 90) return clean;
    return `${clean.slice(0, 87)}...`;
  }
}
