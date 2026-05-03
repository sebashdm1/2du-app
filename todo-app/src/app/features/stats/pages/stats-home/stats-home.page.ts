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
  templateUrl: './stats-home.page.html',
  styleUrl: './stats-home.page.scss',
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
