import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
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
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonItem, IonInput, IonSelect, IonSelectOption,
    IonDatetimeButton, IonDatetime, IonModal, IonNote, IonTextarea,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="cancel()">Cancelar</ion-button>
        </ion-buttons>
        <ion-title>{{ task ? 'Editar Tarea' : 'Nueva Tarea' }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-input
          label="Título *"
          labelPlacement="floating"
          [formControl]="form.controls.title"
          placeholder="Ej: Comprar leche"
        />
      </ion-item>
      @if (form.controls.title.invalid && form.controls.title.dirty) {
        <ion-note color="danger" class="ion-padding-start">
          El título no puede estar vacío
        </ion-note>
      }

      <ion-item>
        <ion-select
          label="Categoría"
          labelPlacement="floating"
          [formControl]="form.controls.categoryId"
          placeholder="Sin categoría"
        >
          <ion-select-option [value]="null">Sin categoría</ion-select-option>
          @for (cat of categoryService.categories(); track cat.id) {
            <ion-select-option [value]="cat.id">{{ cat.name }}</ion-select-option>
          }
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-textarea
          label="Descripción"
          labelPlacement="floating"
          [formControl]="form.controls.description"
          placeholder="Detalles opcionales"
          autoGrow="true"
        />
      </ion-item>

      <ion-item>
        <ion-select
          label="Prioridad"
          labelPlacement="floating"
          [formControl]="form.controls.priority"
          placeholder="Selecciona prioridad"
        >
          <ion-select-option value="high">Alta</ion-select-option>
          <ion-select-option value="medium">Media</ion-select-option>
          <ion-select-option value="low">Baja</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-input
          label="Recordatorio visual"
          labelPlacement="floating"
          [formControl]="form.controls.reminderLabel"
          placeholder="Ej: Revisar antes de almuerzo"
        />
      </ion-item>

      <ion-item>
        <ion-datetime-button datetime="task-datetime" />
      </ion-item>
      <ion-modal [keepContentsMounted]="true">
        <ng-template>
          <ion-datetime
            id="task-datetime"
            presentation="date"
            [formControl]="form.controls.dueDate"
          />
        </ng-template>
      </ion-modal>

      <ion-button
        expand="block"
        class="ion-margin-top"
        [disabled]="form.invalid"
        (click)="save()"
      >
        Guardar
      </ion-button>
    </ion-content>
  `,
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
