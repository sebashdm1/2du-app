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
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="form-header-row">
          <div class="back-btn" (click)="cancel()">←</div>
          <span class="back-label">Mis Tareas</span>
        </div>
        <h2 class="form-title">{{ task ? 'Editar Tarea' : 'Nueva Tarea' }}</h2>
      </ion-toolbar>
    </ion-header>

    <ion-content class="form-content">
      <div class="form-body">
        <div class="form-group">
          <div class="form-label">Título *</div>
          <ion-item class="form-item" [class.active-item]="form.controls.title.dirty">
            <ion-input
              [formControl]="form.controls.title"
              placeholder="Ej: Preparar demo técnica"
            />
          </ion-item>
          @if (form.controls.title.invalid && form.controls.title.dirty) {
            <ion-note color="danger" class="ion-padding-start">El título no puede estar vacío</ion-note>
          }
        </div>

        <div class="form-group">
          <div class="form-label">Descripción</div>
          <ion-item class="form-item">
            <ion-textarea
              [formControl]="form.controls.description"
              placeholder="Detalles opcionales"
              autoGrow="true"
            />
          </ion-item>
        </div>

        <div class="form-group">
          <div class="form-label">Categoría</div>
          <ion-item class="form-item">
            <ion-select
              [formControl]="form.controls.categoryId"
              placeholder="Sin categoría"
            >
              <ion-select-option [value]="null">Sin categoría</ion-select-option>
              @for (cat of categoryService.categories(); track cat.id) {
                <ion-select-option [value]="cat.id">{{ cat.icon ?? '' }} {{ cat.name }}</ion-select-option>
              }
            </ion-select>
          </ion-item>
        </div>

        <div class="form-group">
          <div class="form-label">Prioridad</div>
          <div class="priority-row">
            <button
              type="button"
              class="pri-btn"
              [class.pri-high-active]="form.controls.priority.value === 'high'"
              (click)="form.controls.priority.setValue('high')"
            >🔴 Alta</button>
            <button
              type="button"
              class="pri-btn"
              [class.pri-med-active]="form.controls.priority.value === 'medium'"
              (click)="form.controls.priority.setValue('medium')"
            >🟠 Media</button>
            <button
              type="button"
              class="pri-btn"
              [class.pri-low-active]="form.controls.priority.value === 'low'"
              (click)="form.controls.priority.setValue('low')"
            >🟢 Baja</button>
          </div>
        </div>

        <div class="form-group">
          <div class="form-label">Fecha límite</div>
          <ion-item class="form-item">
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
        </div>

        <div class="form-group">
          <div class="form-label">Recordatorio visual</div>
          <ion-item class="form-item">
            <ion-input
              [formControl]="form.controls.reminderLabel"
              placeholder="Ej: Revisar antes del almuerzo"
            />
          </ion-item>
        </div>
      </div>
    </ion-content>

    <div class="save-btn" [class.disabled]="form.invalid" (click)="save()">
      Guardar tarea
    </div>
  `,
  styles: [`
    ion-toolbar {
      --background: #16092E;
      --padding-bottom: 20px;
    }

    .form-header-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px 0;
      margin-bottom: 12px;
    }

    .back-btn {
      width: 32px; height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; cursor: pointer; color: #fff;
    }

    .back-label { font-size: 14px; color: rgba(255,255,255,0.6); }

    .form-title {
      margin: 0;
      padding: 0 16px;
      font-size: 22px;
      font-weight: 800;
      color: #fff;
    }

    .form-content { --background: #fff; }

    .form-body {
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-group { display: flex; flex-direction: column; gap: 6px; }

    .form-label {
      font-size: 12px;
      font-weight: 700;
      color: #16092E;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-item {
      --background: #F8F5FF;
      --border-color: #EAE0F7;
      --border-width: 1.5px;
      --border-radius: 12px;
      --padding-start: 14px;
    }

    .form-item.active-item { --border-color: #E91E8C; }

    .priority-row {
      display: flex;
      gap: 8px;
    }

    .pri-btn {
      flex: 1;
      padding: 8px 0;
      border-radius: 10px;
      border: 1.5px solid #EAE0F7;
      font-size: 12px;
      font-weight: 700;
      color: #9585B8;
      background: #fff;
      cursor: pointer;
    }

    .pri-high-active { background: rgba(239,68,68,0.08); border-color: #EF4444; color: #EF4444; }
    .pri-med-active  { background: rgba(249,115,22,0.08); border-color: #F97316; color: #F97316; }
    .pri-low-active  { background: rgba(34,197,94,0.08); border-color: #22C55E; color: #22C55E; }

    .save-btn {
      margin: 0 16px 16px;
      height: 52px;
      border-radius: 26px;
      background: #E91E8C;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      box-shadow: 0 6px 20px rgba(233,30,140,0.35);
      cursor: pointer;
    }

    .save-btn.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  `],
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
