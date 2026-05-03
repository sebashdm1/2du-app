import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonBadge,
} from '@ionic/angular/standalone';
import { TaskService } from '../../../tasks/services/task.service';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-stats-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonBadge, BottomNavComponent],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Stats</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-content>
          <h2>Productividad semanal</h2>
          <p>Vista inicial del rediseño. El detalle por dia quedara para el siguiente ajuste.</p>
          <ion-badge color="success">Completadas: {{ completedCount() }}</ion-badge>
          <ion-badge color="warning" class="ion-margin-start">Pendientes: {{ pendingCount() }}</ion-badge>
        </ion-card-content>
      </ion-card>

      <div style="height:84px"></div>
      <app-bottom-nav activeTab="stats" />
    </ion-content>
  `,
  styles: [
    `
      h2 {
        margin: 0 0 8px;
      }

      p {
        margin: 0 0 10px;
        color: var(--ion-color-medium-shade);
      }
    `,
  ],
})
export class StatsHomePage implements OnInit {
  private readonly taskService = inject(TaskService);

  async ngOnInit(): Promise<void> {
    await this.taskService.loadAll();
  }

  completedCount(): number {
    return this.taskService.tasks().filter((task) => task.completed).length;
  }

  pendingCount(): number {
    return this.taskService.tasks().filter((task) => !task.completed).length;
  }
}
