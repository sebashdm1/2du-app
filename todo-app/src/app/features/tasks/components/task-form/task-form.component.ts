import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  IonHeader, IonToolbar,
  IonContent, IonItem, IonInput, IonSelect, IonSelectOption,
  IonNote, IonTextarea,
  ModalController,
} from '@ionic/angular/standalone';
import { Task } from '../../../../core/models/task.model';
import { CategoryService } from '../../../categories/services/category.service';
import { noWhitespaceValidator } from '../../../../shared/validators/no-whitespace.validator';

@Component({
  selector: 'app-task-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    IonHeader, IonToolbar,
    IonContent, IonItem, IonInput, IonSelect, IonSelectOption,
    IonNote, IonTextarea,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit {
  @Input() task: Task | null = null;

  readonly categoryService = inject(CategoryService);
  private readonly modalCtrl = inject(ModalController);

  readonly form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(200), noWhitespaceValidator]),
    categoryId: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
    priority: new FormControl<'high' | 'medium' | 'low' | null>('medium'),
  });

  ngOnInit(): void {
    if (this.task) {
      this.form.setValue({
        title: this.task.title,
        categoryId: this.task.categoryId ?? null,
        description: this.task.description ?? null,
        priority: this.task.priority ?? 'medium',
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    const { title, categoryId, description, priority } = this.form.getRawValue();
    this.modalCtrl.dismiss(
      {
        title: (title ?? '').trim(),
        categoryId: categoryId || undefined,
        description: description?.trim() ? description.trim() : undefined,
        priority: priority ?? undefined,
      },
      'confirm'
    );
  }

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
