import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, pencilOutline } from 'ionicons/icons';
import { Task } from '../../../../core/models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonItemSliding, IonItem, IonItemOptions, IonItemOption, IonIcon],
  template: `
    <ion-item-sliding>
      <ion-item-options side="start">
        <ion-item-option color="danger" (click)="deleteRequest.emit(task)">
          <ion-icon slot="icon-only" name="trash-outline" />
        </ion-item-option>
      </ion-item-options>

      <ion-item lines="none" class="task-item-host">
        <div class="task-card">
          <div
            class="check-circle"
            [class.checked]="task.completed"
            (click)="toggleComplete.emit(task)"
          >
            @if (task.completed) { <span class="check-mark">✓</span> }
          </div>

          <div class="task-body">
            <p class="task-title" [class.done]="task.completed">{{ task.title }}</p>
            <div class="task-meta">
              @if (categoryName) {
                <span class="cat-tag">{{ categoryName }}</span>
              }
              @if (task.dueDate) {
                <span class="task-date">📅 {{ formatDate(task.dueDate) }}</span>
              }
            </div>
          </div>

          @if (task.priority) {
            <div class="priority-dot" [class]="'pri-' + task.priority"></div>
          }
        </div>
      </ion-item>

      <ion-item-options side="end">
        <ion-item-option color="primary" (click)="editRequest.emit(task)">
          <ion-icon slot="icon-only" name="pencil-outline" />
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  `,
  styles: [`
    .task-item-host {
      --padding-start: 0;
      --inner-padding-end: 0;
      --background: transparent;
      --border-color: transparent;
      margin: 0 16px 10px;
    }

    .task-card {
      width: 100%;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: #ffffff;
      border: 1.5px solid #EAE0F7;
      border-radius: 14px;
      padding: 14px;
      cursor: pointer;
    }

    .check-circle {
      width: 22px; height: 22px;
      border-radius: 50%;
      border: 2px solid #EAE0F7;
      flex-shrink: 0;
      margin-top: 1px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .check-circle.checked {
      background: #E91E8C;
      border-color: #E91E8C;
    }

    .check-mark {
      font-size: 11px;
      color: #ffffff;
      font-weight: 700;
    }

    .task-body {
      flex: 1;
      min-width: 0;
    }

    .task-title {
      margin: 0 0 5px;
      font-size: 14px;
      font-weight: 600;
      color: #16092E;
      line-height: 1.3;
    }

    .task-title.done {
      text-decoration: line-through;
      color: #9585B8;
    }

    .task-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .cat-tag {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: rgba(233, 30, 140, 0.1);
      color: #E91E8C;
    }

    .task-date {
      font-size: 11px;
      color: #9585B8;
    }

    .priority-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 6px;
    }

    .pri-high   { background: #EF4444; }
    .pri-medium { background: #F97316; }
    .pri-low    { background: #22C55E; }
  `],
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
    return `${dd}/${mm}/${d.getFullYear()}`;
  }
}
