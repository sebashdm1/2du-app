import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import {
  IonHeader, IonToolbar,
  IonContent, IonItem, IonInput, IonSelect, IonSelectOption,
  IonDatetimeButton, IonDatetime, IonModal, IonNote, IonTextarea,
  ModalController,
} from '@ionic/angular/standalone';
import { Task } from '../../../../core/models/task.model';
import { CategoryService } from '../../../categories/services/category.service';

function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  return (control.value ?? '').trim().length === 0 ? { whitespace: true } : null;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    IonHeader, IonToolbar,
    IonContent, IonItem, IonInput, IonSelect, IonSelectOption,
    IonDatetimeButton, IonDatetime, IonModal, IonNote, IonTextarea,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit {
  @Input() task: Task | null = null;

  readonly categoryService = inject(CategoryService);
  private readonly modalCtrl = inject(ModalController);

  readonly form = new FormGroup({
    title: new FormControl('', [Validators.required, noWhitespaceValidator]),
    categoryId: new FormControl<string | null>(null),
    dueDate: new FormControl<string | null>(null),
    description: new FormControl<string | null>(null),
    priority: new FormControl<'high' | 'medium' | 'low' | null>('medium'),
    reminderLabel: new FormControl<string | null>(null),
  });

  ngOnInit(): void {
    if (this.task) {
      this.form.setValue({
        title: this.task.title,
        categoryId: this.task.categoryId ?? null,
        dueDate: this.task.dueDate ?? null,
        description: this.task.description ?? null,
        priority: this.task.priority ?? 'medium',
        reminderLabel: this.task.reminderLabel ?? null,
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    const { title, categoryId, dueDate, description, priority, reminderLabel } = this.form.getRawValue();
    this.modalCtrl.dismiss(
      {
        title: (title ?? '').trim(),
        categoryId: categoryId || undefined,
        dueDate: dueDate || undefined,
        description: description?.trim() ? description.trim() : undefined,
        priority: priority ?? undefined,
        reminderLabel: reminderLabel?.trim() ? reminderLabel.trim() : undefined,
      },
      'confirm'
    );
  }

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
