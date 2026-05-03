import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import {
  IonContent, IonItem, IonInput, IonNote, ModalController,
} from '@ionic/angular/standalone';
import { Category } from '../../../../core/models/category.model';

function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  return (control.value ?? '').trim().length === 0 ? { whitespace: true } : null;
}

@Component({
  selector: 'app-category-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, IonContent, IonItem, IonInput, IonNote],
  template: `
    <div class="modal-header">
      <div class="header-row">
        <div class="back-btn" (click)="cancel()">←</div>
        <span class="back-label">Categorías</span>
      </div>
      <h2 class="modal-title">{{ category ? 'Editar Categoría' : 'Nueva Categoría' }}</h2>
    </div>

    <ion-content class="form-content">
      <div class="form-body">
        <div class="form-group">
          <div class="form-label">Nombre *</div>
          <ion-item class="form-item">
            <ion-input [formControl]="nameControl" placeholder="Ej: Trabajo" />
          </ion-item>
          @if (nameControl.invalid && nameControl.dirty) {
            <ion-note color="danger" class="ion-padding-start">El nombre no puede estar vacío</ion-note>
          }
        </div>

        <div class="form-group">
          <div class="form-label">Icono (emoji)</div>
          <ion-item class="form-item">
            <ion-input [formControl]="iconControl" placeholder="Ej: 💼  🏥  📚" />
          </ion-item>
        </div>

        <div class="form-group">
          <div class="form-label">Color</div>
          <div class="color-row">
            @for (c of colors; track c.key) {
              <div
                class="color-dot"
                [style.background]="c.bg"
                [class.selected]="colorControl.value === c.key"
                (click)="colorControl.setValue(c.key)"
              ></div>
            }
          </div>
        </div>
      </div>
    </ion-content>

    <div class="save-btn" [class.disabled]="nameControl.invalid" (click)="save()">
      Guardar categoría
    </div>
  `,
  styles: [`
    .modal-header {
      background: #16092E;
      padding: 12px 16px 20px;
    }

    .header-row {
      display: flex;
      align-items: center;
      gap: 10px;
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
    .modal-title { margin: 0; font-size: 22px; font-weight: 800; color: #fff; }

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

    .color-row {
      display: flex;
      gap: 12px;
      padding: 8px 0;
    }

    .color-dot {
      width: 32px; height: 32px;
      border-radius: 50%;
      cursor: pointer;
      border: 3px solid transparent;
      transition: border-color 0.15s;
    }

    .color-dot.selected {
      border-color: #16092E;
    }

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
export class CategoryFormComponent implements OnInit {
  @Input() category: Category | null = null;

  readonly nameControl = new FormControl('', [Validators.required, noWhitespaceValidator]);
  readonly iconControl = new FormControl<string | null>(null);
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
      this.iconControl.setValue(this.category.icon ?? null);
      this.colorControl.setValue(this.category.color ?? null);
    }
  }

  save(): void {
    if (this.nameControl.invalid) return;
    this.modalCtrl.dismiss(
      {
        name: (this.nameControl.value ?? '').trim(),
        icon: this.iconControl.value?.trim() || undefined,
        color: this.colorControl.value || undefined,
      },
      'confirm'
    );
  }

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
