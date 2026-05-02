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
      <ion-icon name="pricetag-outline" slot="start" />
      <ion-label>{{ category.name }}</ion-label>
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
  @Output() editRequest = new EventEmitter<Category>();
  @Output() deleteRequest = new EventEmitter<Category>();

  ngOnInit(): void {
    addIcons({ pencilOutline, trashOutline, pricetagOutline });
  }
}
