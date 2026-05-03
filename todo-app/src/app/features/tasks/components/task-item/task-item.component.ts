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
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
})
export class TaskItemComponent implements OnInit {
  @Input({ required: true }) task!: Task;
  @Input() categoryName: string | undefined;

  @Output() toggleComplete = new EventEmitter<Task>();
  @Output() editRequest = new EventEmitter<Task>();
  @Output() deleteRequest = new EventEmitter<Task>();
  @Output() tapRequest = new EventEmitter<Task>();

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
