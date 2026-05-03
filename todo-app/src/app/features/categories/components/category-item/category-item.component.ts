import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonItem, IonLabel, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { pencilOutline, trashOutline, pricetagOutline } from 'ionicons/icons';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-category-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonItem, IonLabel, IonButton, IonIcon],
  template: `
    <ion-item>
      <span slot="start" style="font-size:1.2rem;min-width:1.5rem;text-align:center;">{{ category.icon || '🏷️' }}</span>
      <ion-label>
        <h2>{{ category.name }}</h2>
        <p>Pendientes: {{ pendingCount }}</p>
      </ion-label>
      <ion-button slot="end" fill="clear" (click)="editRequest.emit(category)">
        <ion-icon slot="icon-only" name="pencil-outline" />
      </ion-button>
      <ion-button slot="end" fill="clear" color="danger" (click)="deleteRequest.emit(category)">
        <ion-icon slot="icon-only" name="trash-outline" />
      </ion-button>
    </ion-item>
  `,
})
export class CategoryItemComponent implements OnInit {
  @Input({ required: true }) category!: Category;
  @Input() pendingCount = 0;
  @Output() editRequest = new EventEmitter<Category>();
  @Output() deleteRequest = new EventEmitter<Category>();

  ngOnInit(): void {
    addIcons({ pencilOutline, trashOutline, pricetagOutline });
  }
}
