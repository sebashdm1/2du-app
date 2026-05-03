import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { pencilOutline, trashOutline, pricetagOutline } from 'ionicons/icons';
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
    addIcons({ pencilOutline, trashOutline, pricetagOutline });
  }

  private readonly colorMap: Record<string, { bg: string; fg: string }> = {
    blue:   { bg: 'rgba(59,130,246,0.12)',  fg: '#3B82F6' },
    pink:   { bg: 'rgba(233,30,140,0.12)',  fg: '#E91E8C' },
    green:  { bg: 'rgba(34,197,94,0.12)',   fg: '#22C55E' },
    orange: { bg: 'rgba(249,115,22,0.12)',  fg: '#F97316' },
    purple: { bg: 'rgba(139,91,246,0.12)',  fg: '#8B5BF6' },
  };

  iconBg(): string {
    return (this.colorMap[this.category.color ?? ''] ?? this.colorMap['purple']).bg;
  }

  iconColor(): string {
    return (this.colorMap[this.category.color ?? ''] ?? this.colorMap['purple']).fg;
  }
}
