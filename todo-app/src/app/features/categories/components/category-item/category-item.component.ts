import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { pencilOutline, trashOutline } from 'ionicons/icons';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-category-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonIcon],
  template: `
    <div class="cat-item">
      <div class="cat-icon" [style.background]="iconBg()">
        <span>{{ category.icon || '🏷️' }}</span>
      </div>
      <div class="cat-info">
        <div class="cat-name">{{ category.name }}</div>
        <div class="cat-count">{{ pendingCount }} {{ pendingCount === 1 ? 'tarea pendiente' : 'tareas pendientes' }}</div>
      </div>
      <div class="cat-actions">
        <button class="icon-btn" (click)="editRequest.emit(category)" aria-label="Editar">
          <ion-icon name="pencil-outline" />
        </button>
        <button class="icon-btn delete" (click)="deleteRequest.emit(category)" aria-label="Eliminar">
          <ion-icon name="trash-outline" />
        </button>
      </div>
    </div>
  `,
  styles: [`
    .cat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #fff;
      border: 1.5px solid #EAE0F7;
      border-radius: 14px;
      padding: 14px;
    }

    .cat-icon {
      width: 40px; height: 40px;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }

    .cat-info { flex: 1; }
    .cat-name { font-size: 15px; font-weight: 700; color: #16092E; }
    .cat-count { font-size: 12px; color: #9585B8; margin-top: 2px; }

    .cat-actions { display: flex; gap: 6px; }

    .icon-btn {
      width: 32px; height: 32px;
      border-radius: 8px;
      background: #F8F5FF;
      border: none;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px;
      cursor: pointer;
      color: #9585B8;
    }

    .icon-btn.delete {
      color: #EF4444;
      background: rgba(239, 68, 68, 0.08);
    }
  `],
})
export class CategoryItemComponent implements OnInit {
  @Input({ required: true }) category!: Category;
  @Input() pendingCount = 0;
  @Output() editRequest = new EventEmitter<Category>();
  @Output() deleteRequest = new EventEmitter<Category>();

  ngOnInit(): void {
    addIcons({ pencilOutline, trashOutline });
  }

  iconBg(): string {
    const colorMap: Record<string, string> = {
      blue:   'rgba(59,130,246,0.12)',
      pink:   'rgba(233,30,140,0.12)',
      green:  'rgba(34,197,94,0.12)',
      orange: 'rgba(249,115,22,0.12)',
      purple: 'rgba(139,91,246,0.12)',
    };
    return colorMap[this.category.color ?? ''] ?? 'rgba(139,91,246,0.12)';
  }
}
