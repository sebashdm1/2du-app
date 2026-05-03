import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonContent } from '@ionic/angular/standalone';
import { TaskService } from '../../../tasks/services/task.service';
import { CategoryService } from '../../../categories/services/category.service';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-stats-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonToolbar, IonContent, BottomNavComponent],
  templateUrl: './stats-home.page.html',
  styleUrl: './stats-home.page.scss',
})
export class StatsHomePage implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly categoryService = inject(CategoryService);

  readonly total = computed(() => this.taskService.tasks().length);
  readonly completed = computed(() => this.taskService.tasks().filter(t => t.completed).length);
  readonly pending = computed(() => this.taskService.tasks().filter(t => !t.completed).length);
  readonly completionRate = computed(() =>
    this.total() === 0 ? 0 : Math.round((this.completed() / this.total()) * 100)
  );

  readonly byPriority = computed(() => {
    const tasks = this.taskService.tasks();
    return {
      high:   tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low:    tasks.filter(t => t.priority === 'low').length,
    };
  });

  readonly byCategory = computed(() => {
    const tasks = this.taskService.tasks();
    const cats = this.categoryService.categories();
    return cats.map(cat => ({
      name:    cat.name,
      color:   cat.color ?? 'purple',
      total:   tasks.filter(t => t.categoryId === cat.id).length,
      pending: tasks.filter(t => t.categoryId === cat.id && !t.completed).length,
    })).filter(c => c.total > 0);
  });

  async ngOnInit(): Promise<void> {
    await Promise.all([this.taskService.loadAll(), this.categoryService.loadAll()]);
  }
}
