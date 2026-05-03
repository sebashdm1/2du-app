import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import {
  IonContent, IonItem, IonInput, IonNote, ModalController,
} from '@ionic/angular/standalone';
import { Category } from '../../../../core/models/category.model';
import { noWhitespaceValidator } from '../../../../shared/validators/no-whitespace.validator';

@Component({
  selector: 'app-category-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, IonContent, IonItem, IonInput, IonNote],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent implements OnInit {
  @Input() category: Category | null = null;

  readonly nameControl = new FormControl('', [Validators.required, noWhitespaceValidator]);
  readonly colorControl = new FormControl<string | null>(null);

  readonly colors = [
    { key: 'blue',   bg: 'rgba(59,130,246,0.6)' },
    { key: 'pink',   bg: 'rgba(233,30,140,0.6)' },
    { key: 'green',  bg: 'rgba(34,197,94,0.6)' },
    { key: 'orange', bg: 'rgba(249,115,22,0.6)' },
    { key: 'purple', bg: 'rgba(139,91,246,0.6)' },
  ];

  private readonly modalCtrl = inject(ModalController);

  ngOnInit(): void {
    if (this.category) {
      this.nameControl.setValue(this.category.name);
      this.colorControl.setValue(this.category.color ?? null);
    }
  }

  save(): void {
    if (this.nameControl.invalid) return;
    this.modalCtrl.dismiss(
      {
        name: (this.nameControl.value ?? '').trim(),
        color: this.colorControl.value || undefined,
      },
      'confirm'
    );
  }

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
