import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
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
  imports: [
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonContent, IonItem, IonInput, IonNote,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="cancel()">Cancelar</ion-button>
        </ion-buttons>
        <ion-title>{{ category ? 'Editar Categoría' : 'Nueva Categoría' }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-input
          label="Nombre *"
          labelPlacement="floating"
          [formControl]="nameControl"
          placeholder="Ej: Trabajo"
        />
      </ion-item>
      @if (nameControl.invalid && nameControl.dirty) {
        <ion-note color="danger" class="ion-padding-start">
          El nombre no puede estar vacío
        </ion-note>
      }
      <ion-button
        expand="block"
        class="ion-margin-top"
        [disabled]="nameControl.invalid"
        (click)="save()"
      >
        Guardar
      </ion-button>
    </ion-content>
  `,
})
export class CategoryFormComponent implements OnInit {
  @Input() category: Category | null = null;

  readonly nameControl = new FormControl('', [Validators.required, noWhitespaceValidator]);

  private readonly modalCtrl = inject(ModalController);

  ngOnInit(): void {
    if (this.category) {
      this.nameControl.setValue(this.category.name);
    }
  }

  save(): void {
    if (this.nameControl.invalid) return;
    this.modalCtrl.dismiss({ name: (this.nameControl.value ?? '').trim() }, 'confirm');
  }

  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
