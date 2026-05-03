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
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.scss',
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
